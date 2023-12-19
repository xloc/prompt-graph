<script setup lang="ts">
import ConnectionCanvas from './components/ConnectionCanvas.vue';
import BlockEdit from './components/BlockEditPage.vue';
import Block from "./components/Block.vue";
import { BlockModel, dump, load } from './models/model';
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import SettingsPage from './components/SettingsPage.vue';
import SearchPage from './components/SearchPage/SearchPage.vue';
import FilePage from './components/FilePage/FilePage.vue';
import { EDITING_FILE_PRIMARY_KEY, GraphFile, db, getEditingFile } from './models/file-db';
import _, { debounce } from 'lodash';
import { readableTime } from './formatter/time';
import { Action } from './models/action';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import InferenceWidget from './components/inference/InferenceWidget.vue';
import { useInference } from './models/inference';
import { useLocalStorage } from '@vueuse/core';



const editingFile = ref<GraphFile>();
onMounted(async () => {
  editingFile.value = await getEditingFile();
});

const selectedBlockIndex = ref<number | null>(null);

const blocks = ref<BlockModel[]>([]);
watchEffect(() => {
  if (!editingFile.value) return;
  // FIXME: could be a cycle: editingFile -> blocks -> editingFile
  blocks.value = load(editingFile.value.content);
});

// debounced save to db, when blocks changed
const saveToDB = debounce(async () => {
  // FIXME: the function fire twice when move block around
  if (!editingFile.value || editingFile.value.id === undefined) return;

  editingFile.value.content = dump(blocks.value);
  editingFile.value.updateAt = new Date();
  await db.files.put({ ...editingFile.value }, editingFile.value.id);
  localStorage.setItem(EDITING_FILE_PRIMARY_KEY, editingFile.value.id.toString());
}, 500)
watch(
  () => [blocks.value, editingFile.value] as const,
  ([, prevFile], [, currFile]) => {
    if (prevFile?.id !== currFile?.id) return;
    saveToDB();
  },
  { deep: true }
);

// save new file to db
// new file has its id undefined. new upload or create empty file trigger this
watchEffect(async () => {
  if (!editingFile.value) return;
  if (editingFile.value.id === undefined) {
    editingFile.value.id = await db.files.add({ ...editingFile.value }) as number;
  }
});


const commandKeyPressed = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === "p") {
    event.preventDefault();
    event.stopPropagation();
    showSearch.value = true;
  }
}
onMounted(() => {
  window.addEventListener('keydown', commandKeyPressed);
});
onUnmounted(() => {
  window.removeEventListener('keydown', commandKeyPressed);
});

const mousePosition = ref<{ x: number, y: number }>({ x: 0, y: 0 });
const updateMousePosition = (event: MouseEvent) => {
  mousePosition.value = { x: event.clientX, y: event.clientY };
}

// modal and its controls
const editingBlockIndex = ref<number | null>(null);
const showSettings = ref(false);
const showFiles = ref(localStorage.getItem("showFiles") === "true");
const showSearch = ref(false);
watchEffect(() => {
  localStorage.setItem("showFiles", showFiles.value.toString());
});

// inferencing
const inference = useInference(blocks);
const showInferenceToolbar = useLocalStorage('inference-toolbar-show', false);


const actions: Action[] = [
  { id: 'files', name: 'Open Files...', action: () => showFiles.value = true },
  { id: 'new_file', name: 'Create a New File' },
  { id: 'show_settings', name: "Open Settings", action: () => showSettings.value = true },
  { id: 'show_inference', name: "Show Inference Toolbar", action: () => showInferenceToolbar.value = true },
  { id: 'hide_inference', name: "Hide Inference Toolbar", action: () => showInferenceToolbar.value = false },
  {
    id: 'add_block', name: 'Add Block', action: () => {
      blocks.value.push({
        id: Math.random().toString(36).substr(2, 9),
        title: 'New Block',
        prompt: 'New Prompt',
        xyhw: { x: mousePosition.value.x, y: mousePosition.value.y, width: 200, height: 150 }
      });
    }
  },
  {
    id: 'delete_block', name: 'Delete Block under Cursor', action: () => {
      if (selectedBlockIndex.value === null) return;
      blocks.value.splice(selectedBlockIndex.value, 1);
    }
  },
]

</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden bg-[url('/src/assets/grid.svg')]">
    <div @mousemove="updateMousePosition" class="absolute inset-0">

    </div>
    <div class="bg-zinc-200"></div>
    <div class="absolute bottom-3 right-3" v-if="editingFile">
      <h1 class="text-xl text-gray-300 text-right">
        {{ editingFile.fileName }}</h1>
      <p class="text-sm font-light text-gray-200 text-right">
        {{ readableTime(editingFile.createAt, 'created') }}</p>
      <p class="text-sm font-light text-gray-200 text-right">
        {{ readableTime(editingFile.updateAt, 'updated') }}</p>
    </div>
    <Block v-for="(_, i) in blocks" v-model="blocks[i]" :key="i" class="z-0"
      :class="{ 'ring-1 ring-violet-500': selectedBlockIndex === i }"
      @edit="editingBlockIndex = i" @click.meta="editingBlockIndex = i"
      @click="selectedBlockIndex = selectedBlockIndex !== i ? i : null" />
    <ConnectionCanvas :blocks="blocks" class="absolute pointer-events-none" />

    <button @click="showSearch = true"
      class="absolute bottom-5 left-5 p-3 rounded-full border shadow-md w-12 h-12 overflow-hidden |
      bg-white hover:bg-gray-50">
      <MagnifyingGlassIcon class="w-full h-full" />
    </button>

    <InferenceWidget class="" :inference="inference" v-model:show="showInferenceToolbar" />

    <BlockEdit v-if="editingBlockIndex !== null" v-model="blocks[editingBlockIndex]"
      @close="editingBlockIndex = null" />
    <SettingsPage :open="showSettings" @close="showSettings = false" />
    <FilePage :open="showFiles" v-if="editingFile" @close="showFiles = false" v-model="editingFile" />
    <SearchPage :actions="actions" :open="showSearch" @close="showSearch = false"
      @select="a => (actions.find(i => i.id === a.id)?.action ?? _.noop)()" />
  </div>
</template>