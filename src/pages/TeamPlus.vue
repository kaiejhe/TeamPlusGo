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

        <div class="rounded-[var(--radius-xl)] border border-dashed border-border/70 bg-muted/20 px-4 py-4 text-xs text-muted-foreground space-y-2">
          <p>表单仅作示例。确认布局后可在此补充接口联调。</p>
          <p>填写完毕后可直接点击下方按钮提交，后续可接入真实 API。</p>
        </div>

        <div class="flex flex-col gap-3">
          <Button
            class="h-11 rounded-[var(--radius-xl)] text-base font-semibold"
            :disabled="isSubmitting"
            @click="handleSubmit"
          >
            {{ isSubmitting ? "提交中..." : "提交配置" }}
          </Button>
          <p class="text-center text-xs text-muted-foreground">
            如需联调接口，可在提交处理函数内串接真实 API。
          </p>
          <p v-if="submitResult" class="rounded-[var(--radius-xl)] border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            {{ submitResult }}
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-vue-next";

const copy = {
  codePlaceholder: "请输入兑换码",
};

const agentAccount = ref("");
const agentPassword = ref("");
const selectedType = ref<"plus-first" | "plus-renew" | "grok">("plus-first");
const jsonPayload = ref("");
const redeemCode = ref("");
const isSubmitting = ref(false);
const submitResult = ref<string | null>(null);

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
  submitResult.value = null;
  fetch("http://pyapi.my91.my/PaymentCheckoutPlus", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.ok === false) {
        throw new Error(data?.msg || "请求失败，请稍后再试");
      }
      submitResult.value = data?.msg || "提交成功，等待处理";
    })
    .catch((error) => {
      submitResult.value = error instanceof Error ? error.message : "请求异常，请稍后再试";
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};
</script>
