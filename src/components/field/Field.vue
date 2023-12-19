<template>
  <div class="w-full">
    <label class="block text-sm font-medium leading-6 text-gray-900">{{ label }}</label>
    <div class="mt-2">
      <input type="text" :name="label" :placeholder="placeholder" v-model="model"
        class="block w-full rounded-md border-0 py-1.5 | sm:text-sm sm:leading-6
            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
            focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ modelValue: string, label: string, placeholder?: string }>();
const emit = defineEmits<{ "update:value": [value: string] }>();

const model = computed({
  get: () => props.modelValue,
  set: v => emit("update:value", v),
});
</script>