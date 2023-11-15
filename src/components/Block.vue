<script setup lang="ts">
import { computed, reactive } from 'vue';
import { BlockModel } from './model';


const props = defineProps<{ modelValue: BlockModel; }>();
const emit = defineEmits<{ "update:modelValue": [value: BlockModel]; }>();
const block = reactive(computed({
  get: () => props.modelValue,
  set: v => emit("update:modelValue", v),
}));

const offset = { x: 0, y: 0 };

const updateLocation = function (e: MouseEvent) {
  block.value.x = e.clientX - offset.x;
  block.value.y = e.clientY - offset.y;
};

const start = function (e: MouseEvent) {
  addEventListener('mousemove', updateLocation);
  offset.x = e.clientX - block.value.x;
  offset.y = e.clientY - block.value.y;
};
const reset = () => {
  removeEventListener('mousemove', updateLocation);
};

</script>

<template>
  <div class="absolute border rounded-lg shadow-md flex justify-center items-center bg-white" @mousedown="start"
    @mouseup="reset"
    :style="{ width: `${block.width}px`, height: `${block.height}px`, left: `${block.x}px`, top: `${block.y}px` }">
    Text
  </div>
</template>
