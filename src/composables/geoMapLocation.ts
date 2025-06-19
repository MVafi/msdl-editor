import { Map as MapLibreMap, MapMouseEvent } from "maplibre-gl";
import {
  createEventHook,
  type Fn,
  onClickOutside,
  onKeyStroke,
  tryOnBeforeUnmount,
} from "@vueuse/core";
import { ref } from "vue";
import type { Position } from "geojson";
import { useUIStore } from "@/stores/uiStore.ts";

export interface UseGetMapLocationOptions {
  cancelOnClickOutside?: boolean;
  stopPropagationOnClickOutside?: boolean;
  changeCursor?: boolean;
}

export function useGetMapLocation(map: MapLibreMap, options: UseGetMapLocationOptions = {}) {
  const {
    cancelOnClickOutside = true,
    stopPropagationOnClickOutside = true,
    changeCursor = true,
  } = options;

  const isActive = ref(false);
  const uiStore = useUIStore();

  const prevCursor = map.getCanvas().style.cursor;
  let stopEscListener: Fn;
  let stopClickOutside: Fn | undefined;
  let clickListener: ((e: MapMouseEvent) => void) | undefined;

  const onGetLocationHook = createEventHook<[Position]>();
  const onCancelHook = createEventHook();
  const onStartHook = createEventHook();

  function start() {
    isActive.value = true;
    onStartHook.trigger(null);

    if (changeCursor) {
      uiStore.hoverEnabled = false;
      map.getCanvas().style.cursor = "crosshair";
    }
    if (cancelOnClickOutside) {
      stopClickOutside = onClickOutside(map.getContainer(), (e) => {
        if (stopPropagationOnClickOutside) e.stopPropagation();
        cancel();
      });
    }
    stopEscListener = onKeyStroke("Escape", () => cancel());
    clickListener = handleMapClickEvent;
    map.once("click", clickListener);
  }

  function handleMapClickEvent(event: MapMouseEvent) {
    event.originalEvent.stopPropagation();
    cleanUp();
    // MapLibre uses [lng, lat]
    onGetLocationHook.trigger([event.lngLat.lng, event.lngLat.lat]);
  }

  function cleanUp() {
    const el = map?.getCanvas();
    if (el && changeCursor) {
      uiStore.hoverEnabled = true;
      el.style.cursor = prevCursor;
    }
    isActive.value = false;
    if (clickListener) {
      map.off("click", clickListener);
      clickListener = undefined;
    }
    if (stopEscListener) stopEscListener();
    if (stopClickOutside) stopClickOutside();
  }

  function cancel() {
    cleanUp();
    onCancelHook.trigger(null);
  }

  tryOnBeforeUnmount(() => cleanUp());

  return {
    isActive,
    cancel,
    start,
    onStart: onStartHook.on,
    onGetLocation: onGetLocationHook.on,
    onCancel: onCancelHook.on,
  };
}
