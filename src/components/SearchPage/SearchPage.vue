<template>
  <TransitionRoot :show="open" as="template" @after-leave="query = ''" appear>
    <Dialog as="div" class="relative z-20">
      <!-- backdrop -->
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
      </TransitionChild>

      <!-- dialog -->
      <div class="fixed inset-0 p-4 sm:p-6 md:p-20">
        <DialogPanel as="div" class="max-w-xl mx-auto rounded-md bg-white shadow-2xl | ring-1 ring-black ring-opacity-5">
          <Combobox @update:modelValue="onSelect">
            <div class="relative">
              <MagnifyingGlassIcon class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <ComboboxInput placeholder="Search..." @change="query = $event.target.value"
                class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm" />
            </div>

            <ComboboxOptions as="ul" v-if="filteredActions.length > 0" class="p-2 pt-0" static>
              <ComboboxOption as="template" v-for="action in filteredActions" :key="action.id"
                :value="action" v-slot="{ active }">
                <li :class="['flex cursor-default select-none items-center rounded-md px-3 py-2', 'text-sm text-gray-700',
                  active && 'bg-indigo-600 text-white']">
                  <span class="flex-auto truncate">{{ action.name }}</span>
                </li>
              </ComboboxOption>
            </ComboboxOptions>
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { computed, ref } from 'vue';

defineProps<{ open: boolean }>()

interface Action {
  id: string;
  name: string;
}

const onSelect = (action: Action) => {
  console.log(action);
}

const query = ref('');

const actions = [
  { id: 'files', name: 'Open Files...' },
  { id: 'new_file', name: 'Create a New File' },
  { id: 'add_block', name: 'Add Block' },
  { id: 'delete_block', name: 'Delete Block under Cursor' },
]

const filteredActions = computed(() => {
  return actions.filter(a => a.name.toLowerCase().includes(query.value.toLowerCase()));
})
</script>