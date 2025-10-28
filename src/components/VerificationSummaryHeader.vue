<template>
  <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div class="space-y-1">
      <h2 class="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        {{ title }}
      </h2>
      <p v-if="description" class="max-w-2xl text-xs text-muted-foreground md:text-sm">
        {{ description }}
      </p>
    </div>
    <Button
      variant="outline"
      size="sm"
      class="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-md border-border text-xs font-medium text-muted-foreground transition-colors hover:text-foreground md:self-center"
      @click="$emit('back')"
    >
      <ArrowLeft class="h-4 w-4" />
      {{ backLabel }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

withDefaults(
  defineProps<{
    title: string;
    description?: string;
    backLabel?: string;
  }>(),
  {
    description: "",
    backLabel: "返回首页",
  },
);

defineEmits<{
  (event: "back"): void;
}>();
</script>
