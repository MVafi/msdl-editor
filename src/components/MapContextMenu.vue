<script setup lang="ts">
// The shadcn context menu component is not compatible with maplibre-gl. The contextmenu event
// is not triggered as expected. A workaround is to use the maplibre-gl context menu event and
// dropdown menu that will be positioned manually. Unfortunately we lose the longpress event,
// so it will currently not work on mobile devices.

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CrosshairIcon } from "lucide-vue-next";
import { computed } from "vue";
import { formatDecimalDegrees } from "@/utils.ts";
import type { Position } from "geojson";
import type { MapContextMenuEvent } from "@/components/types.ts";
import MilSymbol from "@/components/MilSymbol.vue";
import { useSelectStore } from "@/stores/selectStore.ts";
import { useScenarioStore } from "@/stores/scenarioStore.ts";
import { Badge } from "@/components/ui/badge";

const props = defineProps<{ event?: MapContextMenuEvent }>();
const isOpen = defineModel({ default: false });
const selectStore = useSelectStore();
const { msdl } = useScenarioStore();

const clickPosition = computed(() => {
  if (!props.event) return [0, 0];
  return [...props.event.position];
});

const style = computed(() => ({
  top: `${props.event?.y}px`,
  left: `${props.event?.x}px`,
}));

function returnMapProviders(lonLat: Position, zoomLevel = 15) {
  return [
    {
      name: "Google Maps",
      url: `https://www.google.com/maps/@${lonLat[1]},${lonLat[0]},${zoomLevel}z`,
    },
    {
      name: "Google Street View",
      url:
        "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" +
        lonLat[1] +
        "," +
        lonLat[0],
    },
    {
      name: "Bing Maps",
      url: `https://www.bing.com/maps?cp=${lonLat[1]}~${lonLat[0]}&lvl=${zoomLevel}`,
    },
    {
      name: "OpenStreetMap",
      url: `https://www.openstreetmap.org/#map=15/${lonLat[1]}/${lonLat[0]}`,
    },
    {
      name: "Geohack",
      url: `https://geohack.toolforge.org/geohack.php?params=${lonLat[1]}_N_${lonLat[0]}_E`,
    },
  ];
}

function onUnitSelect(activeItemId?: string) {
  if (!activeItemId) return;
  selectStore.activeItem =
    (msdl.value?.getUnitById(activeItemId) || msdl.value?.getEquipmentById(activeItemId)) ?? null;
}
</script>

<template>
  <DropdownMenu v-model:open="isOpen">
    <DropdownMenuTrigger
      class="absolute pointer-events-none data-[state=closed]:*:hidden"
      :style="style"
    >
      <CrosshairIcon class="size-6 text-red-900/70 -translate-x-1/2 -translate-y-1/2" />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-56 data-[state=open]:animate-none data-[state=closed]:animate-none"
      align="start"
      :sideOffset="0"
    >
      <DropdownMenuLabel v-if="event">{{ formatDecimalDegrees(clickPosition) }}</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuSub>
        <DropdownMenuSubTrigger><span>Open in</span></DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            v-for="{ name, url } in returnMapProviders(clickPosition, event?.zoomLevel)"
            :key="url"
            as-child
            ><a :href="url" target="_blank">{{ name }}</a></DropdownMenuItem
          >
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuSub v-if="event?.units?.length">
        <DropdownMenuSubTrigger
          >Units
          <Badge class="ml-2" variant="secondary">{{
            event.units.length
          }}</Badge></DropdownMenuSubTrigger
        >
        <DropdownMenuSubContent class="max-h-[70vh] overflow-auto">
          <DropdownMenuItem
            v-for="item in event.units"
            :key="item.id"
            @select.prevent="onUnitSelect(item.id)"
          >
            <MilSymbol :sidc="item.sidc" /><span class="">{{ item.label }}</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent> </DropdownMenuSub
      ><DropdownMenuSub v-if="event?.equipment?.length">
        <DropdownMenuSubTrigger
          >Equipment
          <Badge class="ml-2" variant="secondary">{{
            event.equipment.length
          }}</Badge></DropdownMenuSubTrigger
        >
        <DropdownMenuSubContent class="max-h-[70vh] overflow-auto">
          <DropdownMenuItem
            v-for="item in event.equipment"
            :key="item.id"
            @select.prevent="onUnitSelect(item.id)"
          >
            <MilSymbol :sidc="item.sidc" /><span class="">{{ item.label }}</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
