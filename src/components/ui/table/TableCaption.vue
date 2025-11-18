<template>
  <caption class="mt-4 text-sm text-muted-foreground" :class="className">
    <slot />
  </caption>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

defineOptions({ name: "UiTableCaption" });

const className = props.class ?? "";
</script>
