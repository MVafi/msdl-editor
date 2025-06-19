import { defineStore } from "pinia";
import { useToggle } from "@vueuse/core";
import { ref } from "vue";

export const useUIStore = defineStore("uiStore", () => {
  const [showLeftPanel, toggleLeftPanel] = useToggle(true);
  const hoverEnabled = ref(true);

  return { showLeftPanel, toggleLeftPanel, hoverEnabled };
});

export const useSideStore = defineStore("sideStore", () => {
  const hideEmptySides = ref(true);

  return { hideEmptySides };
});
