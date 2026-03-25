<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { BadgeCheck, CreditCard } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

const router = useRouter();
const cardCode = ref("");
const submitting = ref(false);

const mockValidateCard = async (value: string) => {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (value.trim().toUpperCase() === "OK") {
    return { ok: true, message: "卡密验证成功" };
  }

  return { ok: false, message: "卡密无效或已被使用" };
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
    const result = await mockValidateCard(value);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.push({
      name: "CardRechargeSuccess",
      query: {
        card: value,
      },
    });
  } catch {
    toast.error("验证失败，请稍后重试");
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
