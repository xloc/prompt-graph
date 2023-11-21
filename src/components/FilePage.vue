<template>
  <Page @close="emit('close')">
    <div class="flex items-stretch gap-x-2 flex-shrink h-full">
      <div class="flex-[3] border
      flex justify-center items-center">
        file list
      </div>
      <div class="h-full flex-[7] border position relative">
        <pre class="overflow-y-auto p-1 text-xs inset-0">{{ code }}</pre>
        <ul class="flex gap-1 justify-end w-full absolute bottom-0 right-0">
          <li class="p-1 border">download</li>
          <li class="p-1 border">copy</li>
        </ul>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Page from './Page.vue'
import { useKeyPress } from '../composables/keypress';
import { BlockModel, dump } from './model';

const props = defineProps<{ blocks: BlockModel[] }>();
const code = computed(() => {
  return dump(props.blocks);
});

const emit = defineEmits<{ "close": [] }>();
useKeyPress('Escape', () => emit('close'));
</script>