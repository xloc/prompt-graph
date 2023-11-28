<script setup lang="ts">
import ConnectionCanvas from './components/ConnectionCanvas.vue';
import BlockEdit from './components/BlockEditPage.vue';
import Block from "./components/Block.vue";
import { BlockModel, dump, load } from './models/model';
import { onMounted, ref, watch, watchEffect } from 'vue';
import SettingsPage from './components/SettingsPage.vue';
import FilePage from './components/FilePage/FilePage.vue';
import { EDITING_FILE_PRIMARY_KEY, GraphFile, db, getEditingFile } from './models/file-db';
import _, { debounce } from 'lodash';


const editingFile = ref<GraphFile>();
onMounted(async () => {
  editingFile.value = await getEditingFile();
});

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

// modal and its controls
const selection = ref<BlockModel | null>(null);
const showSettings = ref(false);
const showFiles = ref(localStorage.getItem("showFiles") === "true");
watchEffect(() => {
  localStorage.setItem("showFiles", showFiles.value.toString());
});

</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <Block v-for="(_, i) in blocks"
      v-model="blocks[i]" @edit="selection = blocks[i]" @click.meta="selection = blocks[i]"
      class="z-0" />
    <ConnectionCanvas :blocks="blocks" class="absolute pointer-events-none" />

    <button @click="showFiles = true"
      class="absolute bottom-5 right-5 p-3 rounded-full border shadow-md w-12 h-12 overflow-hidden hover:bg-gray-200">
      <img src="./assets/cog-8-tooth.svg" class="w-full h-full" />
    </button>


    <BlockEdit v-if="selection" v-model="selection" @close="selection = null"></BlockEdit>
    <SettingsPage v-if="showSettings" @close="showSettings = false" />
    <FilePage v-if="showFiles && editingFile" @close="showFiles = false" v-model="editingFile" />
  </div>
</template>