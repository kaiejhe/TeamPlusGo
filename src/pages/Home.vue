<template>
  <main class="flex min-h-screen items-center justify-center bg-background px-4 py-12">
    <section class="w-full max-w-xl space-y-8">
      <header class="space-y-3 text-center">
        <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">卡密验证</h1>
        <p class="text-base text-muted-foreground">请输入兑换卡密，系统会立即完成验证。</p>
      </header>

      <form
        class="flex flex-col gap-5 rounded-2xl border border-border/80 bg-card/90 p-7 shadow-sm backdrop-blur"
        @submit.prevent="handleSubmit"
      >
        <div class="flex w-full items-center gap-3 sm:gap-4">
          <Input
            v-model="cardKey"
            class="h-12 min-w-0 flex-1 rounded-lg text-base"
            type="text"
            placeholder="请输入兑换码"
            :disabled="submitting"
            maxlength="19"
            autofocus
          />
          <Button
            type="submit"
            class="h-12 whitespace-nowrap px-6"
            :disabled="submitting"
          >
            {{ submitting ? "验证中..." : "验证" }}
          </Button>
        </div>
        <p class="text-center text-sm text-muted-foreground">
          支持大写字母和数字，格式示例：ABCD-EFGH-IJKL-MNOP
        </p>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card as verifyCard } from "../apijs/uts";

const router = useRouter();

const cardKey = ref("");
const submitting = ref(false);

const CARD_PATTERN = /^[A-Z0-9]{4}(?:-[A-Z0-9]{4}){3}$/;
const STORAGE_KEY = "team-verified-card";

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
      const now = Date.now();
      if (typeof window !== "undefined") {
        const payload = {
          card: trimmed,
          verifiedAt: now,
          email:
            typeof response?.data?.Order?.Order_us_Email === "string"
              ? response.data.Order.Order_us_Email
              : undefined,
          inviteCount: 0,
          history: [],
          cardInfo: response?.data?.Card ?? null,
          orderInfo: response?.data?.Order ?? null,
        };
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
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
