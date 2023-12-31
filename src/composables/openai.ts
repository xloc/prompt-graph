import OpenAI from "openai";
import { computed, onMounted, ref } from "vue";

export const useOpenAI = () => {
  const apikey = ref(localStorage.getItem('apikey'));
  const openai = computed(() => {
    if (!apikey.value) return undefined;
    return new OpenAI({ apiKey: apikey.value, dangerouslyAllowBrowser: true })
  });

  onMounted(() => {
    const callback = (e: StorageEvent) => {
      if (e.key === 'apikey') {
        apikey.value = e.newValue;
      }
    };
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  });

  return openai;
}