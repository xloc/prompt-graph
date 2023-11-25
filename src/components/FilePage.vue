<template>
  <Page @close="close">
    <div class="flex items-stretch gap-x-2 flex-shrink h-full" @dragover="dragover">
      <div class="flex-[3] border | flex flex-col justify-start items-stretch | relative">
        <FileListItem class="border-b border-b-gray-200 p-1 bg-violet-50" :file="currentFile" />
        <FileListItem v-for="file in otherFiles" :key="file.fileName" :file="file"
          class="border-b border-b-gray-200 p-1 hover:bg-gray-50"
          @click="swapCurrentFile(file)" />
      </div>
      <div class="h-full flex-[7] border position relative">
        <div class="absolute inset-0 overflow-y-auto">
          <pre class="p-1 text-xs inset-0">{{ code }}</pre>
        </div>
        <ul class="flex gap-1 justify-end w-full absolute bottom-0 right-5">
          <button class="p-1 border" @click="save">save</button>
          <button class="p-1 border" @click="copy">copy</button>
          <button class="p-1 border" @click="showUpload = true">upload</button>
        </ul>
      </div>
    </div>
    <div class="absolute inset-0 bg-white rounded-lg | flex flex-col justify-center items-center"
      v-if="showUpload" @drop.prevent="drop" @dragover.prevent>
      <div class="text-2xl">
        Drop a <code class="p-2 text-violet-500">yaml</code> File to Upload
      </div>
      <div class="text-red-500 text-2xl pt-5" v-if="uploadError">{{ uploadError }}</div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import Page from './Page.vue'
import { useKeyPress } from '../composables/keypress';
import { GraphFile, db } from './file-db';
import FileListItem from './FileList/FileListItem.vue';

const props = defineProps<{
  modelValue: GraphFile,
}>();
const emit = defineEmits<{
  "close": [];
  "update:modelValue": [value: GraphFile];
}>();

const close = () => {
  if (showUpload.value) {
    showUpload.value = false;
    uploadError.value = '';
  } else {
    emit('close');
  }
}
useKeyPress('Escape', close);


const code = computed(() => props.modelValue.content);

const save = () => {
  const blob = new Blob([code.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${new Date().toLocaleString().replace('T', ' ').substring(0, 20)}.yaml`;
  a.click();
  URL.revokeObjectURL(url);
};

const copy = () => {
  navigator.clipboard.writeText(code.value);
};

const showUpload = ref(false);
const uploadError = ref('');
const dropThrows = async (e: DragEvent) => {
  const files = e.dataTransfer?.files;
  if (!files) return;
  if (files.length !== 1) throw new Error("should drop only one file");

  const file = files[0];
  if (!file.type.includes('yaml')) throw new Error("should drop only yaml file");

  emit('update:modelValue', {
    ...props.modelValue,
    content: await file.text(),
    fileName: file.name.replace(/.yaml$/, '')
  });

  // display updates
  showUpload.value = false; // dismiss upload prompt
  await nextTick();
  updateFile(); // update file list
}
const drop = async (e: DragEvent) => {
  try {
    await dropThrows(e);
  } catch (e) {
    uploadError.value = (e as Error).message;
  }
}
const dragover = () => { showUpload.value = true; }


const otherFiles = ref<GraphFile[]>([]);
const currentFile = computed(() => props.modelValue);
const updateFile = async () => {
  otherFiles.value = await db.files.where('fileName').notEqual(props.modelValue.fileName).toArray();
}
const swapCurrentFile = async (file: GraphFile) => {
  emit('update:modelValue', file);
  await nextTick();
  updateFile();
}
onMounted(async () => {
  updateFile();
});

</script>