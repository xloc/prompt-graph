<template>
  <div class="relative group">
    <template v-if="!isEditingName">
      <div class="overflow-hidden text-ellipsis">{{ file.fileName }}</div>
      <div class="overflow-hidden text-ellipsis | text-sm text-gray-500">
        {{ updateTime }}</div>
      <div class="absolute inset-0 flex justify-end items-center p-3 gap-2">
        <button @click.stop="isEditingName = true; nextTick().then(() => inputRef!.focus())"
          class="invisible group-hover:visible backdrop-blur-sm 
          bg-gray-300 bg-opacity-50 hover:bg-gray-300 p-2 rounded-md">
          <PencilSquareIcon class="w-4 h-4" />
        </button>
        <button @click.stop="emit('delete')"
          class="invisible group-hover:visible backdrop-blur-sm 
          bg-gray-300 bg-opacity-50 hover:bg-gray-300 p-2 rounded-md">
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </template>
    <template v-else>
      <input type="text" v-model="editingFileName" ref="inputRef"
        class="w-full border rounded-sm p-2 focus:outline focus:outline-2 focus:outline-violet-400"
        @keydown.escape.stop="inputRef!.blur()"
        @keydown.enter="emit('rename', editingFileName); isEditingName = false"
        @focusout="emit('rename', editingFileName); isEditingName = false"
        @click.stop />
    </template>
  </div>
</template>

<script setup lang="ts">
import TrashIcon from '@heroicons/vue/24/outline/TrashIcon';
import PencilSquareIcon from '@heroicons/vue/24/outline/PencilSquareIcon';
import { GraphFile } from '../../models/file-db';
import { computed, nextTick, ref } from 'vue';
import { format, formatRelative, isPast, isAfter, sub } from 'date-fns';


const props = defineProps<{
  file: GraphFile
}>();

const emit = defineEmits<{
  "rename": [newName: string];
  'delete': [];
}>();

const isEditingName = ref(false);
const editingFileName = ref(props.file.fileName);
const inputRef = ref<HTMLInputElement>();
const updateTime = computed(() => {
  const time = props.file.updateAt;
  // if is less than 1 day before, show relative time
  if (isPast(time) && isAfter(time, sub(Date.now(), { days: 1 }))) {
    return 'updated ' + formatRelative(time, Date.now());
  } else {
    return 'updated at ' + format(time, 'yyyy-MM-dd HH:mm:ss');
  }
})
</script>