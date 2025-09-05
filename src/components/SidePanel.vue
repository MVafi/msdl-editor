<script setup lang="ts">
import { Accordion } from "@/components/ui/accordion";
import { useLayerStore } from "@/stores/layerStore.ts";
import CreateNewForceSideDialog from "@/components/CreateNewForceSideDialog.vue";
import { computed, watchEffect } from "vue";
import { sortBy } from "@/utils.ts";
import { Button } from "@/components/ui/button";
import { useScenarioStore } from "@/stores/scenarioStore.ts";
import SidePanelDropdown from "@/components/SidePanelDropdown.vue";
import { useSideStore } from "@/stores/uiStore.ts";
import { useDialogStore } from "@/stores/dialogStore";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { isOrbatItemDragItem } from "@/types/draggables.ts";
import { extractInstruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import SideItem from "@/components/orbat/SideItem.vue";
import { useExpandedStore } from "@/stores/expandedStore.ts";
import { useSelectStore } from "@/stores/selectStore";
import DescriptionItem from "@/components/DescriptionItem.vue";
import { Checkbox } from "@/components/ui/checkbox"
import { UNALLOCATED_FEDERATE } from "@/stores/selectStore.ts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge";

const {
  msdl,
  modifyScenario: { addForceSide, updateOrbatDragItems },
} = useScenarioStore();

const layerStore = useLayerStore();
const sideStore = useSideStore();
const dialogStore = useDialogStore();
const expandedStore = useExpandedStore();
const selectStore = useSelectStore();

const sides = computed(() => {
  const localSides = sideStore.sortAlphabetically
    ? sortBy(msdl.value?.sides ?? [], "name")
    : (msdl.value?.sides ?? []);
  if (sideStore.hideEmptySides) {
    return localSides.filter((side) => side.subordinates.length > 0 || side.equipment.length > 0);
  }
  return localSides;
});

const hasHiddenSides = computed(() => {
  return (sides.value?.length ?? 0) < (msdl.value?.sides.length ?? 0);
});

watchEffect((onCleanup) => {
  const dndFunction = combine(
    monitorForElements({
      onDrop(args) {
        const { location, source } = args;
        // didn't drop on anything
        if (!location.current.dropTargets.length) return;
        const target = location.current.dropTargets[0];
        const instruction = extractInstruction(target.data);

        if (instruction && isOrbatItemDragItem(source.data) && isOrbatItemDragItem(target.data)) {
          updateOrbatDragItems(source.data, target.data, instruction);
        }
      },
    }),
  );

  onCleanup(() => {
    dndFunction();
  });
});

function toggleLayers() {
  if (layerStore.layers.size >= sides.value.length) {
    layerStore.layers.clear();
    return;
  }
  sides.value.forEach((side) => {
    layerStore.layers.add(side.objectHandle);
  });
}

const allFederates = computed(() => {
  return (msdl.value?.deployment?.federates || []).concat(UNALLOCATED_FEDERATE);
});

function isFederateShown(id : string){
  if (layerStore.shownFederates.has(id)) return true
  return false
}

function toggleShownFederates(id : string, value : boolean |  'indeterminate') {
  if (value === 'indeterminate') return
  if (value){
    layerStore.shownFederates.add(id)
  } else {
    layerStore.shownFederates.delete(id)
  }
};

function openFederatesPanel() {
  selectStore.openFederatesPanel();
}

function createForceSide() {
  dialogStore.toggleCreateForceSideDialog();
}

function showAssociations() {
  dialogStore.toggleAssociationDialog();
}
</script>
<template>
  <header v-if="msdl" class="px-4 mt-1">

    <div class="flex items-center justify-between">
      <h3 class="text-xs/6 font-semibold uppercase">
        Sides<span v-if="hasHiddenSides" class="ml-2 text-muted-foreground text-xs"
          >({{ sides.length }}/{{ msdl?.sides.length }})</span
        >
      </h3>
      <SidePanelDropdown
        @toggleVisibility="toggleLayers"
        @createForceSide="createForceSide"
        @showAssociations="showAssociations"
      />
    </div>

    
    <ScrollArea class="pb-3">
      <div class="flex space-x-2">
        <div v-for="federate in allFederates" :key="federate.name">
          <div class="flex items-center space-x-2 pr-2">
              <Checkbox :model-value="isFederateShown(federate.name || '')" @update:model-value="(value : boolean |  'indeterminate') => toggleShownFederates(federate.name || '', value)"/>
              <label
                for="terms"
                class="text-xs/6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
              >
              <Badge variant="secondary" class="text-muted-foreground">{{ federate.name }}</Badge>
              </label>
          </div>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>


  </header>
  <CreateNewForceSideDialog
    v-model:open="dialogStore.isCreateForceSideDialogOpen"
    @created="addForceSide"
  />

  <Accordion type="multiple" class="mt-2" v-model="expandedStore.openSideItems">
    <SideItem
      v-for="side in sides"
      :key="side.objectHandle"
      :sideObjectHandle="side.objectHandle"
    />
  </Accordion>
  <div v-if="msdl">
    <div class="m-4">
      <Button variant="secondary" @click="toggleLayers()">Toggle all side visibilities</Button>
      <Button variant="secondary" class="ml-4" @click="openFederatesPanel()">
        Show all federates
      </Button>
      <DescriptionItem label="Associations">
        <Button variant="outline" class="mt-2" @click="dialogStore.toggleAssociationDialog()"
          >Show</Button
        >
      </DescriptionItem>
    </div>
  </div>
</template>
