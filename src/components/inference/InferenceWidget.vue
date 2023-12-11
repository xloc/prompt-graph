<template>
  <div
    class="flex border rounded-md shadow-lg h-10 absolute bottom-5 right-10 bg-white overflow-hidden | 
      group">
    <button @click="toggleInference"
      class="p-2 bg-white border-r hover:bg-slate-100 | opacity-0 group-hover:opacity-100">
      <PlayIcon v-if="!isInferencing" class="w-5 h-5" />
      <PauseIcon v-else class="w-5 h-5" />
    </button>

    <button class="w-20 flex justify-center items-center">
      {{ inference.progress + 1 }}/{{ inference.order?.length }}
    </button>

    <button title="Close This Toolbar"
      class="p-2 bg-white disabled:text-gray-400 hover:bg-slate-100 border-l | 
      opacity-0 group-hover:opacity-100">
      <XMarkIcon class="w-5 h-5 text-red-600" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { PlayIcon, PauseIcon, XMarkIcon } from '@heroicons/vue/24/outline'
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
</script>