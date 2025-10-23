<template>
  <TransitionRoot as="template" :show="isVisible">
    <Dialog as="div" class="relative z-[9999]" @close="handleDialogClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-150"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60" />
      </TransitionChild>

      <div class="fixed inset-0 z-[9999] flex min-h-full items-center justify-center px-4 py-8">
        <TransitionChild
          as="template"
          enter="ease-out duration-200"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-150"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <DialogPanel class="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card text-left shadow-xl transition-transform transition-opacity duration-200">
            <div class="flex items-start gap-4 px-6 pb-2 pt-6">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <component :is="iconComponent" class="h-6 w-6" aria-hidden="true" />
              </div>
              <div class="flex-1 space-y-2">
                <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-foreground">
                  {{ opts.title }}
                </DialogTitle>
                <div
                  class="whitespace-pre-wrap text-sm text-muted-foreground"
                  :class="contentAlignClass"
                >
                  <slot>{{ opts.content }}</slot>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 bg-muted/40 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                v-if="opts.showCancel"
                type="button"
                class="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted/60 sm:w-auto"
                @click="handleCancel"
              >
                {{ opts.cancelText }}
              </button>
              <button
                type="button"
                class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 sm:w-auto"
                @click="handleConfirm"
              >
                {{ opts.confirmText }}
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { computed, ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

const defaultOptions = {
  title: "确认操作",
  content: "请确认是否继续当前操作。",
  showCancel: true,
  cancelText: "返回",
  confirmText: "确定",
  maskClosable: true,
  contentAlign: "center",
  type: "info",
};

const isVisible = ref(false);
const opts = ref({ ...defaultOptions });
let resolver = null;

function open(options = {}) {
  opts.value = { ...defaultOptions, ...options };
  isVisible.value = true;

  return new Promise((resolve) => {
    resolver = resolve;
  });
}

function close(result) {
  isVisible.value = false;
  if (resolver) {
    resolver(result);
    resolver = null;
  }
}

function handleConfirm() {
  close({ confirm: true, cancel: false });
}

function handleCancel() {
  close({ confirm: false, cancel: true });
}

function handleDialogClose() {
  if (!opts.value.maskClosable) return;
  handleCancel();
}

const contentAlignClass = computed(() => ({
  "text-center": opts.value.contentAlign === "center",
  "text-left": opts.value.contentAlign === "left",
  "text-right": opts.value.contentAlign === "right",
}));

const iconComponent = computed(() => {
  switch (opts.value.type) {
    case "success":
      return CheckCircleIcon;
    case "warning":
      return ExclamationTriangleIcon;
    default:
      return QuestionMarkCircleIcon;
  }
});

defineExpose({ open, close });
</script>
