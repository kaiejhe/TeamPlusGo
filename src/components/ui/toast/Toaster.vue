<script setup lang="ts">
import { Toaster as SonnerToaster } from "vue-sonner";

type Theme = "light" | "dark" | "system";
type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const props = withDefaults(
  defineProps<{
    theme?: Theme;
    position?: Position;
    expand?: boolean;
    richColors?: boolean;
  }>(),
  {
    theme: "dark" as Theme,
    position: "bottom-right" as Position,
    expand: false,
    richColors: false,
  },
);

const toastOptions = {
  class:
    "group pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-lg border border-slate-800/70 bg-slate-950/95 px-4 py-3 text-sm text-slate-100 shadow-2xl backdrop-blur transition-all",
  descriptionClass: "text-xs text-slate-400",
  actionButtonClass:
    "inline-flex h-8 items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-3 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500",
  cancelButtonClass:
    "inline-flex h-8 items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500",
  classNames: {
    success:
      "border-emerald-500/60 bg-emerald-600/95 text-emerald-50",
    error:
      "border-rose-500/70 bg-rose-600/95 text-rose-50",
    warning:
      "border-amber-500/70 bg-amber-500/95 text-amber-50",
    info:
      "border-sky-500/70 bg-sky-600/95 text-sky-50",
  },
};
</script>

<template>
  <SonnerToaster
    :position="props.position"
    :theme="props.theme"
    :expand="props.expand"
    :rich-colors="props.richColors"
    :toast-options="toastOptions"
  />
</template>

