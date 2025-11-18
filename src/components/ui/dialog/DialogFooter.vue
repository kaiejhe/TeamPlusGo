<template>
  <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end" :class="className">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

defineOptions({ name: "UiDialogFooter" });

const className = props.class ?? "";
</script>
