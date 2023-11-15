<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';


const h = ref(0);
const w = ref(0);

const updateSize = () => {
  h.value = window.innerHeight;
  w.value = window.innerWidth;
};

onMounted(() => {
  updateSize();
  window.addEventListener('resize', updateSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSize);
});
</script>

<template>
  <canvas :height="h" :width="w"></canvas>
</template>
