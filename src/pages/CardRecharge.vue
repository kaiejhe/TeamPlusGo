<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { BadgeCheck, CreditCard } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

const CARD_VALIDATE_URL = "https://homeapi.ztjs999999.workers.dev/cdk/getcard";

const router = useRouter();
const cardCode = ref("");
const submitting = ref(false);

type ValidateCardResponse = {
  code?: number;
  message?: string;
  success?: boolean;
};

const validateCard = async (value: string) => {
  const response = await fetch(CARD_VALIDATE_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      card: value,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as ValidateCardResponse;

  if (!response.ok || data.code !== 200 || data.success !== true) {
    throw new Error(data.message || "卡密验证失败");
  }

  return data;
};

const handleValidate = async () => {
  const value = cardCode.value.trim();

  if (!value || submitting.value) {
    if (!value) {
      toast.error("请输入充值卡密");
    }
    return;
  }

  submitting.value = true;

  try {
    await validateCard(value);

    toast.success("卡密验证成功");
    router.push({
      name: "CardRechargeSuccess",
      query: {
        card: value,
      },
    });
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "验证失败，请稍后重试");
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
    <div class="mx-auto max-w-2xl">
      <Card class="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader class="space-y-3 border-b border-slate-100 pb-5">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
          >
            <CreditCard class="h-5 w-5" />
          </div>
          <div class="space-y-2">
            <CardTitle class="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              卡密验证
            </CardTitle>
            <CardDescription class="text-sm leading-6 text-slate-500">
              输入充值卡密完成验证，验证成功后将进入参数验证页面。
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent class="space-y-6 p-5 sm:p-6">
          <div class="space-y-3">
            <label for="card-code" class="text-sm font-semibold text-slate-900">
              请输入充值卡密
            </label>

            <Input
              id="card-code"
              v-model="cardCode"
              placeholder="请输入充值卡密"
              class="h-12 rounded-xl border-slate-200 bg-white px-4 text-base text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0"
              autocomplete="off"
              @keyup.enter="handleValidate"
            />
          </div>

          <Button
            class="h-12 w-full rounded-xl bg-emerald-500 text-base font-semibold text-white shadow-none hover:bg-emerald-600"
            :disabled="submitting"
            @click="handleValidate"
          >
            <BadgeCheck class="h-4 w-4" />
            {{ submitting ? "验证中..." : "验证卡密" }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
