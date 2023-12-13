<template>
  <div class="absolute inset-0 pointer-events-none" v-if="inference.show">
    <div :style="{ left: `${xy.x}px`, top: `${xy.y}px` }" @mousedown="mousedown" @mouseup="mouseup"
      class="flex absolute h-10 pointer-events-auto
      | border rounded-md shadow-lg bg-white overflow-hidden group">
      <button @click="toggleInference"
        class="p-2 bg-white border-r hover:bg-slate-100">
        <PlayIcon v-if="!isInferencing" class="w-5 h-5" />
        <PauseIcon v-else class="w-5 h-5" />
      </button>

      <button class="w-20 flex justify-center items-center">
        {{ inference.progress + 1 }}/{{ inference.order?.length }}
      </button>

      <button title="Close This Toolbar" @click="inference.show = false"
        class="p-2 bg-white disabled:text-gray-400 hover:bg-slate-100 border-l">
        <XMarkIcon class="w-5 h-5 text-red-600" />
      </button>
      <button title="Clear Outputs of All Blocks" @click="clearInferences"
        class="p-2 bg-white disabled:text-gray-400 hover:bg-slate-100 border-l">
        <TrashIcon class="w-5 h-5 text-red-600" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlayIcon, PauseIcon, XMarkIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { Inference } from '../../models/inference';
import { computed } from 'vue';
import { useDrag } from '../../composables/drag';

const props = defineProps<{ inference: Inference }>();

const isInferencing = computed({
  get: () => props.inference.isInferencing,
  set: (value) => props.inference.isInferencing = value
});
const toggleInference = () => {
  isInferencing.value = !isInferencing.value;
}
const clearInferences = () => {
  props.inference.progress = 0;
  props.inference.order?.forEach(block => delete block.output);
}

const { xy, mousedown, mouseup } = useDrag('inference-toolbar');
</script>