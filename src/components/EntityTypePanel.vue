<script setup lang="ts">
import PanelDataGrid from "@/components/PanelDataGrid.vue";
import { useEntityTypeStore } from "@/stores/entityTypeStore";
import { computed } from "vue";
import { SisoEnum } from "@siso-entity-type/lib";
import { storeToRefs , type Store} from "pinia";
import EntityTypeForm from "@/components/EntityTypeForm.vue";

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil } from "lucide-vue-next";

const { sisoEnums } = storeToRefs(useEntityTypeStore());

const props = defineProps<{
  entityType: string;
}>();

const sisoEntityType = computed(() =>
  props.entityType ? SisoEnum.fromString(props.entityType) : null,
);

const entityTypeFields = computed(() => {
  if (!sisoEntityType.value) return [];
  return [
    { label: "Kind", value: sisoEnums.value.getKindName(sisoEntityType.value), int : sisoEntityType.value['kind'] },
    { label: "Domain", value: sisoEnums.value.getDomainName(sisoEntityType.value), int : sisoEntityType.value['domain'] },
    { label: "Country", value: sisoEnums.value.getCountryName(sisoEntityType.value), int : sisoEntityType.value['country'] },
    { label: "Category", value: sisoEnums.value.getCategoryName(sisoEntityType.value), int : sisoEntityType.value['category'] },
    { label: "Subcategory", value: sisoEnums.value.getSubcategoryName(sisoEntityType.value), int : sisoEntityType.value['subcategory'] },
    { label: "Specific", value: sisoEnums.value.getSpecificName(sisoEntityType.value), int : sisoEntityType.value['specific'] },
    { label: "Extra", value: sisoEnums.value.getExtraName(sisoEntityType.value), int : sisoEntityType.value['extra'] },
  ] satisfies { label: FieldLabel; value: string ; int: number }[];
});

// Filter out subsequent fields that are the same as the previous, e.g. specific == extra
const uniqueEntityTypeFields = computed(() => {
  return entityTypeFields.value.reduce(
    (acc, field) => {
      if (acc.length === 0 || acc[acc.length - 1].value !== field.value) {
        acc.push(field);
      }
      return acc;
    },
    [] as { label: string; value: string; int : number }[],
  );
});

const store = useEntityTypeStore(); 
const refs = storeToRefs(store);

const enumMappings = {
  Country: {
    select: 'selectCountry',
    selected: 'selectedCountry',
    enum: 'countries',
  },
  Kind: {
    select: 'selectKind',
    selected: 'selectedKind',
    enum: 'kinds',
  },
  Domain: {
    select: 'selectDomain',
    selected: 'selectedDomain',
    enum: 'domains',
  },
  Category: {
    select: 'selectCategory',
    selected: 'selectedCategory',
    enum: 'categories',
  },
  Subcategory: {
    select: 'selectSubcategory',
    selected: 'selectedSubcategory',
    enum: 'subcategories',
  },
  Specific: {
    select: 'selectSpecific',
    selected: 'selectedSpecific',
    enum: 'specifics',
  },
  Extra: {
    select: 'selectExtra',
    selected: 'selectedExtra',
    enum: 'extras',
  },
} as const;

type FieldLabel = keyof typeof enumMappings;
type SelectKeys = typeof enumMappings[FieldLabel]["select"];
type SelectedKeys = typeof enumMappings[FieldLabel]["selected"];
type EnumKeys = typeof enumMappings[FieldLabel]["enum"];

function getSelectEnum(label: FieldLabel): SelectKeys {
  return enumMappings[label].select;
}

function getSelectedEnum(label: FieldLabel): SelectedKeys {
  return enumMappings[label].selected;
}

function getEnum(label: FieldLabel): EnumKeys {
  return enumMappings[label].enum;
}

</script>

<template>
  <div v-if="sisoEntityType">
    
    <h4 class="text-sm font-bold mt-2 flex items-center">
      <span>Entity type: {{ entityType || "Unknown" }}</span>

      <Dialog :modal="false">
        <DialogTrigger as-child>
          <Button variant="outline">
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]" >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>




          <PanelDataGrid class="mt-4" v-if="sisoEntityType">

            <!-- Enumerations loop -->
            <template v-for="(field, index) in uniqueEntityTypeFields" :key="index">
              <span class="p-2">{{ field.label }}</span>
              
              <EntityTypeForm 
                v-if="field?.value" 
                :store = "store"
                :field-int = "field.int"
                :enumerations = "refs[getEnum(field.label as FieldLabel)]"
                :selected-enum = "refs[getSelectedEnum(field.label as FieldLabel)]" 
                :set-enum="store[getSelectEnum(field.label as FieldLabel)]"
              ></EntityTypeForm>
            </template>

          </PanelDataGrid>
          <PanelDataGrid class="mt-4" v-else>
            <span class="font-semibold">No entitytype provided</span>
          </PanelDataGrid>




          <DialogFooter>
            <Button type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </h4>

    <PanelDataGrid class="mt-4" v-if="sisoEntityType">
      <template v-for="(field, index) in uniqueEntityTypeFields" :key="index">
        <span class="font-semibold">{{ field.label }}</span>
        <span>{{ field.value }}</span>
      </template>
    </PanelDataGrid>
    <PanelDataGrid class="mt-4" v-else>
      <span class="font-semibold">No entitytype provided</span>
    </PanelDataGrid>
  </div>
</template>
