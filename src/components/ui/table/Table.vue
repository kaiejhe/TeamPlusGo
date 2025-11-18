<template>
  <div class="relative w-full overflow-auto">
    <table class="w-full caption-bottom text-sm" :class="className">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

defineOptions({ name: "UiTable" });

const className = props.class ?? "";
</script>
