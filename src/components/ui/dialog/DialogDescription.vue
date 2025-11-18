<template>
  <p class="text-sm text-muted-foreground" :class="className">
    <slot />
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

defineOptions({ name: "UiDialogDescription" });

const className = props.class ?? "";
</script>
