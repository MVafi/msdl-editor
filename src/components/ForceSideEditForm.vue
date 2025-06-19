<script setup lang="ts">
import type { ForceSide } from "@orbat-mapper/msdllib";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MilitaryServiceItems } from "@orbat-mapper/msdllib";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useForm } from "vee-validate";
import { Input } from "@/components/ui/input";
import FormFooter from "@/components/FormFooter.vue";
import type { ScenarioIdType } from "@orbat-mapper/msdllib/dist/lib/scenarioid";

const props = defineProps<{ item: ForceSide }>();
const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "update", value: Partial<ScenarioIdType>): void;
}>();

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Name is required"),
    militaryService: z.string().optional().or(z.literal("")),
    countryCode: z.string().min(1).max(3).toUpperCase().optional().or(z.literal("")),
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.item.name || "",
    militaryService: props.item.militaryService,
    countryCode: props.item.countryCode,
  },
});

const onSubmit = form.handleSubmit((values) => {
  emit("update", values);
});
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-6 mt-6">
      <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!form.isFieldDirty">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        v-slot="{ componentField }"
        name="militaryService"
        :validate-on-blur="!form.isFieldDirty"
      >
        <FormItem>
          <FormLabel>Military service</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a military service" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="{ value, label } in MilitaryServiceItems" :key="value" :value>{{
                  label
                }}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        v-slot="{ componentField }"
        name="countryCode"
        :validate-on-blur="!form.isFieldDirty"
      >
        <FormItem>
          <FormLabel>Country code</FormLabel>
          <FormControl>
            <Input type="text" placeholder="e.g. USA" v-bind="componentField" />
          </FormControl>
          <FormDescription>Use 3 letter country code</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormFooter @cancel="emit('cancel')" />
    </form>
  </div>
</template>
