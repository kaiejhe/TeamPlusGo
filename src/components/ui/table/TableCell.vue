<template>
  <td class="p-4 align-middle text-sm" :class="className">
    <slot />
  </td>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

defineOptions({ name: "UiTableCell" });

const className = props.class ?? "";
</script>
