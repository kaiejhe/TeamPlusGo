<template>
  <div class="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-start gap-3">
        <div
          v-if="icon"
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
        >
          <component :is="icon" class="h-4 w-4" />
        </div>
        <div class="space-y-1">
          <h2 class="text-xl font-semibold text-slate-900 md:text-2xl">{{ title }}</h2>
          <p v-if="description" class="text-sm text-slate-500">
            {{ description }}
          </p>
          <span
            v-if="statusLabel"
            class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
          >
            {{ statusLabel }}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  statusLabel?: string;
  icon?: any;
}

defineProps<Props>();
</script>
