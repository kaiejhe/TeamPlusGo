<template>
  <h2 class="text-lg font-semibold leading-none tracking-tight" :class="className">
    <slot />
  </h2>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

defineOptions({ name: "UiDialogTitle" });

const className = props.class ?? "";
</script>
