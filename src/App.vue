<script setup lang="ts">
import ConnectionCanvas from './components/ConnectionCanvas.vue';
import Block from "./components/Block.vue";
import { BlockModel } from './components/model';
import { ref, watchEffect } from 'vue';


const blocks = ref<BlockModel[]>([
  { x: 10, y: 10, width: 200, height: 100, id: 'a', prompt: 'standalone' },
  { x: 10, y: 200, width: 200, height: 100, id: 'b', prompt: 'depending on {a}' },
  { x: 10, y: 400, width: 200, height: 100, id: 'c', prompt: 'depending on {a} and {b}' },
]);

watchEffect(() => {
})

</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <Block v-for="(_, i) in blocks" v-model="blocks[i]" class="z-0"></Block>
    <ConnectionCanvas :blocks="blocks" class="absolute pointer-events-none"></ConnectionCanvas>
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped></style>
