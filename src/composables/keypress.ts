import { onMounted, onUnmounted } from "vue";

export const useKeyPress = (key: "Escape", onPress: () => void) => {
  // close when escape is pressed
  const onEscapePressed = (e: KeyboardEvent) => {
    if (e.key === key) onPress();
  }
  onMounted(() => {
    addEventListener('keydown', onEscapePressed);
  });
  onUnmounted(() => {
    removeEventListener('keydown', onEscapePressed);
  })
}