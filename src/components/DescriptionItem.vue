<script setup lang="ts">
defineProps<{ label: string; ddClass?: string }>();
</script>

<template>
  <div class="px-0 py-4">
    <dt class="text-sm font-semibold">
      <slot name="label">{{ label }}</slot>
    </dt>
    <dd class="mt-1 text-sm" :class="ddClass">
      <slot />
    </dd>
  </div>
</template>
