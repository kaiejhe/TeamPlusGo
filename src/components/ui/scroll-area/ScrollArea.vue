<template>
  <div class="relative overflow-hidden" :style="rootStyle">
    <div class="h-full w-full overflow-auto" ref="viewport">
      <div :style="{ minWidth: '100%' }">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

const props = withDefaults(
  defineProps<{
    class?: string;
    type?: "auto" | "always";
    orientation?: "vertical" | "horizontal" | "both";
    scrollbars?: "visible" | "hidden";
  }>(),
  {
    type: "auto",
    orientation: "vertical",
    scrollbars: "visible",
  },
);

defineOptions({ name: "UiScrollArea" });

const rootStyle = computed(() => props.class);

const viewport = ref<HTMLDivElement | null>(null);

watchEffect(() => {
  if (!viewport.value) return;
  if (props.scrollbars === "hidden") {
    viewport.value.style.scrollbarWidth = "none";
    viewport.value.style.msOverflowStyle = "none";
    const style = document.createElement("style");
    style.textContent = `
      .scroll-area-hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    viewport.value.classList.add("scroll-area-hide-scrollbar");
  }
});
</script>
