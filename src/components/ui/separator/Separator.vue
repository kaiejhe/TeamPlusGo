<template>
  <div role="separator" :class="separatorClasses" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
  }>(),
  {
    orientation: "horizontal",
    decorative: false,
  },
);

defineOptions({ name: "UiSeparator" });

const separatorClasses = computed(() =>
  [
    "bg-border",
    props.orientation === "vertical" ? "h-full w-px min-w-[1px]" : "h-px w-full",
  ].join(" "),
);
</script>
