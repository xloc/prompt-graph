<template>
  <Page @close="emit('close')">
    <div class="flex items-stretch gap-x-2 flex-shrink h-full">
      <div class="flex-[3] border
      flex justify-center items-center">
        file list
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
import { computed, ref } from 'vue';
import Page from './Page.vue'
import { useKeyPress } from '../composables/keypress';
import { BlockModel, dump, load } from './model';

const props = defineProps<{
  modelValue: BlockModel[]
}>();

const emit = defineEmits<{
  "close": [];
  "update:modelValue": [value: BlockModel[]];
}>();

useKeyPress('Escape', () => {
  if (showUpload.value) {
    showUpload.value = false;
    uploadError.value = '';
  } else {
    emit('close');
  }
});



const code = computed(() => dump(props.modelValue));

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

  const text = await file.text();
  const blocks = load(text);
  emit('update:modelValue', blocks);
  showUpload.value = false;
}
const drop = async (e: DragEvent) => {
  try {
    await dropThrows(e);
  } catch (e) {
    uploadError.value = (e as Error).message;
  }
}
</script>