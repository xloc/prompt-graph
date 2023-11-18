
<template>
  <div class="absolute inset-10 shadow-2xl border rounded-lg p-10 bg-white bg-opacity-80 backdrop-blur-sm">
    <div class="h-full w-full relative">
      <div class="h-full flex flex-col justify-start items-start">
        <label class="label">TITLE</label>
        <input type="text"
          class="text-2xl field"
          v-model="block.title" />
        <label class="label">ID</label>
        <input type="text" class="text-md field" v-model="block.id" />
        <label class="label">PROMPT</label>
        <textarea class="flex-1 h-40 resize-none field"
          v-model="block.prompt"></textarea>
      </div>
      <div class="absolute bottom-0 right-0 flex justify-end w-full p-2 px-2 text-sm">
        <button class="text-violet-500 p-1 px-2 rounded-sm hover:bg-gray-200"
          @click="emit('close')">CLOSE</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { BlockModel } from './model';

const emit = defineEmits<{
  "close": [];
  "update:modelValue": [value: BlockModel];
}>();

const props = defineProps<{ modelValue: BlockModel; }>();

const block = computed({
  get: () => props.modelValue,
  set: v => emit("update:modelValue", v),
});

// close when escape is pressed
const onEscapePressed = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
}
onMounted(() => {
  addEventListener('keydown', onEscapePressed);
});
onUnmounted(() => {
  removeEventListener('keydown', onEscapePressed);
});
</script>

<style scoped>
.field {
  @apply py-1 bg-transparent w-full z-0 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500
}

.label {
  @apply text-sm text-gray-400 -mb-2 z-10 bg-white mt-2
}
</style>