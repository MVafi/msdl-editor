import { defineStore } from "pinia";
import { ref } from "vue";
import type { MilitaryScenario } from "@orbat-mapper/msdllib";
import { useLocalStorage } from "@vueuse/core";
import { UNALLOCATED_FEDERATE } from "@/stores/selectStore.ts";

export const useLayerStore = defineStore("visibleLayers", () => {
  const layers = ref<Set<string>>(new Set());
  const showIconAnchors = useLocalStorage("showIconAnchors", false);
  const showUnits = useLocalStorage("showUnits", true);
  const showEquipment = useLocalStorage("showEquipment", true);
  const showLabels = useLocalStorage("showLabels", true);
  const showSymbolOutline = useLocalStorage("showSymbolOutline", true);
  const symbolSize = useLocalStorage("symbolSize", 20);
  const showAreaOfInterest = useLocalStorage("showAreaOfInterest", true);
  const shownFederates = ref<Set<string>>(new Set());

  function setSideLayers(scenario: MilitaryScenario) {
    layers.value.clear();
    scenario.sides.forEach((layer) => {
      layers.value.add(layer.objectHandle);
    });
  }

  function setShownFederates(scenario: MilitaryScenario){
    shownFederates.value.clear();
    let federates = (scenario.deployment?.federates || []).concat(UNALLOCATED_FEDERATE)

    federates.forEach((federate) => {
      if (federate.name) shownFederates.value.add(federate.name)
    });
  }

  return {
    layers,
    showIconAnchors,
    showUnits,
    showEquipment,
    showLabels,
    setSideLayers,
    showSymbolOutline,
    symbolSize,
    showAreaOfInterest,
    shownFederates,
    setShownFederates,
  };
});

export const useMapSettingsStore = defineStore("mapSettings", () => {
  const showPadding = ref(false);
  const showCollisionBoxes = ref(false);
  const showTileBoundaries = ref(false);
  const showOverdrawInspector = ref(false);
  return { showPadding, showCollisionBoxes, showTileBoundaries, showOverdrawInspector };
});
