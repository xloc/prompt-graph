<template>
  <div @mousedown="start" @mouseup="reset"
    class="absolute border rounded-sm shadow-md flex flex-col justify-start items-start bg-white overflow-y-auto overflow-x-hidden"
    :style="{ width: `${block.xyhw.width}px`, height: `${block.xyhw.height}px`, left: `${block.xyhw.x}px`, top: `${block.xyhw.y}px` }">
    <h1 class="w-full flex-none to-gray-950 text-md m-2 mb-0">{{ block.title }}</h1>
    <h2 class="w-full flex-none text-gray-400 text-xs m-2 mt-0">{{ '{' + block.id + '}' }}</h2>
    <div class="flex-1 h-10 w-full px-2 resize-none ">
      <div class="resize-none text-xs text-gray-500 w-full h-full pointer-events-none" contenteditable="true"
        @mousedown.stop v-html="highlighted">
      </div>

    </div>
    <ul class="flex justify-end w-full p-2 px-2 text-sm">
      <button class="text-violet-500 p-1 px-2 rounded-sm hover:bg-gray-200"
        @click="emit('edit')">EDIT</button>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { BlockModel } from './model';


const props = defineProps<{ modelValue: BlockModel; }>();
const emit = defineEmits<{
  "update:modelValue": [value: BlockModel];
  "edit": [];
}>();
const block = reactive(computed({
  get: () => props.modelValue,
  set: v => emit("update:modelValue", v),
}));

const offset = { x: 0, y: 0 };

const updateLocation = function (e: MouseEvent) {
  block.value.xyhw.x = e.clientX - offset.x;
  block.value.xyhw.y = e.clientY - offset.y;
};

const start = function (e: MouseEvent) {
  addEventListener('mousemove', updateLocation);
  offset.x = e.clientX - block.value.xyhw.x;
  offset.y = e.clientY - block.value.xyhw.y;
};
const reset = () => {
  removeEventListener('mousemove', updateLocation);
};


const highlighted = computed(() => {
  return block.value.prompt.replace(
    /\{(\w+)\}/g,
    '<span class="text-violet-500">$&</span>');
});
</script>