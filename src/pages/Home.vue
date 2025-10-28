<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <form class="flex w-full max-w-sm flex-col gap-4" @submit.prevent="handleSubmit">
      <input
        v-model="cardKey"
        class="h-12 w-full rounded-lg border border-slate-300 px-4 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
        type="text"
        placeholder="请输入入会密钥"
        :disabled="submitting"
        maxlength="19"
        autofocus
      />
      <button
        type="submit"
        class="h-12 w-full rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        :disabled="submitting"
      >
        {{ submitting ? "验证中" : "验证" }}
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "@/components/ui/toast";
import { Card as verifyCard } from "../apijs/uts";

const router = useRouter();

const cardKey = ref("");
const submitting = ref(false);

const CARD_PATTERN = /^[A-Z0-9]{4}(?:-[A-Z0-9]{4}){3}$/;

const handleSubmit = async () => {
  if (submitting.value) {
    return;
  }

  const trimmed = cardKey.value.trim().toUpperCase();
  if (!trimmed) {
    toast.error("请输入完整的兑换卡密");
    return;
  }

  if (!CARD_PATTERN.test(trimmed)) {
    toast.error("激活码错误，请检查后重试");
    return;
  }

  cardKey.value = trimmed;
  submitting.value = true;

  try {
    const response = await verifyCard({
      msgoogle: "TeamCard",
      data: { Card: trimmed },
    });

    if (response?.ok) {
      toast.success(response.msg ?? "卡密验证成功");
      router.push({
        name: "VerificationSuccess",
        query: { card: trimmed },
      });
      return;
    }

    toast.error(response?.msg ?? "未能验证该卡密，请稍后再试。");
  } catch (error) {
    const fallbackMessage =
      error instanceof Error ? error.message : "请求出错，请稍后再试或联系客服。";
    toast.error(fallbackMessage);
  } finally {
    submitting.value = false;
  }
};
</script>
