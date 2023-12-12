<template>
  <div
    class="flex border rounded-md shadow-lg h-10 absolute bottom-5 right-10 bg-white overflow-hidden | 
      group">
    <button @click="toggleInference"
      class="p-2 bg-white border-r hover:bg-slate-100">
      <PlayIcon v-if="!isInferencing" class="w-5 h-5" />
      <PauseIcon v-else class="w-5 h-5" />
    </button>

    <button class="w-20 flex justify-center items-center">
      {{ inference.progress + 1 }}/{{ inference.order?.length }}
    </button>

    <button title="Close This Toolbar"
      class="p-2 bg-white disabled:text-gray-400 hover:bg-slate-100 border-l">
      <XMarkIcon class="w-5 h-5 text-red-600" />
    </button>
    <button title="Clear Outputs of All Blocks" @click="clearInferences"
      class="p-2 bg-white disabled:text-gray-400 hover:bg-slate-100 border-l">
      <TrashIcon class="w-5 h-5 text-red-600" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { PlayIcon, PauseIcon, XMarkIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useInference } from '../../models/inference';
import { BlockModel } from '../../models/model';
import { computed } from 'vue';

const props = defineProps<{ blocks: BlockModel[] }>();
const blocks = computed(() => props.blocks);

const inference = useInference(blocks);

const isInferencing = computed({
  get: () => inference.value.isInferencing,
  set: (value) => inference.value.isInferencing = value
});
const toggleInference = () => {
  isInferencing.value = !isInferencing.value;
}

const clearInferences = () => {
  inference.value.progress = 0;
  inference.value.order?.forEach(block => delete block.output);
}
</script>