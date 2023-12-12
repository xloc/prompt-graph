<template>
  <div @mousedown="start" @mouseup="reset"
    class="absolute border rounded-sm shadow-md flex flex-col justify-start items-start bg-white overflow-y-auto overflow-x-hidden |
    hover:shadow-lg cursor-move group"
    :style="{ width: `${block.xyhw.width}px`, height: `${block.xyhw.height}px`, left: `${block.xyhw.x}px`, top: `${block.xyhw.y}px` }">
    <h1 class="w-full flex-none to-gray-950 text-md m-2 mb-0">{{ block.title }}</h1>
    <h2 class="w-full flex-none text-gray-400 text-xs m-2 mt-0">{{ '{' + block.id + '}' }}</h2>
    <div class="flex-1 h-10 w-full px-2 resize-none | flex flex-col">
      <div class="text-xs text-gray-500 w-full pointer-events-none">
        <span class="text-gray-300">Q:</span> <span v-html="highlighted" />
      </div>
      <div class="text-xs text-gray-500 w-full pointer-events-none mt-1"
        v-if="block.output">
        <span class="text-gray-300">A:</span> {{ block.output }}
      </div>
    </div>
    <ul class="flex justify-end w-full p-2 px-2 text-sm invisible group-hover:visible">
      <button class="text-violet-500 p-1 px-2 rounded-sm hover:bg-gray-200"
        @click="emit('edit')">EDIT</button>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BlockModel } from '../models/model';


const props = defineProps<{ modelValue: BlockModel; }>();
const emit = defineEmits<{
  "update:modelValue": [value: BlockModel];
  "edit": [];
}>();
const block = computed({
  get: () => props.modelValue,
  set: v => emit("update:modelValue", v),
});

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