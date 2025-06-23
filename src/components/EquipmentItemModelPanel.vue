<script setup lang="ts">
import type { EquipmentItem } from "@orbat-mapper/msdllib";
import { computed } from "vue";
import EntityTypePanel from "@/components/EntityTypePanel.vue";

const props = defineProps<{
  equipment: EquipmentItem;
}>();

const emit = defineEmits<{
  (e: "update:equipment", value: EquipmentItem): void;
}>();

const equipmentModel = computed(() => props.equipment?.model ?? null);
</script>
<template>
  <div v-if="equipmentModel">
    <h4 class="text-sm font-bold mt-2">EquipmentItem Model</h4>
    <EntityTypePanel
      v-if="equipmentModel?.entityType"
      v-model="equipmentModel.entityType"
      @update:model-value="emit('update:equipment', equipment)"
    >
    </EntityTypePanel>
    <span v-else>No entitytype provided</span>
  </div>
  <div v-else>
    <h4 class="text-sm font-bold mt-2">No equipment model provided</h4>
  </div>
</template>
