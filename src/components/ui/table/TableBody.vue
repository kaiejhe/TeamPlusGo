<template>
  <tbody class="[&>tr:last-child]:border-0" :class="className">
    <slot />
  </tbody>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

defineOptions({ name: "UiTableBody" });

const className = props.class ?? "";
</script>
