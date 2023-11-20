<script setup lang="ts">
import ConnectionCanvas from './components/ConnectionCanvas.vue';
import BlockEdit from './components/BlockEdit.vue';
import Block from "./components/Block.vue";
import { BlockModel } from './components/model';
import { ref, watchEffect } from 'vue';
import SettingsPage from './components/SettingsPage.vue';


const blocks = ref<BlockModel[]>([
  { x: 10, y: 10, width: 200, height: 150, id: 'a', prompt: 'standalone', title: 'Title goes here' },
  { x: 10, y: 200, width: 200, height: 150, id: 'b', prompt: 'depending on {a}', title: 'Title goes here' },
  { x: 10, y: 400, width: 200, height: 150, id: 'c', prompt: 'depending on {a} and {b}', title: 'Title goes here' },
]);

watchEffect(() => {
})

const selection = ref<BlockModel | null>(null);
const showSettings = ref(false);

</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <Block v-for="(_, i) in blocks"
      v-model="blocks[i]" @edit="selection = blocks[i]" @click.meta="selection = blocks[i]"
      class="z-0" />
    <ConnectionCanvas :blocks="blocks" class="absolute pointer-events-none" />

    <button @click="showSettings = true"
      class="absolute bottom-5 right-5 p-3 rounded-full border shadow-md w-12 h-12 overflow-hidden hover:bg-gray-200">
      <img src="./assets/cog-8-tooth.svg" class="w-full h-full" />
    </button>


    <BlockEdit v-if="selection" v-model="selection" @close="selection = null"></BlockEdit>
    <SettingsPage v-if="showSettings" @close="showSettings = false" />
  </div>
</template>

<style scoped></style>
