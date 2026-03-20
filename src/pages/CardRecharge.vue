<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const router = useRouter();
const cardCode = ref("");
const submitting = ref(false);

const mockValidateCard = async (value: string) => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const normalized = value.trim().toUpperCase();
  const isSuccess =
    normalized.includes("OK") ||
    normalized.includes("SUCCESS") ||
    normalized.endsWith("8888");

  if (isSuccess) {
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
  <main
    class="min-h-screen bg-[radial-gradient(circle_at_top,#e7f0fa_0%,#dbe7f4_42%,#d2deee_100%)] px-4 py-6 sm:px-6 sm:py-10"
  >
    <div
      class="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100vh-5rem)]"
    >
      <section
        class="w-full max-w-[500px] rounded-[28px] border border-white/70 bg-white/95 px-7 py-8 shadow-[0_24px_60px_rgba(111,137,170,0.18)] backdrop-blur sm:px-10 sm:py-10"
      >
        <div class="space-y-8 sm:space-y-9">
          <header class="space-y-3 text-center">
            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
              Self-Service
            </p>
            <h1
              class="text-[clamp(2rem,4vw,3rem)] font-black leading-[0.95] tracking-[-0.05em] text-slate-950"
            >
              卡密自助充值
            </h1>
          </header>

          <div class="space-y-3">
            <label
              for="card-code"
              class="block text-[1.06rem] font-medium leading-none text-slate-700 sm:text-[1.16rem]"
            >
              请输入充值卡密
            </label>
            <Input
              id="card-code"
              v-model="cardCode"
              placeholder="请输入充值卡密"
              class="h-[58px] rounded-[16px] border-2 border-slate-300 bg-white px-5 text-[1rem] text-slate-950 shadow-none placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-[62px] sm:px-6 sm:text-[1.05rem]"
              autocomplete="off"
              @keyup.enter="handleValidate"
            />
            <p class="text-sm leading-6 text-slate-500">
              当前为模拟验证：输入包含 <span class="font-semibold text-slate-700">OK</span>、
              <span class="font-semibold text-slate-700">SUCCESS</span> 或以
              <span class="font-semibold text-slate-700">8888</span> 结尾视为成功。
            </p>
          </div>

          <Button
            class="h-[58px] w-full rounded-[16px] bg-emerald-400 text-[1.08rem] font-bold tracking-[0.01em] text-white shadow-none hover:bg-emerald-500 sm:h-[62px] sm:text-[1.14rem]"
            :disabled="submitting"
            @click="handleValidate"
          >
            {{ submitting ? "验证中..." : "验证卡密" }}
          </Button>
        </div>
      </section>
    </div>
  </main>
</template>
