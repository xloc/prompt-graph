<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { BlockModel } from './model';

const props = defineProps<{ blocks: BlockModel[]; }>();
const canvas = ref<HTMLCanvasElement | null>(null);
const h = ref(0);
const w = ref(0);

const updateSize = async () => {
  h.value = window.innerHeight;
  w.value = window.innerWidth;
  await nextTick();
  drawConnections();
};

const getParentIDsOf = (block: BlockModel) => {
  const prompt = block.prompt;
  const matches = prompt.matchAll(/\{(\w+)\}/g);
  return [...matches].map(m => m[1]);
};

const drawAllConnectionTo = (to: BlockModel, ctx: CanvasRenderingContext2D) => {
  const toX = to.xyhw.x;
  const toY = to.xyhw.y + to.xyhw.height / 2;
  const parents = getParentIDsOf(to)
    .map(id => props.blocks.find(b => b.id === id))
    .filter(b => b !== undefined) as BlockModel[];

  for (const block of parents) {
    if (block.id === to.id) continue;
    const fromX = block.xyhw.x + block.xyhw.width;
    const fromY = block.xyhw.y + block.xyhw.height / 2;

    // draw beizer curve from (fromX, fromY) to (toX, toY)
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.bezierCurveTo(fromX + 100, fromY, toX - 100, toY, toX, toY);
    ctx.stroke();

    // draw arrow at (toX, toY)
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - 8, toY - 4);
    ctx.lineTo(toX - 8, toY + 4);
    ctx.closePath();
    ctx.fill();
  }
};

const drawConnections = () => {
  const ctx = canvas.value?.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, w.value, h.value);

  ctx.strokeStyle = 'black';
  // ctx.filter = 'drop-shadow(3px 3px 1px #0008)';
  ctx.lineWidth = 1;

  for (const block of props.blocks) {
    drawAllConnectionTo(block, ctx);
  }
};

onMounted(async () => {
  window.addEventListener('resize', updateSize);
  updateSize();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSize);
});

watchEffect(() => {
  drawConnections();
});
</script>

<template>
  <canvas ref="canvas" :height="h" :width="w"></canvas>
</template>
