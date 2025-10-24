<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-[9999]" @close="handleCancel">
      <TransitionChild
        as="template"
        enter="ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-150"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50" />
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
          <DialogPanel
            class="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl transition-all duration-200"
          >
            <div class="flex items-start gap-4 px-6 pb-2 pt-6">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailCheck class="h-6 w-6" aria-hidden="true" />
              </div>
              <div class="space-y-2">
                <DialogTitle class="text-lg font-semibold text-slate-900">确认绑定邮箱</DialogTitle>
                <p class="text-sm text-slate-600">
                  请确认以下信息，提交后会创建订单并尝试发送邀请。
                </p>
              </div>
            </div>

            <div class="space-y-4 px-6 pb-6">
              <div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <div class="flex items-start justify-between gap-4 py-1">
                  <span class="text-slate-500">兑换卡</span>
                  <span class="font-medium text-slate-900">{{ card }}</span>
                </div>
                <div class="flex items-start justify-between gap-4 py-1">
                  <span class="text-slate-500">绑定邮箱</span>
                  <span class="font-medium text-slate-900">{{ email }}</span>
                </div>
                <div v-if="afterSalesText" class="flex items-start justify-between gap-4 py-1">
                  <span class="text-slate-500">售后时长</span>
                  <span class="font-medium text-slate-900">{{ afterSalesText }}</span>
                </div>
              </div>

              <p class="text-xs text-slate-500">
                提交后将立即尝试创建订单并发送邀请邮件，如信息有误可取消返回修改。
              </p>

              <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  class="inline-flex h-10 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
                  @click="handleCancel"
                >
                  返回修改
                </button>
                <button
                  type="button"
                  class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 sm:w-auto"
                  @click="handleConfirm"
                >
                  确认提交
                </button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { MailCheck } from "lucide-vue-next";

const props = defineProps<{
  open: boolean;
  card: string;
  email: string;
  afterSales?: number | null;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const afterSalesText = computed(() => {
  if (props.afterSales == null || Number.isNaN(props.afterSales)) {
    return "";
  }
  if (props.afterSales === 0) {
    return "暂无信息";
  }
  return `${props.afterSales} 天`;
});

const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  emit("cancel");
};
</script>
