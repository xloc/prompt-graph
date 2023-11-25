<template>
  <div class="relative group">
    <div class="text">{{ file.fileName }}</div>
    <div class="text-sm text-gray-500">{{ file.creatdAt.toLocaleString() }}</div>
    <div class="absolute inset-0 flex justify-end items-center p-3 ">
      <button class="invisible group-hover:visible hover:bg-gray-200 px-2 py-1 rounded-md">del</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GraphFile } from "../file-db";

defineProps<{
  file: GraphFile
}>();
</script>