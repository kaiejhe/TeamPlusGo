<template>
  <th
    scope="col"
    class="h-12 px-4 text-left align-middle text-xs font-medium text-muted-foreground"
    :class="className"
  >
    <slot />
  </th>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

defineOptions({ name: "UiTableHead" });

const className = props.class ?? "";
</script>
