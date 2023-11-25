<script setup lang="ts">
import ConnectionCanvas from './components/ConnectionCanvas.vue';
import BlockEdit from './components/BlockEdit.vue';
import Block from "./components/Block.vue";
import { BlockModel, dump, load } from './components/model';
import { onMounted, ref, watchEffect } from 'vue';
import SettingsPage from './components/SettingsPage.vue';
import FilePage from './components/FilePage.vue';
import { EDITING_FILE_PRIMARY_KEY, GraphFile, db, getEditingFile } from './components/file-db';
import _ from 'lodash';


const editingFile = ref<GraphFile>();
onMounted(async () => {
  editingFile.value = await getEditingFile();
});

const blocks = ref<BlockModel[]>([]);
watchEffect(() => {
  if (!editingFile.value) return;
  blocks.value = load(editingFile.value.content);
});
watchEffect(async () => {
  if (!editingFile.value) return;

  editingFile.value.content = dump(blocks.value);
  await db.files.put({ ...editingFile.value }, editingFile.value.fileName);
  localStorage.setItem(EDITING_FILE_PRIMARY_KEY, editingFile.value.fileName);
});

const selection = ref<BlockModel | null>(null);
const showSettings = ref(false);
const showFiles = ref(false);

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

<style scoped></style>
./components/file-db