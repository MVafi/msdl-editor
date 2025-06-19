<script setup lang="ts">
import { Button } from "@/components/ui/button";

const emit = defineEmits<{
  (e: "cancel"): void;
}>();
</script>
<template>
  <footer class="mt-4 flex justify-end items-center gap-1">
    <Button variant="ghost" size="sm" @click="emit('cancel')" type="button">Cancel</Button>
    <Button size="sm" type="submit">Save</Button>
  </footer>
</template>
