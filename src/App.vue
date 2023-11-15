<script setup lang="ts">
import ConnectionCanvas from './components/ConnectionCanvas.vue';
import Block from "./components/Block.vue";
import { BlockModel } from './components/model';
import { ref, watchEffect } from 'vue';


const blocks = ref<BlockModel[]>([
  { x: 10, y: 10, width: 50, height: 50 },
  { x: 100, y: 10, width: 50, height: 50 },
  { x: 200, y: 10, width: 50, height: 50 },
  { x: 300, y: 10, width: 50, height: 50 },
  { x: 400, y: 10, width: 50, height: 50 },
]);

watchEffect(() => {

})

</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <ConnectionCanvas></ConnectionCanvas>
    <Block v-for="(_, i) in blocks" v-model="blocks[i]"></Block>
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped></style>
