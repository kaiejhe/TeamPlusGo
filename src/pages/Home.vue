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
                v-if="bizOne.response"
                class="space-y-4 rounded-lg border border-border/70 bg-muted/40 p-4 text-sm"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <Badge :variant="bizOne.response.ok ? 'default' : 'destructive'">
                    {{ bizOne.response.ok ? '创建成功' : '创建失败' }}
                  </Badge>
                  <span class="text-muted-foreground">{{ bizOne.response.message }}</span>
                </div>

                <div v-if="bizOneSummaryItems.length" class="grid gap-3 sm:grid-cols-2">
                  <div v-for="item in bizOneSummaryItems" :key="item.label" class="space-y-1">
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {{ item.label }}
                    </p>
                    <p class="font-medium text-foreground">{{ item.value }}</p>
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

              <div v-if="bizFour.result" class="space-y-4 rounded-lg border border-border/70 bg-muted/40 p-4 text-sm">
                <div class="flex flex-wrap items-center gap-2">
                  <Badge :variant="bizFour.result.ok ? 'default' : 'destructive'">
                    {{ bizFour.result.ok ? '验证成功' : '验证失败' }}
                  </Badge>
                  <Badge :variant="usageStatusMeta[bizFour.result.status].badgeVariant">
                    {{ usageStatusMeta[bizFour.result.status].label }}
                  </Badge>
                  <span class="text-muted-foreground">{{ bizFour.result.message }}</span>
                </div>

                <div v-if="bizFourCardItems.length" class="space-y-3">
                  <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">卡密信息</p>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <div v-for="item in bizFourCardItems" :key="item.label" class="space-y-1">
                      <p class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {{ item.label }}
                      </p>
                      <p class="font-medium text-foreground">{{ item.value }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="bizFourOrderItems.length" class="space-y-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">订单信息</p>
                    <Badge v-if="bizFour.result.orderStatus" :variant="bizFour.result.orderStatus.variant">
                      {{ bizFour.result.orderStatus.label }}
                    </Badge>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <div v-for="item in bizFourOrderItems" :key="item.label" class="space-y-1">
                      <p class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {{ item.label }}
                      </p>
                      <p class="font-medium text-foreground">{{ item.value }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <p v-else-if="bizFour.error" class="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {{ bizFour.error }}
              </p>
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

const formatAfterSales = (value: unknown) => {
  if (typeof value !== "number" || value <= 0) {
    return "—";
  }
  return `${value} 天`;
};

const buildSummaryItems = (order: OrderInfo | null, card: CardInfo | null) => {
  const items: Array<{ label: string; value: string }> = [];

  const displayCard = card?.TeamCard ?? order?.TeamCard;
  if (displayCard) {
    items.push({ label: "兑换码", value: displayCard });
  }

  if (order?.Order_us_Email) {
    items.push({ label: "绑定邮箱", value: order.Order_us_Email });
  }

  const teamId = order?.OrderTeamID ?? order?.TeamCard;
  if (teamId) {
    items.push({ label: "团队编号", value: teamId });
  }

  const afterSales = order?.AfterSales ?? card?.AfterSales;
  items.push({ label: "售后时长", value: formatAfterSales(afterSales) });

  const createdAt = order?.AddTime ?? card?.AddTime;
  if (createdAt) {
    items.push({ label: "创建时间", value: formatTimestamp(createdAt) });
  }

  const updatedAt = order?.UpdTime ?? card?.UpdTime;
  if (updatedAt) {
    items.push({ label: "更新时间", value: formatTimestamp(updatedAt) });
  }

  return items;
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

const bizOneSummaryItems = computed(() => {
  if (!bizOne.response) {
    return [] as Array<{ label: string; value: string }>;
  }
  return buildSummaryItems(bizOne.response.order, bizOne.response.card);
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
    const { card, order } = normalizeEntities(response?.data ?? null);

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

const bizFourCardItems = computed(() => {
  if (!bizFour.result) return [] as Array<{ label: string; value: string }>;
  const card = bizFour.result.card;
  const order = bizFour.result.order;
  const items: Array<{ label: string; value: string }> = [];

  if (card?.TeamCard) {
    items.push({ label: "兑换码", value: card.TeamCard });
  }

  if (card?.TeamType) {
    items.push({ label: "卡密类型", value: card.TeamType });
  }

  if (card?.TeamCardState) {
    items.push({ label: "卡密状态", value: card.TeamCardState });
  }

  if (card?.AfterSales !== undefined || order?.AfterSales !== undefined) {
    const afterSales = card?.AfterSales ?? order?.AfterSales;
    items.push({ label: "售后时长", value: formatAfterSales(afterSales) });
  }

  if (card?.AddTime) {
    items.push({ label: "创建时间", value: formatTimestamp(card.AddTime) });
  }

  if (card?.UpdTime) {
    items.push({ label: "更新时间", value: formatTimestamp(card.UpdTime) });
  }

  return items;
});

const bizFourOrderItems = computed(() => {
  if (!bizFour.result?.order) return [] as Array<{ label: string; value: string }>;
  const order = bizFour.result.order;
  const items: Array<{ label: string; value: string }> = [];

  if (order.TeamCard) {
    items.push({ label: "关联卡密", value: order.TeamCard });
  }

  if (order.Order_us_Email) {
    items.push({ label: "绑定邮箱", value: order.Order_us_Email });
  }

  if (order.OrderTeamID) {
    items.push({ label: "团队编号", value: order.OrderTeamID });
  }

  if (order.AfterSales !== undefined) {
    items.push({ label: "售后时长", value: formatAfterSales(order.AfterSales) });
  }

  if (order.AddTime) {
    items.push({ label: "创建时间", value: formatTimestamp(order.AddTime) });
  }

  if (order.UpdTime) {
    items.push({ label: "更新时间", value: formatTimestamp(order.UpdTime) });
  }

  return items;
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
