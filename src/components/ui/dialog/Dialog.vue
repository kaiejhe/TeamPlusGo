<template>
  <slot />
</template>

<script setup lang="ts">
import { provide, toRef } from "vue";
import { dialogContextKey } from "./context";

const props = withDefaults(
  defineProps<{
    open?: boolean;
  }>(),
  {
    open: false,
  },
);

const emit = defineEmits<{
  (event: "update:open", value: boolean): void;
}>();

const openRef = toRef(props, "open");

const setOpen = (value: boolean) => {
  emit("update:open", value);
};

provide(dialogContextKey, {
  open: openRef,
  setOpen,
});
</script>
