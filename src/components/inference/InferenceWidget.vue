<template>
  <div class="fixed inset-0 pointer-events-none" v-if="show" ref="overlay">
    <div :style="style" ref="toolbar"
      class="flex absolute h-10 pointer-events-auto
      | border rounded-md shadow-lg bg-white overflow-hidden group">
      <button @click="toggleStart"
        class="p-2 bg-white border-r hover:bg-slate-100">
        <PlayIcon v-if="!isStarted" class="w-5 h-5" />
        <PauseIcon v-else class="w-5 h-5" />
      </button>

      <button class="min-w-[7rem] flex justify-center items-center">
        <template v-if="!inference.isStarted && inference.progress === 0">
          <span class="text-gray-400">Not Started</span>
        </template>
        <template v-else-if="!inference.isStarted && inference.progress < inference.order.length">
          <span class="text-gray-400">Paused</span>
        </template>
        <template v-else-if="inference.progress < inference.order.length">
          {{ inference.progress + 1 }}/{{ inference.order?.length }}
        </template>
        <template v-else>
          <span class="text-emerald-700">Done</span>
        </template>
      </button>

      <button title="Close This Toolbar" @click="emit('update:show', false)"
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
import { computed, ref, watchEffect } from 'vue';
import { useDraggable, useLocalStorage, watchThrottled, useElementBounding } from '@vueuse/core'

const props = defineProps<{ inference: Inference; show: boolean }>();
const emit = defineEmits<{ "update:show": [boolean] }>();

const isStarted = computed({
  get: () => props.inference.isStarted,
  set: (value) => props.inference.isStarted = value
});
const toggleStart = () => {
  isStarted.value = !isStarted.value;
}
const clearInferences = () => {
  props.inference.progress = 0;
  props.inference.isStarted = false;
  props.inference.order?.forEach(block => delete block.output);
}

const toolbar = ref<HTMLElement | null>(null);
const xy = useLocalStorage('inference-toolbar-xy', { x: 20, y: 20 });
const { x, y, style } = useDraggable(toolbar, { initialValue: xy.value });
watchThrottled(
  [x, y],
  () => xy.value = { x: x.value, y: y.value },
  { throttle: 1000 },
)

const overlay = ref<HTMLElement | null>(null);
const { top, right, bottom, left } = useElementBounding(overlay);
const { width, height } = useElementBounding(toolbar);
watchEffect(() => {
  if (x.value + width.value > right.value) x.value = right.value - width.value;
  if (y.value + height.value > bottom.value) y.value = bottom.value - height.value;
  if (x.value < left.value) x.value = left.value;
  if (y.value < top.value) y.value = top.value;
})
</script>