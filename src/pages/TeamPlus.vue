<template>
  <main class="min-h-screen bg-muted/30 px-3 py-6 sm:px-4 sm:py-10">
    <div class="mx-auto w-full max-w-4xl rounded-[var(--radius-xl)] border border-border bg-card shadow-lg">
      <!-- 顶部 -->
      <header class="flex flex-col gap-3 border-b border-border/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
            <Settings2 class="h-3.5 w-3.5" />
            <span>Plus Code · 兑换配置台</span>
          </div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">兑换配置台</h1>
            <Badge variant="outline" class="text-[11px] uppercase tracking-wide">Beta</Badge>
          </div>
          <p class="max-w-2xl text-xs text-muted-foreground sm:text-sm">
            使用 shadcn/ui 快速完成类型选择、代理填写、参数输入和兑换码提交（仅 Plus 首充）。
          </p>
        </div>
      </header>

      <section class="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
        <!-- 基础配置 -->
        <div class="space-y-4 rounded-[var(--radius-xl)] border border-dashed border-border bg-background/70 px-4 py-4">
          <div class="space-y-1">
            <h2 class="text-sm font-semibold text-foreground">基础配置</h2>
            <p class="text-xs text-muted-foreground">先选择业务类型，再选择对应代理。仅「Plus首充」时需要填写兑换码。</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label class="text-xs">类型</Label>
              <select
                v-model="selectedType"
                class="h-10 w-full rounded-[var(--radius-xl)] border border-input bg-background px-3 pr-10 text-sm"
              >
                <option
                  v-for="option in typeOptions"
                  :key="option.value"
                  :value="option.value"
                  :disabled="option.disabled"
                >
                  {{ option.label }}（{{ option.desc }}）
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <Label class="text-xs">当前代理</Label>
              <div class="flex items-center gap-2">
                <select
                  v-model="currentAgentId"
                  class="h-10 w-full rounded-[var(--radius-xl)] border border-input bg-background px-3 pr-10 text-sm"
                  @change="handleSelectAgent(($event.target as HTMLSelectElement)?.value)"
                >
                  <option v-for="agent in agents" :key="agent.id" :value="agent.id">
                    {{ agent.name }}
                  </option>
                  <option value="add">+ 添加新代理</option>
                </select>
                <Button variant="outline" size="sm" class="h-10 px-3 gap-1" @click="handleCheckAgent">
                  <RefreshCw class="h-4 w-4" />
                  检测代理
                </Button>
              </div>
              <div class="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>当前：{{ currentAgent ? currentAgent.name : "未选择" }}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
                  :disabled="!currentAgent"
                  @click="handleDeleteCurrentAgent"
                >
                  <Trash2 class="mr-1 h-3.5 w-3.5" />
                  删除当前代理
                </Button>
              </div>
            </div>
          </div>

          <div v-if="selectedType === 'plus-first'" class="space-y-2">
            <Label class="text-xs">兑换码（仅 Plus 首充）</Label>
            <Input
              v-model="redeemCode"
              :placeholder="copy.codePlaceholder"
              class="h-11 rounded-[var(--radius-xl)]"
              autocomplete="off"
            />
          </div>
        </div>

        <!-- 兑换参数 -->
        <div class="space-y-4 rounded-[var(--radius-xl)] border border-border bg-muted/40 px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-sm font-semibold text-foreground">兑换参数</h2>
              <p class="text-xs text-muted-foreground">输入任意文本参数，格式不限制。不需要是 JSON。</p>
            </div>
            <Button variant="ghost" size="sm" class="gap-1 text-destructive" @click="handleResetPayload">
              <Trash2 class="h-4 w-4" />
              清空
            </Button>
          </div>

          <div class="rounded-md border border-border/70 bg-background/80">
            <Textarea
              v-model="jsonPayload"
              class="min-h-[220px] resize-none border-0 bg-transparent font-mono text-xs leading-relaxed focus-visible:ring-0"
              spellcheck="false"
              placeholder='{\n  "orderId": "1234567890",\n  "items": [],\n  "amount": 99.9,\n  "currency": "CNY"\n}'
            />
          </div>

          <div class="flex flex-col gap-2 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              当前类型：{{ typeLabel }} ·
              <span class="text-muted-foreground">
                {{ selectedType === "plus-first" ? "需要兑换码后生成链接" : "该类型不需要兑换码" }}
              </span>
            </span>
            <Button
              size="sm"
              class="gap-2 rounded-[var(--radius-xl)]"
              :disabled="isSubmitting || !canSubmit"
              @click="handleSubmit"
            >
              <Link2 class="h-4 w-4" />
              {{ isSubmitting ? "处理中..." : "获取支付链接" }}
            </Button>
          </div>

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
            class="space-y-2 rounded-[var(--radius-xl)] border border-border bg-background px-4 py-4 text-xs text-muted-foreground"
          >
            <div class="space-y-1">
              <span class="text-muted-foreground">支付链接</span>
              <div
                class="flex items-center gap-2 rounded-[var(--radius-xl)] border border-dashed border-border/70 bg-muted/40 px-3 py-2 text-foreground"
              >
                <span class="flex-1 break-all text-xs sm:text-sm">{{ checkoutUrl }}</span>
                <Button variant="outline" size="icon" class="h-8 w-8" @click="copyCheckoutUrl">
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div v-if="proxyIp" class="text-[11px] text-muted-foreground">
              节点 IP：{{ proxyIp }}
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 添加代理简易弹窗 -->
    <div
      v-if="showAddAgent"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-card shadow-lg">
        <div class="border-b border-border px-4 py-3">
          <h3 class="text-base font-semibold text-foreground">添加新代理</h3>
          <p class="text-xs text-muted-foreground">按照「名称 / 账号 / 密码」规则填写，将保存在当前浏览器。</p>
        </div>
        <div class="space-y-3 px-4 py-4">
          <div class="space-y-1.5">
            <Label class="text-xs" for="agent-name">名称</Label>
            <Input
              id="agent-name"
              v-model="newAgentName"
              placeholder="例如：默认代理"
              class="h-9 text-sm"
              autocomplete="off"
            />
          </div>
          <div class="space-y-1.5">
            <Label class="text-xs" for="agent-account">账号</Label>
            <Input
              id="agent-account"
              v-model="newAgentAccount"
              placeholder="例如：merchant_main"
              class="h-9 text-sm"
              autocomplete="off"
            />
          </div>
          <div class="space-y-1.5">
            <Label class="text-xs" for="agent-password">密码</Label>
            <Input
              id="agent-password"
              v-model="newAgentPassword"
              placeholder="请输入代理密码"
              type="password"
              class="h-9 text-sm"
              autocomplete="off"
            />
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
          <Button variant="outline" size="sm" @click="cancelAddAgent">取消</Button>
          <Button
            size="sm"
            :disabled="!newAgentName || !newAgentAccount || !newAgentPassword"
            @click="handleAddAgent"
          >
            保存代理
          </Button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
/* 说明：未安装 shadcn Select/Dialog，这里改为原生 select + 自定义弹窗 */
import { Copy, Link2, Plus, RefreshCw, Settings2, Trash2 } from "lucide-vue-next";

const copy = { codePlaceholder: "请输入兑换码" };

type ProductType = "plus-first" | "plus-renew" | "pro-sub" | "grok-month" | "grok-year";

const typeOptions: { value: ProductType; label: string; desc: string; disabled?: boolean }[] = [
  { value: "plus-first", label: "Plus 首充", desc: "需填写兑换码" },
  { value: "plus-renew", label: "Plus 订阅", desc: "无需兑换码" },
  { value: "pro-sub", label: "Pro 订阅", desc: "暂未接入", disabled: true },
  { value: "grok-month", label: "Grok / 月", desc: "粘贴 sso token" },
  { value: "grok-year", label: "Grok / 年", desc: "暂未接入", disabled: true },
];

const initialAgents = [
  { id: "1", name: "印度-默认", account: "Qg5XrgNt2L90_custom_zone_IN_st__city_sid_92233882_time_5", password: "2151421" },
  { id: "2", name: "新加坡-默认", account: "Qg5XrgNt2L90_custom_zone_SG_st__city_sid_55205878_time_5", password: "2151421" },
];

const agents = ref(initialAgents.slice());
const currentAgentId = ref<string | undefined>(initialAgents[0]?.id);
const selectedType = ref<ProductType>("plus-first");
const jsonPayload = ref("");
const redeemCode = ref("");
const agentAccount = ref("");
const agentPassword = ref("");

const isSubmitting = ref(false);
const submitStatus = ref<{ type: "success" | "error"; message: string } | null>(null);
const checkoutUrl = ref("");
const proxyIp = ref("");

const showAddAgent = ref(false);
const newAgentName = ref("");
const newAgentAccount = ref("");
const newAgentPassword = ref("");

const currentAgent = computed(() => agents.value.find((a) => a.id === currentAgentId.value));

const typeLabel = computed(() => typeOptions.find((t) => t.value === selectedType.value)?.label ?? "");
const canSubmit = computed(() => {
  const basic = agentAccount.value.trim() && agentPassword.value.trim() && jsonPayload.value.trim();
  const codeOk = selectedType.value !== "plus-first" || redeemCode.value.trim();
  return Boolean(basic && codeOk);
});

const resetAgent = () => {
  agentAccount.value = currentAgent.value?.account ?? "";
  agentPassword.value = currentAgent.value?.password ?? "";
};

const handleCheckAgent = () => {
  submitStatus.value = { type: "success", message: "代理检测：请确认代理可用后再提交" };
};

const handleSelectAgent = (value: string | undefined) => {
  if (value === "add") {
    showAddAgent.value = true;
    return;
  }
  currentAgentId.value = value;
  resetAgent();
};

const handleAddAgent = () => {
  if (!newAgentName.value || !newAgentAccount.value || !newAgentPassword.value) return;
  const id = `${Date.now()}`;
  const agent = {
    id,
    name: newAgentName.value.trim(),
    account: newAgentAccount.value.trim(),
    password: newAgentPassword.value.trim(),
  };
  agents.value = [...agents.value, agent];
  currentAgentId.value = id;
  resetAgent();
  cancelAddAgent();
};

const cancelAddAgent = () => {
  newAgentName.value = "";
  newAgentAccount.value = "";
  newAgentPassword.value = "";
  showAddAgent.value = false;
};

const handleDeleteCurrentAgent = () => {
  if (!currentAgentId.value) return;
  agents.value = agents.value.filter((a) => a.id !== currentAgentId.value);
  currentAgentId.value = agents.value[0]?.id;
  resetAgent();
};

const handleResetPayload = () => {
  jsonPayload.value = "";
  redeemCode.value = "";
  submitStatus.value = null;
  checkoutUrl.value = "";
  proxyIp.value = "";
};

onMounted(() => {
  resetAgent();
});

const handleSubmit = () => {
  if (!canSubmit.value) {
    submitStatus.value = { type: "error", message: "请填写完整必填项" };
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
      parsedPayload.cookie ??
      "";
  } catch {
    tokenValue = jsonPayload.value.trim();
  }

  const payload: Record<string, any> =
    parsedPayload && selectedType.value !== "grok-month" ? { ...parsedPayload } : {};
  payload.zhanghao = agentAccount.value.trim();
  payload.mima = agentPassword.value.trim();

  if (selectedType.value === "grok-month") {
    const cookieValue = tokenValue.startsWith("sso=") ? tokenValue : `sso=${tokenValue}`;
    payload.cookie = `${cookieValue}${GROK_COOKIE_SUFFIX}`;
  } else {
    payload.token = tokenValue;
    payload.codekey =
      selectedType.value === "plus-first" ? redeemCode.value.trim() : payload.codekey ?? "";
    if (!payload.token) {
      submitStatus.value = { type: "error", message: "无法解析 accessToken / token" };
      return;
    }
  }

  isSubmitting.value = true;
  submitStatus.value = null;
  checkoutUrl.value = "";
  proxyIp.value = "";

  const targetUrl =
    selectedType.value === "plus-first"
      ? "https://pyapi.my91.my/MianfeiPlusShouChong"
      : selectedType.value === "plus-renew"
        ? "https://pyapi.my91.my/FeilvbinPlus"
        : selectedType.value === "grok-month"
          ? "https://pyapi.my91.my/SuperGrok"
          : "UNSUPPORTED";

  if (targetUrl === "UNSUPPORTED") {
    const msg =
      selectedType.value === "pro-sub" ? "Pro 订阅暂未接入接口" : "Grok 年度暂未接入接口";
    submitStatus.value = { type: "error", message: msg };
    isSubmitting.value = false;
    return;
  }

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
      if (statusFlag !== "success") {
        const detailMessage = data?.detail || data?.msg || "获取支付链接失败";
        throw new Error(detailMessage);
      }

      if (selectedType.value === "grok-month") {
        const url = apiResponse?.url ?? "";
        if (!url) throw new Error("返回结果缺少支付链接");
        checkoutUrl.value = url;
        proxyIp.value = data?.proxy_ip ?? apiResponse?.proxy_ip ?? "";
      } else {
        const sessionId =
          apiResponse?.checkout_session_id || apiResponse?.checkout_session?.id || "";
        if (!sessionId) throw new Error("返回结果缺少 Session ID");
        checkoutUrl.value = `https://checkout.stripe.com/c/pay/${sessionId}${STRIPE_URL_SUFFIX}`;
        proxyIp.value = "";
      }

      submitStatus.value = { type: "success", message: "获取支付链接成功" };
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : "请求异常，请稍后再试";
      submitStatus.value = { type: "error", message: `获取支付链接失败：${message}` };
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
  } catch {
    submitStatus.value = { type: "error", message: "复制失败，请手动复制" };
  }
};

const STRIPE_URL_SUFFIX =
  "#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdpamZkaWAnPyd%2FbScpJ3ZwZ3Zmd2x1cWxqa1BrbHRwYGtgdnZAa2RnaWBhJz9jZGl2YCknZHVsTmB8Jz8ndW5aaWxzYFowNE1Kd1ZyRjNtNGt9QmpMNmlRRGJXb1xTd38xYVA2Y1NKZGd8RmZOVzZ1Z0BPYnBGU0RpdEZ9YX1GUHNqV200XVJyV2RmU2xqc1A2bklOc3Vub20yTHRuUjU1bF1Udm9qNmsnKSdjd2poVmB3c2B3Jz9xd3BgKSdnZGZuYndqcGthRmppancnPycmY2NjY2NjJyknaWR8anBxUXx1YCc%2FJ3Zsa2JpYFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl";
const GROK_COOKIE_SUFFIX =
  ";mp_ea93da913ddb66b6372b89d97b1029ac_mixpanel=%7B%22distinct_id%22%3A%222452da14-8c66-4b51-967b-ff27d3828d9d%22%2C%22%24device_id%22%3A%22ba506636-bc84-4f40-8328-dcd2980789c0%22%2C%22%24initial_referrer%22%3A%22%24direct%22%2C%22%24initial_referring_domain%22%3A%22%24direct%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%2C%22%24user_id%22%3A%222452da14-8c66-4b51-967b-ff27d3828d9d%22%7D";
</script>
