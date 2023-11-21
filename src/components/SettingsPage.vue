<template>
  <div class="absolute inset-0 shadow-2xl backdrop-blur-sm bg-gray-800 bg-opacity-20 p-10">
    <div class="relative rounded-lg p-10 bg-white bg-opacity-80 ">
      <label class="pl-2 text-md text-gray-500">APIKEY</label>
      <input type="text" class="w-full border rounded-sm p-2 focus:outline focus:outline-2 focus:outline-violet-400"
        placeholder="sk-xxxxx" v-model="apikey" />
      <button class="absolute top-5 right-5 px-2 py-1 text-violet-600 hover:bg-gray-200 text-sm"
        @click="$emit('close')">ESC</button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useKeyPress } from '../composables/keypress';


const emit = defineEmits<{
  "close": [];
}>();
const apikey = computed({
  get: () => localStorage.getItem('apikey'),
  set: v => localStorage.setItem('apikey', v ?? ''),
});

useKeyPress('Escape', () => emit('close'));
</script>