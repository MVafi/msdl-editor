<script setup lang="ts">
import type { Unit } from "@orbat-mapper/msdllib";
import { computed, ref } from "vue";
import EntityTypePanel from "@/components/EntityTypePanel.vue";

const props = defineProps<{
  unit: Unit;
}>();

// Re-render component when the unittModel is updated
const componentKey = ref(0);
const triggerRerender = () => {
  componentKey.value += 1;
  emit("rerenderXMLpreview");
};
const emit = defineEmits(["rerenderXMLpreview"]);

const unitModel = computed(() => props.unit?.model ?? null);
</script>
<template>
  <div v-if="unitModel">
    <h4 class="text-sm font-bold">Unit Model</h4>
    <EntityTypePanel 
      v-if="unitModel?.entityType" 
      v-model="unitModel.entityType"
      @update:modelValue="triggerRerender"
      :key="componentKey"
    >
    </EntityTypePanel>
  </div>
  <div v-else>
    <h4 class="text-sm font-bold mt-2">No unit model provided</h4>
  </div>
</template>
