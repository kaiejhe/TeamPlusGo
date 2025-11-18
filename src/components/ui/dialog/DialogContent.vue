<template>
  <Teleport to="body">
    <transition name="ui-dialog-fade">
      <div v-if="context.open.value" class="ui-dialog-portal">
        <div class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" @click="handleOverlayClick" />
        <div class="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            class="w-full max-w-lg gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 sm:rounded-xl sm:p-8"
            :class="contentClass"
            role="dialog"
            aria-modal="true"
            @click.stop
          >
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDialogContext } from "./context";

const props = withDefaults(
  defineProps<{
    class?: string;
    closeOnOverlay?: boolean;
  }>(),
  {
    closeOnOverlay: true,
  },
);

const context = useDialogContext("DialogContent");

const contentClass = computed(() => props.class ?? "");

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    context.setOpen(false);
  }
};
</script>

<style scoped>
.ui-dialog-fade-enter-active,
.ui-dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}
.ui-dialog-fade-enter-from,
.ui-dialog-fade-leave-to {
  opacity: 0;
}
.ui-dialog-portal {
  position: fixed;
  inset: 0;
}
</style>
