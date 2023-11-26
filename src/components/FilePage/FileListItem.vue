<template>
  <div class="relative group">
    <div class="text">{{ file.fileName }}</div>
    <div class="text-sm text-gray-500">{{ file.creatdAt.toLocaleString() }}</div>
    <div class="absolute inset-0 flex justify-end items-center p-3 gap-2">
      <button
        class="invisible group-hover:visible backdrop-blur-sm bg-gray-300 bg-opacity-50 hover:bg-gray-300 p-2 rounded-md">
        <PencilSquareIcon class="w-4 h-4" />
      </button>
      <button class="invisible group-hover:visible bg-gray-200 hover:bg-gray-300 p-2 rounded-md">
        <TrashIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrashIcon from '@heroicons/vue/24/outline/TrashIcon';
import PencilSquareIcon from '@heroicons/vue/24/outline/PencilSquareIcon';
import { GraphFile } from '../../models/file-db';


defineProps<{
  file: GraphFile
}>();
</script>