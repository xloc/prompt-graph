import { ref, watchEffect } from "vue";

export interface XY {
  x: number;
  y: number;
};

export const useDrag = (key: string) => {
  const dragKey = `${key}-drag-xy`;
  const initXY: XY = JSON.parse(localStorage.getItem(dragKey) || '{ "x": 0, "y": 0 }');
  const xy = ref<XY>(initXY);
  watchEffect(() => localStorage.setItem(dragKey, JSON.stringify(xy.value)));

  const offset: XY = { x: 0, y: 0 };
  const updateXY = (e: MouseEvent) => {
    xy.value.x = e.clientX - offset.x;
    xy.value.y = e.clientY - offset.y;
  }
  const mousedown = (e: MouseEvent) => {
    offset.x = e.clientX - xy.value.x;
    offset.y = e.clientY - xy.value.y;
    window.addEventListener('mousemove', updateXY);
  }
  const mouseup = () => {
    window.removeEventListener('mousemove', updateXY);
  }

  return {
    mousedown,
    mouseup,
    xy,
  }

}