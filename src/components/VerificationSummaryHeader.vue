<template>
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div class="space-y-1">
      <h2 class="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {{ title }}
      </h2>
      <p v-if="description" class="text-sm text-muted-foreground md:text-base">
        {{ description }}
      </p>
    </div>
    <Button
      variant="outline"
      size="sm"
      class="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
