<template>
  <thead class="bg-muted/50 [&>tr]:border-b" :class="className">
    <slot />
  </thead>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

defineOptions({ name: "UiTableHeader" });

const className = props.class ?? "";
</script>
