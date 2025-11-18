<template>
  <tr
    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    :class="className"
    @click="$emit('click', $event)"
  >
    <slot />
  </tr>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

defineOptions({ name: "UiTableRow" });

const className = props.class ?? "";
</script>
