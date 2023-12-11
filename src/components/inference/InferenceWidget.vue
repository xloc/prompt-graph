<template>
  <div
    class="flex border rounded-md shadow-lg h-10  absolute bottom-5 left-[200px] bg-white overflow-hidden">
    <button class="p-2 bg-white border-r hover:bg-slate-100" @click="isInferencing = !isInferencing">
      <PlayIcon v-if="!isInferencing" class="w-5 h-5" />
      <PauseIcon v-else class="w-5 h-5" />
    </button>



    <button class="w-20 border-r flex justify-center items-center">
      1/5
    </button>


    <button title="Close This Toolbar" class="p-2 bg-white disabled:text-gray-400">
      <XMarkIcon class="w-5 h-5 text-red-600" />
    </button>


  </div>
</template>

<script setup lang="ts">
import { PlayIcon, PauseIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue';

const isInferencing = ref(true);


</script>