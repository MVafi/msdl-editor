<script setup lang="ts">
// Vue components
import { Check, ChevronsUpDown, FileDiff, Search } from 'lucide-vue-next'
import { ref, watch, computed, onMounted, type Ref } from 'vue'
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox'

import { useEntityTypeStore } from "@/stores/entityTypeStore";
import { storeToRefs, type Store } from "pinia";
import { ScrollArea } from '@/components/ui/scroll-area'

// Type a single enumeration
type enumeration = {
  title: string;
  value: number;
};

// Receive the entityValue from the parent component
const props = defineProps<{
  store : Store,     //////////////////////////not used
  fieldInt : number ///////////////////////////////not used
  enumerations: Ref<enumeration[]>,                     // Provides all possible options for the dropdowns
  selectedEnum : Ref<number | null>,                    // Reference to the selectedEnum within the store
  setEnum : (value: number | null) => void,             // Method to select the correct Enumeration value in the store
}>();

// TODO; DIT WERKT NOG NIET GOED
const localKind: Ref<number | null> = ref(props.fieldInt);

// Watch whether the store entity changes the entity value, e.g. display the correct value upon change
// TODO, test with importing a 1.2.3234 etc number ?????
// watch(props.selectedEnum, (newVal: number | null) => (localKind.value = localKind.value !== newVal ? newVal : localKind.value));

// Watch whether the user changes the input field manually
const updateStore = async () => {
  props.setEnum(localKind.value)
}

// Display-value for dropdown search field, finding the title for the given enumeration value
const selectedKindLabel = computed(() => {
  return props.enumerations.value.find((item : enumeration) => item.value === localKind.value)?.title || '';
});

</script>


<!-- dialog ding -->
 
<template>
  <Combobox 
    v-model="localKind"
    @update:modelValue="updateStore"
  >
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child >
        <Button variant="ghost" class="justify-between font-light size-full">
            {{ props.enumerations.value.find((item : enumeration) => item.value === localKind)?.title ?? 'Select <TBD>' }}
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList class="font-light">
      <div class="relative w-full max-w-sm items-center">
        <ComboboxInput 
          :display-value="() => selectedKindLabel"
          class="focus-visible:ring-0 border-0 rounded-none h-10" 
        />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
          <Search class="size-4 text-muted-foreground" />
        </span>
      </div>

      <ComboboxEmpty>
        No data available
      </ComboboxEmpty>

      <ScrollArea class="h-72">
        <ComboboxGroup>
          <ComboboxItem
            v-for="i_localKind in props.enumerations.value"
            :key="i_localKind.value"
            :value="i_localKind.value"
          >
            {{ i_localKind.title }}
            <ComboboxItemIndicator>
              <Check :class="cn('ml-auto h-4 w-4')" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxGroup>
      </ScrollArea>
    </ComboboxList>
  </Combobox>
</template>