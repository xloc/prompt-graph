<template>
  <Page @close="close">
    <div class="grid grid-cols-[1fr_2fr] items-stretch gap-x-2 flex-shrink h-full" @dragover="dragover">
      <div class="min-w-0 border | flex flex-col justify-start items-stretch | relative">
        <FileListItem v-for="file in files" :key="file.id" :file="file"
          :class="{ 'bg-violet-50 hover:bg-violet-100': file.id === currentFile.id }"
          class="border-b border-b-gray-200 p-1 hover:bg-gray-50"
          @click="switchCurrentFile(file)"
          @rename="(name) => rename(file, name)" @delete="remove(file)"></FileListItem>
      </div>
      <div class="min-w-0 border position relative">
        <div class="absolute inset-0 overflow-y-auto">
          <pre class="p-1 text-xs inset-0">{{ code }}</pre>
        </div>
        <ul class="flex gap-2 justify-end w-full absolute bottom-4 right-4">
          <button class="bg-gray-100 hover:bg-gray-300 p-2 rounded-md" @click="save">
            <ArrowDownTrayIcon class="w-4 h-4" />
          </button>
          <button class="bg-gray-100 hover:bg-gray-300 p-2 rounded-md" @click="copy">
            <DocumentDuplicateIcon class="w-4 h-4" />
          </button>
          <button class="bg-gray-100 hover:bg-gray-300 p-2 rounded-md" @click="showUpload = true">
            <ArrowUpTrayIcon class="w-4 h-4" />
          </button>
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
import { computed, onMounted, onUnmounted, ref } from 'vue';
import Page from '../Page.vue'
import { useKeyPress } from '../../composables/keypress';
import { GraphFile, db, getEditingFile } from '../../models/file-db';
import FileListItem from './FileListItem.vue';
import DocumentDuplicateIcon from '@heroicons/vue/24/outline/DocumentDuplicateIcon';
import ArrowUpTrayIcon from '@heroicons/vue/24/outline/ArrowUpTrayIcon';
import ArrowDownTrayIcon from '@heroicons/vue/24/outline/ArrowDownTrayIcon';
import { liveQuery, Subscription } from 'dexie';

const props = defineProps<{
  modelValue: GraphFile,
}>();
const emit = defineEmits<{
  "close": [];
  "update:modelValue": [value: GraphFile];
}>();

const currentFile = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
});

const close = () => {
  if (showUpload.value) {
    showUpload.value = false;
    uploadError.value = '';
  } else {
    emit('close');
  }
}
useKeyPress('Escape', close);


const code = computed(() => currentFile.value.content);

const save = () => {
  const blob = new Blob([code.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentFile.value.fileName}.yaml`;
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

  currentFile.value = {
    createAt: new Date(),
    updateAt: new Date(),
    content: await file.text(),
    fileName: file.name.replace(/.yaml$/, '')
  };

  // display updates
  showUpload.value = false; // dismiss upload prompt
}
const drop = async (e: DragEvent) => {
  try {
    await dropThrows(e);
  } catch (e) {
    uploadError.value = (e as Error).message;
  }
}
const dragover = () => { showUpload.value = true; }

const files = ref<GraphFile[]>([]);
let subscription: Subscription | undefined = undefined;
onMounted(() => {
  subscription = liveQuery(() => db.files.toArray())
    .subscribe((newFiles) => {
      files.value = newFiles;
    });
});
onUnmounted(() => {
  subscription?.unsubscribe();
});

const switchCurrentFile = async (file: GraphFile) => {
  currentFile.value = file;
}

const rename = async (file: GraphFile, newName: string) => {
  if (file.id === undefined) throw new Error("file.id is undefined");
  db.files.update(file.id, { fileName: newName }).catch(e => {
    console.error(e);
  });
  file.fileName = newName;
  if (file.id === currentFile.value.id) {
    currentFile.value = { ...file, fileName: newName };
  }
}

const remove = async (file: GraphFile) => {
  if (file.id === undefined) throw new Error("file.id is undefined");
  await db.files.delete(file.id)
  if (file.id === currentFile.value.id) {
    let file = await db.files.toCollection().first();
    if (!file) file = await getEditingFile();
    currentFile.value = file;
  }
};

</script>