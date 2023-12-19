<template>
  <Page :open="open" @close="$emit('close')" scrollable>
    <Field label="APIKEY" placeholder="sk-xxxxx" :model-value="apikey" @update:value="apikey = $event" />
  </Page>
</template>

<script setup lang="ts">
import Page from './Page.vue';
import Field from './field/Field.vue';
import { useLocalStorage } from '@vueuse/core';

defineProps<{ open: boolean }>();
defineEmits<{ "close": [] }>();

const apikey = useLocalStorage('apikey', '');
</script>