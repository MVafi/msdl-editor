<script setup lang="ts">
// Vue components
import { Check, ChevronsUpDown, FileDiff, Search } from 'lucide-vue-next'
import { ref, watch, computed, type Ref } from 'vue'
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox'

import { useEntityTypeStore } from "@/stores/entityTypeStore";
import { storeToRefs, type Store } from "pinia";

// const store = useEntityTypeStore();
// const {
//   countries,
//   kinds,
//   domains,
//   categories,
//   subcategories,
//   specifics,
//   extras,
//   selectedEntityType,
//   searchResults,
//   selectedCountry,
//   selectedKind,
//   selectedDomain,
//   selectedCategory,
//   selectedSubcategory,
//   selectedSpecific,
//   selectedExtra,
// } = storeToRefs(useEntityTypeStore());

// const { kinds, selectedKind } = storeToRefs(store);


// const entityLabelxx = 'kinds'; // or any other key like 'kinds', 'domains', etc.

// console.log(',,,,,,,,,,,,,,,,,,,')
// console.log(kinds)

// store.selectKind(props.entityValue);

// const refs = storeToRefs(store);

// console.log('------------xxx');
// console.log(refs['kinds'].value);

// const refKeys = [
//   { label: 'Kind', section: 'kinds'},
//   { label: 'Domain', section: 'domains'},
//   { label: 'Country', section: 'countries'},
//   { label: 'Category', section: 'categories'},
//   { label: 'Subcategory', section: 'subcategories'},
//   { label: 'Specific', section: 'specifics'},
//   { label: 'Extra', section: 'extras'},
// ]

// const localEnum = ref(props.entityValue)

// Watch for changes to the entityValue dropdown field, the 
// const updateCountry = async () => console.log('hiiiiiiii'); store.selectCountry(localCountry.value);
// should be coded here

// Type a single enumeration
type enumeration = {
  title: string;
  value: number;
};

// Receive the entityValue from the parent component
const props = defineProps<{
  store : Store,
  fieldInt : number
  enumerations: Ref<enumeration[]>,
  selectedEnum : Ref<number | null>,
  selectEnumMethod : (kind: number | null) => void,
}>();

// TODO; DIT WERKT NOG NIET GOED
const localKind: Ref<number | null> = ref(props.fieldInt);

console.log('xxxxxxxx')
console.log(localKind.value)

// Watch whether the store entity changes the entity value, e.g. display the correct value upon change
watch(props.selectedEnum, (newVal: number | null) => (localKind.value = localKind.value !== newVal ? newVal : localKind.value));

// Watch whether the user changes the input field manually
const updateKind = async () => {
  props.selectEnumMethod(localKind.value)
}
// updateKind()

// Fill search field when selecting a property
const selectedKindLabel = computed(() => {
  return props.enumerations.value.find((item : enumeration) => item.value === localKind.value)?.title || '';
});

</script>


<!-- dialog ding -->
 
<template>
  <Combobox 
    v-model="localKind"
    @update:modelValue="updateKind"
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
          class="focus-visible:ring-0 border-0 border-b rounded-none h-10" 
          placeholder="Select <TBD>..."
          :value="selectedKindLabel"
        />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
          <Search class="size-4 text-muted-foreground" />
        </span>
      </div>

      <ComboboxEmpty>
        No data available
      </ComboboxEmpty>

      <ComboboxGroup>
        <ComboboxItem
          v-for="i_kind in props.enumerations.value"
          :key="i_kind.value"
          :value="i_kind.value"
        >
          {{ i_kind.title }}
          <ComboboxItemIndicator>
            <Check :class="cn('ml-auto h-4 w-4')" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>