
<template>
  <div class="absolute inset-0 
    shadow-2xl backdrop-blur-sm bg-gray-800 bg-opacity-20 px-10 
    overflow-y-auto flex flex-col">
    <div class="h-10 flex-none"></div>


    <div class="h-full w-full relative rounded-lg p-10 bg-white">
      <div class="h-full flex flex-col justify-start items-start gap-2">
        <div class="w-full h-fit relative">
          <label class="label">TITLE</label>
          <input type="text" class="field" v-model="block.title" />
        </div>
        <div class="w-full h-fit">
          <label class="label">ID</label>
          <input type="text" class="field" v-model="block.id" />
        </div>
        <div class="w-full h-fit flex-1 flex flex-col">
          <label class="label">PROMPT</label>
          <textarea class="field flex-1 resize-none " v-model="block.prompt"></textarea>
        </div>
      </div>

      <button @click="emit('close')"
        class="absolute top-5 right-5 flex text-sm text-violet-500 p-1 px-2 hover:bg-gray-200">
        ESC
      </button>


    </div>
    <div class="h-10 flex-none"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BlockModel } from './model';
import { useKeyPress } from '../composables/keypress';

const emit = defineEmits<{
  "close": [];
  "update:modelValue": [value: BlockModel];
}>();

const props = defineProps<{ modelValue: BlockModel; }>();

const block = computed({
  get: () => props.modelValue,
  set: v => emit("update:modelValue", v),
});

useKeyPress('Escape', () => emit('close'));
</script>

<style scoped>
.field {
  @apply w-full border rounded-sm p-2 focus:outline focus:outline-2 focus:outline-violet-400;
}

.label {
  @apply pl-2 text-gray-500 text-sm;
}
</style>