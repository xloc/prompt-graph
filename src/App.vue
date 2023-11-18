<script setup lang="ts">
import ConnectionCanvas from './components/ConnectionCanvas.vue';
import BlockEdit from './components/BlockEdit.vue';
import Block from "./components/Block.vue";
import { BlockModel } from './components/model';
import { ref, watchEffect } from 'vue';


const blocks = ref<BlockModel[]>([
  { x: 10, y: 10, width: 200, height: 150, id: 'a', prompt: 'standalone', title: 'Title goes here' },
  { x: 10, y: 200, width: 200, height: 150, id: 'b', prompt: 'depending on {a}', title: 'Title goes here' },
  { x: 10, y: 400, width: 200, height: 150, id: 'c', prompt: 'depending on {a} and {b}', title: 'Title goes here' },
]);

watchEffect(() => {
})

const selection = ref<BlockModel | null>(null);

</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <Block v-for="(_, i) in blocks" v-model="blocks[i]" @edit="selection = blocks[i]" @click.meta="selection = blocks[i]"
      class="z-0" />
    <ConnectionCanvas :blocks="blocks"
      class="absolute pointer-events-none" />
    <BlockEdit v-if="selection" v-model="selection" @close="selection = null"></BlockEdit>
  </div>
</template>

<style scoped></style>
