<template>
  <main class="min-h-screen bg-muted/30 px-3 py-6 sm:px-4 sm:py-10">
    <div class="mx-auto w-full max-w-3xl rounded-[var(--radius-xl)] border border-border bg-card shadow-lg">
      <header class="border-b border-border/60 px-4 py-4 sm:px-6 sm:py-5">
        <h1 class="text-xl font-semibold text-foreground sm:text-2xl">TeamPlus 配置中心</h1>
        <p class="text-xs text-muted-foreground sm:text-sm">
          选择代理、类型并完善参数，后续可直接对接真实接口。
        </p>
      </header>
      <section class="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
        <div class="space-y-3 rounded-[var(--radius-xl)] border border-border bg-background/70 px-4 py-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-foreground">代理信息</label>
            <Button variant="outline" size="sm" class="gap-2" @click="resetAgent">
              重置
            </Button>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-xs text-muted-foreground" for="agent-account">代理账号</label>
              <Input
                id="agent-account"
                v-model="agentAccount"
                placeholder="请输入代理账号"
                class="h-11 rounded-[var(--radius-xl)]"
                autocomplete="off"
              />
            </div>
            <div class="space-y-2">
              <label class="text-xs text-muted-foreground" for="agent-password">代理密码</label>
              <Input
                id="agent-password"
                v-model="agentPassword"
                placeholder="请输入代理密码"
                type="password"
                class="h-11 rounded-[var(--radius-xl)]"
                autocomplete="off"
              />
            </div>
          </div>
          <p class="text-xs text-muted-foreground">支持手动输入代理账号与密码，后续可对接接口拉取或保存。</p>
        </div>

        <div class="space-y-3 rounded-[var(--radius-xl)] border border-border bg-background/70 px-4 py-4">
          <label class="text-sm font-medium text-foreground">类型选择</label>
          <div class="grid gap-2 sm:grid-cols-3">
            <label v-for="option in typeOptions" :key="option.value" class="flex cursor-pointer items-center gap-2 rounded-[var(--radius-xl)] border border-border px-3 py-2 text-sm">
              <input
                type="radio"
                class="h-4 w-4 text-primary focus:ring-primary"
                :value="option.value"
                v-model="selectedType"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="space-y-2 rounded-[var(--radius-xl)] border border-border bg-background/70 px-4 py-4">
          <label class="text-sm font-medium text-foreground" for="teamplus-json">JSON 参数</label>
          <textarea
            id="teamplus-json"
            v-model="jsonPayload"
            class="min-h-[160px] w-full rounded-[var(--radius-xl)] border border-input bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring sm:min-h-[220px]"
            placeholder='{"example":"value"}'
          />
          <p class="text-xs text-muted-foreground">支持大段 JSON 文本，可用于调试下游接口。</p>
        </div>

        <div v-if="selectedType === 'plus-first'" class="space-y-2 rounded-[var(--radius-xl)] border border-border bg-background/70 px-4 py-4">
          <label class="text-sm font-medium text-foreground" for="teamplus-code">
            兑换码 <span class="text-destructive">*</span>
          </label>
          <Input
            id="teamplus-code"
            v-model="redeemCode"
            :placeholder="copy.codePlaceholder"
            class="h-11 rounded-[var(--radius-xl)] text-[15px]"
            autocomplete="off"
          />
          <p class="text-xs text-muted-foreground">首充 Plus 类型必须提供兑换码。</p>
        </div>

        <div class="flex flex-col gap-3">
          <Button
            class="h-11 rounded-[var(--radius-xl)] text-base font-semibold"
            :disabled="isSubmitting"
            @click="handleSubmit"
          >
            {{ isSubmitting ? "提交中..." : "提交配置" }}
          </Button>
          <div
            v-if="submitStatus"
            class="rounded-[var(--radius-xl)] border px-4 py-3 text-xs sm:text-sm"
            :class="
              submitStatus.type === 'error'
                ? 'border-destructive/40 bg-destructive/10 text-destructive'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            "
          >
            {{ submitStatus.message }}
          </div>
          <div
            v-if="checkoutUrl"
            class="space-y-2 rounded-[var(--radius-xl)] border border-border bg-muted/30 px-4 py-4 text-xs text-muted-foreground"
          >
            <div class="space-y-1">
              <span class="text-muted-foreground">支付链接</span>
              <div class="flex items-center gap-2 rounded-[var(--radius-xl)] border border-dashed border-border/70 bg-background px-3 py-2 text-foreground">
                <span class="flex-1 truncate text-xs sm:text-sm">{{ checkoutUrl }}</span>
                <Button variant="outline" size="icon" class="h-8 w-8" @click="copyCheckoutUrl">
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-vue-next";

const copy = {
  codePlaceholder: "请输入兑换码",
};

const agentAccount = ref("");
const agentPassword = ref("");
const selectedType = ref<"plus-first" | "plus-renew" | "grok">("plus-first");
const jsonPayload = ref("");
const redeemCode = ref("");
const isSubmitting = ref(false);
const submitStatus = ref<{ type: "success" | "error"; message: string } | null>(null);
const checkoutSessionId = ref("");
const checkoutUrl = ref("");

const typeOptions = [
  { value: "plus-first", label: "首充 Plus" },
  { value: "plus-renew", label: "续费 Plus" },
  { value: "grok", label: "Grok 会员" },
] as const;

const resetAgent = () => {
  agentAccount.value = "";
  agentPassword.value = "";
};

onMounted(() => {
  resetAgent();
});

const handleSubmit = () => {
  if (!agentAccount.value.trim() || !agentPassword.value.trim()) {
    alert("请输入代理账号和密码");
    return;
  }
  if (selectedType.value === "plus-first" && !redeemCode.value.trim()) {
    alert("首充 Plus 类型需填写兑换码");
    return;
  }
  if (!jsonPayload.value.trim()) {
    alert("请输入 JSON 或 Token 文本");
    return;
  }

  if (selectedType.value === "grok") {
    submitStatus.value = {
      type: "error",
      message: "Grok 会员接口尚未接入。",
    };
    return;
  }

  let parsedPayload: Record<string, any> | null = null;
  let tokenValue = "";
  try {
    parsedPayload = JSON.parse(jsonPayload.value);
    tokenValue =
      parsedPayload.accessToken ??
      parsedPayload.token ??
      parsedPayload.Token ??
      parsedPayload.user?.accessToken ??
      "";
  } catch {
    tokenValue = jsonPayload.value.trim();
  }

  const payload: Record<string, any> = parsedPayload ? { ...parsedPayload } : {};
  payload.token = tokenValue;
  payload.zhanghao = agentAccount.value.trim();
  payload.mima = agentPassword.value.trim();
  payload.codekey =
    selectedType.value === "plus-first" ? redeemCode.value.trim() : payload.codekey ?? "";

  if (!payload.token) {
    alert("无法识别 accessToken，请检查输入内容");
    return;
  }

  isSubmitting.value = true;
  submitStatus.value = null;
  const targetUrl =
    selectedType.value === "plus-first"
      ? "https://pyapi.my91.my/PaymentCheckout"
      : "https://pyapi.my91.my/PaymentCheckoutPlus";

  fetch(targetUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.ok === false) {
        const detailMessage = data?.detail || data?.msg || "获取支付链接失败";
        throw new Error(detailMessage);
      }
      const apiResponse = data?.response ?? {};
      const statusFlag = data?.status ?? (data?.ok ? "success" : "failed");
      if (!apiResponse?.checkout_session_id || statusFlag !== "success") {
        const detailMessage = data?.detail || data?.msg || "获取支付链接失败";
        throw new Error(detailMessage);
      }
      checkoutSessionId.value = apiResponse?.checkout_session_id ?? "";
      checkoutUrl.value = checkoutSessionId.value
        ? `https://checkout.stripe.com/c/pay/${checkoutSessionId.value}${STRIPE_URL_SUFFIX}`
        : "";
      submitStatus.value = {
        type: "success",
        message: "获取支付链接成功",
      };
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : "请求异常，请稍后再试";
      const display = `获取支付链接失败：${message}`;
      submitStatus.value = { type: "error", message: display };
      alert(display);
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

const copyCheckoutUrl = async () => {
  if (!checkoutUrl.value) return;
  try {
    await navigator.clipboard.writeText(checkoutUrl.value);
    submitStatus.value = { type: "success", message: "已复制链接，可在新标签页打开" };
  } catch (error) {
    submitStatus.value = { type: "error", message: "复制失败，请手动复制链接" };
  }
};

const STRIPE_URL_SUFFIX =
  "#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdpamZkaWAnPyd%2FbScpJ3ZwZ3Zmd2x1cWxqa1BrbHRwYGtgdnZAa2RnaWBhJz9jZGl2YCknZHVsTmB8Jz8ndW5aaWxzYFowNE1Kd1ZyRjNtNGt9QmpMNmlRRGJXb1xTd38xYVA2Y1NKZGd8RmZOVzZ1Z0BPYnBGU0RpdEZ9YX1GUHNqV200XVJyV2RmU2xqc1A2bklOc3Vub20yTHRuUjU1bF1Udm9qNmsnKSdjd2poVmB3c2B3Jz9xd3BgKSdnZGZuYndqcGthRmppancnPycmY2NjY2NjJyknaWR8anBxUXx1YCc%2FJ3Zsa2JpYFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl";
</script>
