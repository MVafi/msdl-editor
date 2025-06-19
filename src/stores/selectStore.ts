import { defineStore } from "pinia";
import { shallowRef } from "vue";
import type { EquipmentItem, ForceSide, Unit } from "@orbat-mapper/msdllib";

export const useSelectStore = defineStore("selectStore", () => {
  const activeItem = shallowRef<Unit | EquipmentItem | ForceSide | null>(null);
  function clearActiveItem() {
    activeItem.value = null;
  }
  return { activeItem, clearActiveItem };
});
