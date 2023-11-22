<template>
  <Page @close="emit('close')" scrollable>
    <label class="pl-2 text-md text-gray-500">APIKEY</label>
    <input type="text" class="w-full border rounded-sm p-2 focus:outline focus:outline-2 focus:outline-violet-400"
      placeholder="sk-xxxxx" v-model="apikey" />
  </Page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useKeyPress } from '../composables/keypress';
import Page from './Page.vue';


const emit = defineEmits<{
  "close": [];
}>();
const apikey = computed({
  get: () => localStorage.getItem('apikey'),
  set: v => localStorage.setItem('apikey', v ?? ''),
});

useKeyPress('Escape', () => emit('close'));
</script>