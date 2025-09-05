import type { TacticalJson } from "@orbat-mapper/msdllib/dist/lib/common";
import type { Position } from "geojson";
import type { InjectionKey } from "vue";

export type MapContextMenuEvent = {
  x: number;
  y: number;
  position: Position;
  zoomLevel?: number;
  units?: TacticalJson[];
  equipment?: TacticalJson[];
};

export type EnumItem<G = string> = {
  value: G;
  label: string;
  description?: string;
};

export const tabsProviderKey = Symbol("TabsProvider") as InjectionKey<TabsState>;

export interface TabsState {
  selectedIndex: number;
  count: number;
  tabClass?: string;
}
