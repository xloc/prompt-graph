<template>
  <Dialog as="div" :open="open" @close="$emit('close')"
    class="absolute inset-0 shadow-2xl backdrop-blur-sm bg-gray-800 bg-opacity-20 px-10"
    :class="[scrollable ? 'overflow-y-auto flex flex-col' : 'py-10']">
    <div class="h-10 flex-none" v-if="scrollable"></div>

    <DialogPanel>
      <div class="h-full w-full relative rounded-lg p-10 bg-white">
        <slot></slot>

        <button @click="$emit('close')"
          class="absolute top-5 right-5 flex text-sm text-violet-500 p-1 px-2 hover:bg-gray-200">
          ESC
        </button>
      </div>
    </DialogPanel>


    <div class="h-10 flex-none" v-if="scrollable"></div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel } from '@headlessui/vue';

defineEmits<{ "close": [] }>();
defineProps<{ scrollable?: boolean, open: boolean }>();
</script>