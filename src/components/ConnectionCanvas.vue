<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { BlockModel } from '../models/model';
import { getDependencies } from '../models/inference';

const props = defineProps<{ blocks: BlockModel[]; }>();
const canvas = ref<HTMLCanvasElement | null>(null);

const updateSize = async () => {
  await nextTick();
  const scale = window.devicePixelRatio;

  const { innerWidth, innerHeight } = window;
  canvas.value!.style.width = `${innerWidth}px`;
  canvas.value!.style.height = `${innerHeight}px`;
  canvas.value!.width = innerWidth * scale;
  canvas.value!.height = innerHeight * scale;

  const ctx = canvas.value?.getContext('2d');
  ctx!.scale(scale, scale);

  drawConnections();
};

const drawAllConnectionTo = (to: BlockModel, ctx: CanvasRenderingContext2D) => {
  const toX = to.xyhw.x;
  const toY = to.xyhw.y + to.xyhw.height / 2;
  const parents = getDependencies(to)
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

  ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);

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
  <canvas ref="canvas"></canvas>
</template>