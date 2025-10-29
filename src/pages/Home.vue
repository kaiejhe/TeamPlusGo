<template>
  <main class="min-h-[100dvh] bg-muted/40 px-4 py-10">
    <div class="mx-auto w-full max-w-4xl space-y-6">
      <header class="space-y-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight text-foreground">兑换码业务 · 前端 UI</h1>
        <p class="text-sm text-muted-foreground">兑换码为 19 位：xxxx-xxxx-xxxx-xxxx</p>
      </header>

      <Card class="border border-border/70 bg-card shadow-sm">
        <CardContent class="p-0">
          <div class="border-b border-border/60 bg-muted/30 px-4 py-3">
            <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              <button
                v-for="item in tabs"
                :key="item.value"
                type="button"
                class="rounded-md px-3 py-2 text-sm font-medium transition"
                :class="
                  item.value === activeTab
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-background text-muted-foreground hover:bg-muted/50'
                "
                @click="activeTab = item.value"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="space-y-8 px-6 py-6">
            <section v-if="activeTab === 'B1'" class="space-y-6">
              <header class="space-y-1">
                <h2 class="text-lg font-semibold text-foreground">Business(Team) 绑定邮箱自动发送进团邀请</h2>
                <p class="text-sm text-muted-foreground">输入兑换码与邮箱，确认后系统会尝试发送团队邀请。</p>
              </header>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-muted-foreground" for="b1-code">Team 兑换码</label>
                  <Input
                    id="b1-code"
                    v-model="bizOne.code"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    autocomplete="off"
                    maxlength="19"
                  />
                  <p class="text-xs" :class="bizOneCodeValid ? 'text-emerald-600' : 'text-muted-foreground'">
                    规范化：{{ bizOneNormalized || '（等待输入）' }}
                  </p>
                  <p v-if="bizOneNormalized && !bizOneCodeValid" class="text-xs text-destructive">
                    格式应为 4-4-4-4（仅大写字母/数字）
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-muted-foreground" for="b1-email">接收邮箱</label>
                  <Input
                    id="b1-email"
                    v-model="bizOne.email"
                    type="email"
                    placeholder="you@example.com"
                    autocomplete="off"
                  />
                  <p v-if="bizOne.email && !bizOneEmailValid" class="text-xs text-destructive">邮箱格式不正确</p>
                </div>
              </div>

              <Button
                class="w-full md:w-auto"
                :disabled="!bizOneCodeValid || !bizOneEmailValid || bizOne.submitting"
                @click="submitBizOne"
              >
                {{ bizOne.submitting ? '提交中…' : '确认兑换' }}
              </Button>

              <div
                v-if="bizOne.response && bizOne.response.ok"
                class="space-y-4 rounded-xl border border-border/70 bg-background/90 p-4 text-sm shadow-sm"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <Badge v-if="bizOneUsageStatus" :variant="usageStatusMeta[bizOneUsageStatus].badgeVariant">
                    {{ usageStatusMeta[bizOneUsageStatus].label }}
                  </Badge>
                  <Badge v-if="bizOneOrderStatus" :variant="bizOneOrderStatus.variant">
                    邀请状态 · {{ bizOneOrderStatus.label }}
                  </Badge>
                </div>

                <div v-if="bizOneSummaryItems.length" class="space-y-3">
                  <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CreditCard class="h-4 w-4" />
                    <span>卡密详情</span>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                      v-for="item in bizOneSummaryItems"
                      :key="item.key"
                      class="rounded-lg border border-border/60 bg-muted/30 p-3"
                    >
                      <p class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {{ item.label }}
                      </p>
                      <div class="mt-1 flex items-center gap-2">
                        <span class="font-semibold text-foreground">{{ item.value }}</span>
                        <Button
                          v-if="item.copyValue"
                          type="button"
                          variant="ghost"
                          size="icon"
                          class="h-7 w-7"
                          @click="copyText(item.copyValue)"
                        >
                          <Copy class="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section v-else-if="activeTab === 'B2'" class="space-y-6">
              <header class="space-y-1">
                <h2 class="text-lg font-semibold text-foreground">Plus 24 小时自助兑换</h2>
                <p class="text-sm text-muted-foreground">输入兑换码即可领取账号信息，示例返回固定数据。</p>
              </header>

              <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground" for="b2-code">Plus 兑换码</label>
                <Input
                  id="b2-code"
                  v-model="bizTwo.code"
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  autocomplete="off"
                  maxlength="19"
                />
                <p class="text-xs" :class="bizTwoValid ? 'text-emerald-600' : 'text-muted-foreground'">
                  规范化：{{ bizTwoNormalized || '（等待输入）' }}
                </p>
                <p v-if="bizTwoNormalized && !bizTwoValid" class="text-xs text-destructive">
                  格式应为 4-4-4-4（仅大写字母/数字）
                </p>
                <Button class="w-full md:w-auto" :disabled="!bizTwoValid || bizTwo.submitting" @click="submitBizTwo">
                  {{ bizTwo.submitting ? '处理中…' : '领取账号（演示 UI）' }}
                </Button>
              </div>

              <div v-if="bizTwo.response" class="space-y-2 rounded-lg border border-border/70 bg-muted/40 p-4 text-sm">
                <p>邮箱：{{ bizTwo.response.login_email }}</p>
                <p>登录地址：{{ bizTwo.response.login_url }}</p>
                <p>密码：******</p>
                <p>邮箱密钥：****-****</p>
              </div>
            </section>

            <section v-else-if="activeTab === 'B3'" class="space-y-6">
              <header class="space-y-1">
                <h2 class="text-lg font-semibold text-foreground">Plus 24 小时自助代充</h2>
                <p class="text-sm text-muted-foreground">提交兑换码与 JSON 数据创建订单，稍后可查询处理结果。</p>
              </header>

              <ol class="list-decimal space-y-1 pl-6 text-sm text-muted-foreground">
                <li>准备 JSON 数据</li>
                <li>输入兑换码并提交</li>
                <li>等待处理完成，可在“查询”页查看历史</li>
              </ol>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-muted-foreground" for="b3-code">Plus 代充兑换码</label>
                  <Input
                    id="b3-code"
                    v-model="bizThree.code"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    autocomplete="off"
                    maxlength="19"
                  />
                  <p class="text-xs" :class="bizThreeCodeValid ? 'text-emerald-600' : 'text-muted-foreground'">
                    规范化：{{ bizThreeNormalized || '（等待输入）' }}
                  </p>
                  <p v-if="bizThreeNormalized && !bizThreeCodeValid" class="text-xs text-destructive">
                    格式应为 4-4-4-4（仅大写字母/数字）
                  </p>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm font-medium text-muted-foreground" for="b3-json">JSON 数据</label>
                  <textarea
                    id="b3-json"
                    v-model="bizThree.jsonText"
                    rows="8"
                    class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  ></textarea>
                  <p class="text-xs" :class="bizThreeJsonValid ? 'text-emerald-600' : 'text-destructive'">
                    {{ bizThreeJsonValid ? 'JSON 校验通过' : 'JSON 格式错误' }}
                  </p>
                </div>
              </div>

              <Button
                class="w-full md:w-auto"
                :disabled="!bizThreeCodeValid || !bizThreeJsonValid || bizThree.creating"
                @click="submitBizThree"
              >
                {{ bizThree.creating ? '正在创建订单…' : '提交并创建订单（演示 UI）' }}
              </Button>

              <div v-if="bizThree.orderId" class="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">订单号 #{{ bizThree.orderId }}</Badge>
                <Badge>{{ bizThree.status }}</Badge>
              </div>
            </section>

            <section v-else-if="activeTab === 'B4'" class="space-y-6">
              <header class="space-y-1">
                <h2 class="text-lg font-semibold text-foreground">输入兑换码查询订单状态信息</h2>
                <p class="text-sm text-muted-foreground">演示接口返回聚合信息，真实环境可替换为实际 API。</p>
              </header>

              <div class="space-y-2">
                <label class="text-sm font-medium text-muted-foreground" for="b4-code">兑换码查询订单</label>
                <Input
                  id="b4-code"
                  v-model="bizFour.code"
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  autocomplete="off"
                  maxlength="19"
                />
                <p class="text-xs" :class="bizFourValid ? 'text-emerald-600' : 'text-muted-foreground'">
                  规范化：{{ bizFourNormalized || '（等待输入）' }}
                </p>
                <p v-if="bizFourNormalized && !bizFourValid" class="text-xs text-destructive">
                  格式应为 4-4-4-4（仅大写字母/数字）
                </p>
                <Button class="w-full md:w-auto" :disabled="!bizFourValid || bizFour.loading" @click="submitBizFour">
                  {{ bizFour.loading ? '查询中…' : '查询' }}
                </Button>
              </div>

              <div
                v-if="bizFour.result && bizFour.result.ok"
                class="space-y-4 rounded-xl border border-border/70 bg-background/90 p-4 text-sm shadow-sm"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <Badge :variant="usageStatusMeta[bizFour.result.status].badgeVariant">
                    {{ usageStatusMeta[bizFour.result.status].label }}
                  </Badge>
                  <Badge v-if="bizFour.result.orderStatus" :variant="bizFour.result.orderStatus.variant">
                    邀请状态 · {{ bizFour.result.orderStatus.label }}
                  </Badge>
                </div>

                <div v-if="bizFourSummaryItems.length" class="space-y-3">
                  <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CreditCard class="h-4 w-4" />
                    <span>卡密详情</span>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                      v-for="item in bizFourSummaryItems"
                      :key="item.key"
                      class="rounded-lg border border-border/60 bg-muted/30 p-3"
                    >
                      <p class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {{ item.label }}
                      </p>
                      <div class="mt-1 flex items-center gap-2">
                        <span class="font-semibold text-foreground">{{ item.value }}</span>
                        <Button
                          v-if="item.copyValue"
                          type="button"
                          variant="ghost"
                          size="icon"
                          class="h-7 w-7"
                          @click="copyText(item.copyValue)"
                        >
                          <Copy class="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </section>
          </div>
        </CardContent>
      </Card>

      <footer class="text-center text-[11px] text-muted-foreground">
        构建版本：{{ buildMeta.commit }}<span v-if="buildMeta.formattedTime"> · {{ buildMeta.formattedTime }}</span>
      </footer>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { CreditCard, Copy } from "lucide-vue-next";
import { Card as requestCard } from "@/apijs/uts";

const tabs = [
  { value: "B1", label: "Business 进团" },
  { value: "B2", label: "Plus 自助领取" },
  { value: "B3", label: "Plus 自助代充" },
  { value: "B4", label: "兑换码查询" },
];

const activeTab = ref("B1");

const normalizeCode = (raw: string) => {
  const cleaned = raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 16);
  const parts: string[] = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    parts.push(cleaned.slice(i, i + 4));
  }
  return parts.filter(Boolean).join("-");
};

const isValidCode = (code: string) => /^[A-Z0-9]{4}(?:-[A-Z0-9]{4}){3}$/.test(code);

const safeJsonParse = (source: string):
  | { ok: true; value: unknown }
  | { ok: false; error: Error } => {
  try {
    return { ok: true as const, value: JSON.parse(source) };
  } catch (error) {
    return { ok: false as const, error: error as Error };
  }
};

type CardInfo = {
  TeamCard?: string;
  TeamCardState?: string;
  AfterSales?: number;
  AddTime?: number;
  UpdTime?: number | null;
  TeamType?: string;
  [key: string]: unknown;
};

type OrderInfo = {
  OrderTeamID?: string;
  Order_us_Email?: string;
  AfterSales?: number;
  TeamOrderState?: string;
  TeamCard?: string;
  AddTime?: number;
  UpdTime?: number | null;
  Content?: string;
  [key: string]: unknown;
};

type UsageStatus = "unused" | "used" | "locked";

type OrderStatusMeta = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

type BizOneResponse = {
  ok: boolean;
  message: string;
  card: CardInfo | null;
  order: OrderInfo | null;
};

type BizFourResult = {
  ok: boolean;
  message: string;
  card: CardInfo | null;
  order: OrderInfo | null;
  status: UsageStatus;
  orderStatus: OrderStatusMeta | null;
};

type SummaryItem = {
  key: string;
  label: string;
  value: string;
  copyValue?: string | null;
};

const usageStatusMeta: Record<UsageStatus, { label: string; badgeVariant: "default" | "secondary" | "destructive" }> = {
  unused: { label: "未使用", badgeVariant: "secondary" },
  used: { label: "已使用", badgeVariant: "default" },
  locked: { label: "已锁定", badgeVariant: "destructive" },
};

const ORDER_STATUS_META: Record<string, OrderStatusMeta> = {
  o1: { label: "待发送邀请", variant: "secondary" },
  o2: { label: "已发送邀请", variant: "default" },
  o3: { label: "发送失败", variant: "destructive" },
};

const CARD_STATE_LABELS: Record<string, string> = {
  o1: "未使用",
  o2: "已使用",
  o3: "已锁定",
};

const deriveUsageStatus = (card: CardInfo | null, order: OrderInfo | null): UsageStatus => {
  const code = String(order?.TeamOrderState ?? card?.TeamCardState ?? "").toLowerCase();

  if (["lock", "locked", "o3", "freeze", "suspend"].includes(code)) {
    return "locked";
  }

  if (order) {
    return "used";
  }

  return "unused";
};

const resolveOrderStatus = (order: OrderInfo | null): OrderStatusMeta | null => {
  if (!order?.TeamOrderState) {
    return null;
  }
  const key = order.TeamOrderState.toLowerCase();
  return ORDER_STATUS_META[key] ?? { label: order.TeamOrderState, variant: "outline" };
};

const normalizeEntities = (data: unknown): { card: CardInfo | null; order: OrderInfo | null } => {
  if (!data || typeof data !== "object") {
    return { card: null, order: null };
  }
  const record = data as Record<string, unknown>;
  const card = (record.Card ?? record.card ?? null) as CardInfo | null;
  const order = (record.Order ?? record.order ?? null) as OrderInfo | null;
  return { card, order };
};

const formatTimestamp = (value: unknown) => {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return "—";
  }
  const timestamp = value > 1e12 ? value : value * 1000;
  return new Date(timestamp).toLocaleString("zh-CN", { hour12: false });
};

const formatCardStateLabel = (card: CardInfo | null, order: OrderInfo | null) => {
  const raw = String(
    order?.TeamCardState ?? card?.TeamCardState ?? order?.TeamOrderState ?? "",
  ).trim();

  if (raw) {
    const normalized = raw.toLowerCase();
    if (CARD_STATE_LABELS[normalized]) {
      return CARD_STATE_LABELS[normalized];
    }
  }

  const usage = deriveUsageStatus(card, order);
  return usageStatusMeta[usage].label;
};

const formatInviteStatusLabel = (order: OrderInfo | null) => {
  if (!order?.TeamOrderState) {
    return "—";
  }
  const key = order.TeamOrderState.toLowerCase();
  const meta = ORDER_STATUS_META[key];
  return meta ? meta.label : order.TeamOrderState;
};

const maskIdentifier = (value: string) => {
  if (!value) {
    return "—";
  }

  const compact = value.replace(/\s+/g, "");
  if (compact.length <= 12) {
    return value;
  }

  const start = compact.slice(0, 4);
  const end = compact.slice(-4);
  return `${start}········${end}`;
};

const formatTeamId = (order: OrderInfo | null): { display: string; raw: string | null } => {
  const raw = (order?.OrderTeamID ?? "").toString().trim();
  if (!raw) {
    return { display: "—", raw: null };
  }
  return { display: maskIdentifier(raw), raw };
};

const formatCardType = (card: CardInfo | null, order: OrderInfo | null) => {
  const raw = (card?.TeamType ?? order?.TeamType ?? "").toString().trim();
  return raw || "—";
};

const buildSummaryItems = (order: OrderInfo | null, card: CardInfo | null): SummaryItem[] => {
  const teamId = formatTeamId(order);

  return [
    { key: "status", label: "卡密状态", value: formatCardStateLabel(card, order) },
    { key: "type", label: "卡密类型", value: formatCardType(card, order) },
    { key: "teamId", label: "团队编号", value: teamId.display, copyValue: teamId.raw },
    { key: "email", label: "绑定邮箱", value: order?.Order_us_Email ?? "—" },
    { key: "invite", label: "邀请状态", value: formatInviteStatusLabel(order) },
    { key: "createdAt", label: "创建时间", value: formatTimestamp(order?.AddTime ?? card?.AddTime) },
  ];
};

const copyText = async (value: string | null | undefined) => {
  if (!value || typeof navigator === "undefined" || !navigator.clipboard) {
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    toast.success("已复制到剪贴板");
  } catch (error) {
    console.error(error);
    toast.error("复制失败，请手动复制");
  }
};

const bizOne = reactive({
  code: "",
  email: "",
  submitting: false,
  response: null as BizOneResponse | null,
});

const bizOneNormalized = computed(() => normalizeCode(bizOne.code));
const bizOneCodeValid = computed(() => isValidCode(bizOneNormalized.value));
const bizOneEmailValid = computed(() => /.+@.+\..+/.test(bizOne.email.trim()));

const bizOneSummaryItems = computed<SummaryItem[]>(() => {
  if (!bizOne.response || !bizOne.response.ok) {
    return [];
  }
  return buildSummaryItems(bizOne.response.order, bizOne.response.card);
});

const bizOneUsageStatus = computed<UsageStatus | null>(() => {
  if (!bizOne.response || !bizOne.response.ok) {
    return null;
  }
  return deriveUsageStatus(bizOne.response.card, bizOne.response.order);
});

const bizOneOrderStatus = computed(() => {
  if (!bizOne.response || !bizOne.response.ok) {
    return null;
  }
  return resolveOrderStatus(bizOne.response.order);
});

const submitBizOne = async () => {
  if (!bizOneCodeValid.value || !bizOneEmailValid.value || bizOne.submitting) {
    return;
  }

  bizOne.code = bizOneNormalized.value;
  bizOne.submitting = true;
  bizOne.response = null;

  try {
    const response = await requestCard({
      msgoogle: "TeamEmail",
      data: {
        Card: bizOneNormalized.value,
        Email: bizOne.email.trim(),
      },
    });

    const ok = response?.ok === true;
    const message = typeof response?.msg === "string" && response.msg.trim()
      ? response.msg
      : ok
        ? "订单创建成功"
        : "订单创建失败";
    let { card, order } = normalizeEntities(response?.data ?? null);

    if (ok) {
      try {
        const followUp = await requestCard({
          msgoogle: "GetTeamApi",
          data: {
            Card: bizOneNormalized.value,
            Email: bizOne.email.trim(),
          },
        });
        if (followUp?.ok === true) {
          const normalized = normalizeEntities(followUp?.data ?? null);
          card = normalized.card ?? card;
          order = normalized.order ?? order;
        }
      } catch (error) {
        console.error("GetTeamApi follow-up failed", error);
      }
    }

    bizOne.response = { ok, message, card, order };

    if (ok) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "请求失败，请稍后再试。";
    bizOne.response = { ok: false, message, card: null, order: null };
    toast.error(message);
  } finally {
    bizOne.submitting = false;
  }
};

const bizTwo = reactive({
  code: "",
  submitting: false,
  response: null as null | { login_email: string; login_url: string },
});

const bizTwoNormalized = computed(() => normalizeCode(bizTwo.code));
const bizTwoValid = computed(() => isValidCode(bizTwoNormalized.value));

const submitBizTwo = () => {
  if (!bizTwoValid.value || bizTwo.submitting) {
    return;
  }
  bizTwo.submitting = true;
  bizTwo.response = null;
  window.setTimeout(() => {
    bizTwo.submitting = false;
    bizTwo.response = {
      login_email: "user@example.com",
      login_url: "https://mail.example.com",
    };
  }, 400);
};

const bizThree = reactive({
  code: "",
  jsonText: '{\n  "example": true\n}',
  creating: false,
  orderId: "" as string,
  status: "" as string,
});

const bizThreeNormalized = computed(() => normalizeCode(bizThree.code));
const bizThreeCodeValid = computed(() => isValidCode(bizThreeNormalized.value));
const bizThreeParsed = computed(() => safeJsonParse(bizThree.jsonText));
const bizThreeJsonValid = computed(() => bizThreeParsed.value.ok);

const submitBizThree = () => {
  if (!bizThreeCodeValid.value || !bizThreeJsonValid.value || bizThree.creating) {
    return;
  }
  bizThree.creating = true;
  bizThree.orderId = "";
  bizThree.status = "";
  window.setTimeout(() => {
    bizThree.creating = false;
    bizThree.orderId = "ORD_DEMO_" + Math.floor(Math.random() * 900 + 100);
    bizThree.status = "PENDING";
    window.setTimeout(() => {
      bizThree.status = "SUCCESS";
    }, 1500);
  }, 500);
};

const bizFour = reactive({
  code: "",
  loading: false,
  result: null as BizFourResult | null,
  error: null as string | null,
});

const bizFourNormalized = computed(() => normalizeCode(bizFour.code));
const bizFourValid = computed(() => isValidCode(bizFourNormalized.value));

const bizFourSummaryItems = computed<SummaryItem[]>(() => {
  if (!bizFour.result || !bizFour.result.ok) {
    return [];
  }
  return buildSummaryItems(bizFour.result.order, bizFour.result.card);
});

const buildMeta = computed(() => {
  const commit = __APP_COMMIT_HASH__ || "unknown";
  const rawTime = __APP_BUILD_TIME__ || "";
  let formattedTime = "";

  if (rawTime) {
    const parsed = new Date(rawTime);
    formattedTime = Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleString();
  }

  return { commit, formattedTime };
});

const submitBizFour = async () => {
  if (!bizFourValid.value || bizFour.loading) {
    return;
  }

  bizFour.code = bizFourNormalized.value;
  bizFour.loading = true;
  bizFour.result = null;
  bizFour.error = null;

  try {
    const response = await requestCard({
      msgoogle: "TeamCard",
      data: { Card: bizFourNormalized.value },
    });

    const ok = response?.ok === true;
    const message = typeof response?.msg === "string" && response.msg.trim()
      ? response.msg
      : ok
        ? "卡密验证成功"
        : "卡密验证失败";

    const { card, order } = normalizeEntities(response?.data ?? null);
    const status = deriveUsageStatus(card, order);
    const orderStatus = resolveOrderStatus(order);

    bizFour.result = { ok, message, card, order, status, orderStatus };

    if (ok) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "查询失败，请稍后再试。";
    bizFour.error = message;
    toast.error(message);
  } finally {
    bizFour.loading = false;
  }
};

const runDevTests = () => {
  const assert = (condition: boolean, message: string) => {
    if (!condition) {
      throw new Error(`[ui-tests] ${message}`);
    }
  };

  const r1 = normalizeCode("ab cd-12_34");
  assert(r1 === "ABCD-1234", "normalizeCode 去除符号并大写");

  const r2 = normalizeCode("1234567890abcdefXYZ");
  assert(r2 === "1234-5678-90AB-CDEF", "normalizeCode 截断并分组");

  const r3 = normalizeCode("abcdEFGHijklMNOP");
  assert(r3 === "ABCD-EFGH-IJKL-MNOP", "normalizeCode 满 16 位格式");

  assert(isValidCode("ABCD-1234-EF56-7890"), "isValidCode 接受合法格式");
  assert(!isValidCode("ABCD-1234-EF56-789"), "isValidCode 长度错误");
  assert(!isValidCode("abcd-1234-ef56-7890"), "isValidCode 小写不通过");
  assert(!isValidCode("ABCD-1234-EF5#-7890"), "isValidCode 特殊字符");

  const parsedOk = safeJsonParse('{"foo":1}');
  assert(parsedOk.ok && (parsedOk.value as any).foo === 1, "safeJsonParse 正常解析");

  const parsedFail = safeJsonParse("{ bad }");
  assert(!parsedFail.ok, "safeJsonParse 捕获错误");
};

if (import.meta.env.DEV && typeof window !== "undefined") {
  try {
    runDevTests();
  } catch (error) {
    console.error(error);
  }
}
</script>
