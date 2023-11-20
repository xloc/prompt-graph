
<template>
  <div class="absolute inset-0 shadow-2xl backdrop-blur-sm bg-gray-800 bg-opacity-20 p-10">
    <div class="h-full w-full relative rounded-lg p-10 bg-white bg-opacity-80 ">
      <div class="h-full flex flex-col justify-start items-start">
        <div class="w-full h-fit relative">
          <label class="label">TITLE</label>
          <input type="text" class="field text-2xl" v-model="block.title" />
        </div>
        <div class="w-full h-fit">
          <label class="label">ID</label>
          <input type="text" class="field text-md" v-model="block.id" />
        </div>
        <div class="w-full h-fit flex-1 flex flex-col">
          <label class="label">PROMPT</label>
          <textarea class="field flex-1 resize-none " v-model="block.prompt"></textarea>
        </div>
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
  @apply py-1 bg-transparent w-full rounded-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-violet-400 z-0;
}

.label {
  @apply text-sm text-gray-400 -mb-2 z-10 mt-2 block w-fit px-1 -mx-1 relative;
}
</style>