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
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                class="rounded-xl border border-border/70 bg-background/90 p-4 text-sm shadow-sm"
              >
                <div class="flex items-start gap-3">
                  <MailCheck class="mt-0.5 h-5 w-5 text-primary" />
                  <div class="space-y-1">
                    <p class="font-medium text-foreground">{{ bizOne.response.message }}</p>
                    <p class="text-xs text-muted-foreground">
                      若未在邮箱中看到邀请邮件，可稍后通过“兑换码查询”查看处理状态。
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section v-else-if="activeTab === 'B2'" class="space-y-6">
              <header class="space-y-1">
                <h2 class="text-lg font-semibold text-foreground">Plus 24 小时自助兑换</h2>
                <p class="text-sm text-muted-foreground">输入兑换码后提交，系统会返回对应的账号信息。</p>
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
                  {{ bizTwo.submitting ? '处理中…' : '领取账号' }}
                </Button>
              </div>

              <div
                v-if="bizTwo.response && bizTwo.response.ok"
                class="space-y-4 rounded-xl border border-border/70 bg-background/90 p-4 text-sm shadow-sm"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <Badge variant="default">验证成功</Badge>
                  <span class="text-xs text-muted-foreground">{{ bizTwo.response.message }}</span>
                </div>

                <div v-if="bizTwoSummaryItems.length" class="space-y-3">
                  <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <User class="h-4 w-4" />
                    <span>账号信息</span>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                      v-for="item in bizTwoSummaryItems"
                      :key="item.key"
                      class="rounded-lg border border-border/60 bg-muted/30 p-3"
                    >
                      <p class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {{ item.label }}
                      </p>
                      <div class="mt-1 flex items-start gap-2">
                        <span class="flex-1 break-all font-semibold text-foreground">{{ item.value }}</span>
                        <div v-if="item.copyValue || item.href" class="flex items-center gap-1">
                          <Button
                            v-if="item.href"
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7"
                            as-child
                          >
                            <a :href="item.href" target="_blank" rel="noopener noreferrer">
                              <ExternalLink class="h-3.5 w-3.5" />
                            </a>
                          </Button>
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
                  <Badge v-if="bizFour.result.orderStatus" :variant="bizFour.result.orderStatus.variant">
                    邀请状态 · {{ bizFour.result.orderStatus.label }}
                  </Badge>
                  <span v-if="bizFour.result.message" class="text-xs text-muted-foreground">
                    {{ bizFour.result.message }}
                  </span>
                </div>

                <div v-if="bizFourSummaryItems.length" class="space-y-3">
                  <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CreditCard class="h-4 w-4" />
                    <span>{{ bizFourDetailTitle }}</span>
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
                      <div class="mt-1 flex items-start gap-2">
                        <span class="flex-1 break-all font-semibold text-foreground">{{ item.value }}</span>
                        <div v-if="item.copyValue || item.href" class="flex items-center gap-1">
                          <Button
                            v-if="item.href"
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7"
                            as-child
                          >
                            <a :href="item.href" target="_blank" rel="noopener noreferrer">
                              <ExternalLink class="h-3.5 w-3.5" />
                            </a>
                          </Button>
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
import { CreditCard, Copy, ExternalLink, MailCheck, User } from "lucide-vue-next";
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
  PlusEmail?: string;
  PlusPassword?: string;
  PlusState?: string;
  PlusAccToken?: string;
  PlusCard?: string;
  PlusUserID?: string;
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

type CardTypeKey = "team" | "plus" | "plusIOS" | "unknown";

type BizFourResult = {
  ok: boolean;
  message: string;
  card: CardInfo | null;
  order: OrderInfo | null;
  orderStatus: OrderStatusMeta | null;
  cardType: CardTypeKey;
  raw: unknown;
};

type SummaryItem = {
  key: string;
  label: string;
  value: string;
  copyValue?: string | null;
  href?: string | null;
};

type BizTwoResponse = {
  ok: boolean;
  message: string;
  items: SummaryItem[];
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

const looksLikeCard = (value: unknown): value is CardInfo => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    "TeamCard" in record ||
    "TeamCardState" in record ||
    "TeamType" in record
  );
};

const looksLikeOrder = (value: unknown): value is OrderInfo => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    "OrderTeamID" in record ||
    "Order_us_Email" in record ||
    "TeamOrderState" in record ||
    "PlusEmail" in record ||
    "PlusPassword" in record ||
    "PlusState" in record
  );
};

const normalizeEntities = (data: unknown): { card: CardInfo | null; order: OrderInfo | null } => {
  if (!data || typeof data !== "object") {
    return { card: null, order: null };
  }
  const record = data as Record<string, unknown>;

  const rawCard = record.Card ?? record.card ?? null;
  let card = looksLikeCard(rawCard) ? (rawCard as CardInfo) : null;

  const rawOrder = record.Order ?? record.order ?? null;
  let order = looksLikeOrder(rawOrder) ? (rawOrder as OrderInfo) : null;

  if (!card && looksLikeCard(record)) {
    card = record as CardInfo;
  }

  if (!order && looksLikeOrder(record)) {
    order = record as OrderInfo;
  }

  const nested = (record.data ?? record.Data) as unknown;
  if (nested && nested !== record) {
    if (!card && looksLikeCard(nested)) {
      card = nested as CardInfo;
    }
    if (!order && looksLikeOrder(nested)) {
      order = nested as OrderInfo;
    }

    if ((!card || !order) && typeof nested === "object") {
      const normalized = normalizeEntities(nested);
      card = card ?? normalized.card;
      order = order ?? normalized.order;
    }
  }

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

const CARD_TYPE_TITLES: Record<CardTypeKey, string> = {
  team: "Team 兑换码邀请信息",
  plus: "Plus 兑换码领取信息",
  plusIOS: "Plus 订阅信息",
  unknown: "卡密详情",
};

const NESTED_VALUE_KEYS = [
  "data",
  "Data",
  "payload",
  "Payload",
  "result",
  "Result",
  "info",
  "Info",
  "details",
  "Details",
  "extra",
  "Extra",
  "content",
  "Content",
];

const normalizeLooseKey = (key: string) => key.replace(/[^a-z0-9]/gi, "").toLowerCase();

const ensurePresentValue = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? value : null;
  }
  if (Array.isArray(value)) {
    return value.length ? value : null;
  }
  return value;
};

const toRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const findValueInRecord = (
  record: Record<string, unknown>,
  normalizedTargets: string[],
  depth = 0,
): unknown => {
  if (!normalizedTargets.length) {
    return null;
  }

  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = normalizeLooseKey(key);
    if (normalizedTargets.includes(normalizedKey)) {
      const ensured = ensurePresentValue(value);
      if (ensured !== null && ensured !== undefined) {
        return ensured;
      }
    }
  }

  if (depth >= 4) {
    return null;
  }

  for (const containerKey of NESTED_VALUE_KEYS) {
    if (!(containerKey in record)) {
      continue;
    }
    const candidate = record[containerKey];
    if (Array.isArray(candidate)) {
      for (const item of candidate) {
        const nestedRecord = toRecord(item);
        if (!nestedRecord) {
          continue;
        }
        const nested = findValueInRecord(nestedRecord, normalizedTargets, depth + 1);
        if (nested !== null && nested !== undefined) {
          return nested;
        }
      }
      continue;
    }
    const nestedRecord = toRecord(candidate);
    if (!nestedRecord) {
      continue;
    }
    const nested = findValueInRecord(nestedRecord, normalizedTargets, depth + 1);
    if (nested !== null && nested !== undefined) {
      return nested;
    }
  }

  for (const value of Object.values(record)) {
    if (!value || typeof value !== "object") {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        const nestedRecord = toRecord(item);
        if (!nestedRecord) {
          continue;
        }
        const nested = findValueInRecord(nestedRecord, normalizedTargets, depth + 1);
        if (nested !== null && nested !== undefined) {
          return nested;
        }
      }
      continue;
    }
    const nestedRecord = value as Record<string, unknown>;
    const nested = findValueInRecord(nestedRecord, normalizedTargets, depth + 1);
    if (nested !== null && nested !== undefined) {
      return nested;
    }
  }

  return null;
};

const valueFromSources = (keys: string[], ...sources: unknown[]): unknown => {
  const normalizedTargets = keys.map((key) => normalizeLooseKey(key)).filter(Boolean);
  if (!normalizedTargets.length) {
    return null;
  }

  for (const source of sources) {
    const record = toRecord(source);
    if (!record) {
      continue;
    }
    const found = findValueInRecord(record, normalizedTargets);
    if (found !== null && found !== undefined) {
      return found;
    }
  }

  return null;
};

const toCopyValue = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
};

const resolveExternalUrl = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^[\w.-]+\.[\w.-]+.*$/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return null;
};

const formatTemporalValue = (value: unknown): string => {
  if (typeof value === "number") {
    return formatTimestamp(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return "—";
    }
    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric)) {
      return formatTimestamp(numeric);
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime())
      ? trimmed
      : parsed.toLocaleString("zh-CN", { hour12: false });
  }
  return "—";
};

const resolveCardTypeKey = (
  card: CardInfo | null,
  order: OrderInfo | null,
  raw: unknown,
): CardTypeKey => {
  const rawTypeValue = valueFromSources(
    ["TeamType", "CardType", "Type"],
    card,
    order,
    raw,
  );

  if (typeof rawTypeValue === "string") {
    const normalized = rawTypeValue.trim().toLowerCase();
    if (normalized === "team") {
      return "team";
    }
    if (normalized === "plus") {
      return "plus";
    }
    if (normalized === "plusios" || normalized === "ios" || normalized === "plus_ios") {
      return "plusIOS";
    }
  }

  const hasPlusHints = Boolean(
    valueFromSources(["PlusEmail", "PlusPassword"], order, raw) ||
      valueFromSources(["PlusCard", "PlusState"], order, raw) ||
      valueFromSources(["MailboxKey", "PlusAccToken"], order, raw),
  );
  if (hasPlusHints) {
    return "plus";
  }

  const hasPlusIosHints = Boolean(
    valueFromSources(
      ["SubscribeEmail", "SubscriptionEmail", "PlusIosEmail"],
      order,
      raw,
    ),
  );
  if (hasPlusIosHints) {
    return "plusIOS";
  }

  if (card?.TeamCard && card.TeamCard.toUpperCase().startsWith("PLUS")) {
    return "plus";
  }

  return "team";
};

const ACCOUNT_LABEL_MAP: Record<string, string> = {
  account: "账号",
  accountemail: "登录邮箱",
  accountname: "账号名称",
  accountpassword: "登录密码",
  accounttype: "账号类型",
  bindemail: "绑定邮箱",
  email: "邮箱",
  emailtxt: "邮箱说明",
  expireat: "到期时间",
  expiretime: "到期时间",
  login: "登录账号",
  loginemail: "登录邮箱",
  loginpassword: "登录密码",
  loginurl: "登录地址",
  mailbox: "邮箱账号",
  mailboxkey: "邮箱密钥",
  password: "登录密码",
  passwd: "登录密码",
  recoveryemail: "恢复邮箱",
  token: "令牌",
  type: "账号类型",
  url: "登录地址",
  username: "用户名",
  pluscard: "兑换码",
  plusacctoken: "访问令牌",
  plusemail: "登录邮箱",
  pluspassword: "登录密码",
  plusstate: "卡密状态",
  plususerid: "用户 ID",
};

const ACCOUNT_KEY_HINTS = [
  "account",
  "bind",
  "email",
  "login",
  "password",
  "passwd",
  "url",
  "token",
  "key",
  "type",
  "expire",
  "user",
  "mail",
];

const normalizeAccountKey = (key: string) =>
  key.replace(/[^a-z0-9]/gi, "").toLowerCase();

const ACCOUNT_STATE_KEYS = new Set(["plusstate", "teamcardstate"]);
const ACCOUNT_EXTRA_KEYS = new Set([
  "pluscard",
  "plusstate",
  "plususerid",
  "teamcard",
  "teamcardstate",
]);

const shouldKeepAccountEntry = (normalizedKey: string, value: unknown) => {
  if (!normalizedKey) {
    return false;
  }
  if (typeof value === "object" && value !== null) {
    return false;
  }

  if (ACCOUNT_EXTRA_KEYS.has(normalizedKey)) {
    return true;
  }

  return ACCOUNT_KEY_HINTS.some((hint) => normalizedKey.includes(hint));
};

const formatAccountState = (value: unknown) => {
  if (value === null || value === undefined) {
    return "—";
  }
  const raw = String(value).trim().toLowerCase();
  return CARD_STATE_LABELS[raw] ?? formatAccountValue(value);
};

const resolveAccountLabel = (key: string) => {
  const normalized = normalizeAccountKey(key);
  if (normalized && ACCOUNT_LABEL_MAP[normalized]) {
    return ACCOUNT_LABEL_MAP[normalized];
  }
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
};

const formatAccountValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "—";
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : "—";
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "—";
  }
  if (typeof value === "boolean") {
    return value ? "是" : "否";
  }
  if (Array.isArray(value)) {
    const joined = value
      .map((item) => formatAccountValue(item))
      .filter((item) => item && item !== "—")
      .join(" / ");
    return joined || "—";
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "—" : value.toLocaleString("zh-CN", { hour12: false });
  }
  return JSON.stringify(value);
};

const formatSensitiveValue = (value: unknown): string => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return "—";
    }
    return maskIdentifier(trimmed);
  }
  return formatAccountValue(value);
};

const extractAccountRecord = (source: unknown, depth = 0): Record<string, unknown> | null => {
  if (!source || depth > 6) {
    return null;
  }

  if (Array.isArray(source)) {
    for (const item of source) {
      const candidate = extractAccountRecord(item, depth + 1);
      if (candidate) {
        return candidate;
      }
    }
    return null;
  }

  if (typeof source !== "object") {
    return null;
  }

  const record = source as Record<string, unknown>;
  const entries = Object.entries(record);
  if (!entries.length) {
    return null;
  }

  const preferredContainers = [
    "Order",
    "order",
    "Account",
    "account",
    "Accounts",
    "accounts",
  ];

  for (const key of preferredContainers) {
    if (!(key in record)) {
      continue;
    }
    const value = record[key];
    if (typeof value === "object" && value && value !== record) {
      const candidate = extractAccountRecord(value, depth + 1);
      if (candidate) {
        return candidate;
      }
    }
  }

  const normalizedKeys = entries.map(([key]) => normalizeAccountKey(key));
  const hasHint = normalizedKeys.some((key) =>
    ACCOUNT_KEY_HINTS.some((hint) => key.includes(hint)),
  );
  if (hasHint) {
    return record;
  }

  const preferredKeys = [
    "Account",
    "account",
    "Accounts",
    "accounts",
    "Data",
    "data",
    "Payload",
    "payload",
    "Info",
    "info",
    "Result",
    "result",
    "Details",
    "details",
  ];

  for (const key of preferredKeys) {
    if (key in record) {
      const candidate = extractAccountRecord(record[key], depth + 1);
      if (candidate) {
        return candidate;
      }
    }
  }

  for (const [, value] of entries) {
    if (typeof value === "object" && value) {
      const candidate = extractAccountRecord(value, depth + 1);
      if (candidate) {
        return candidate;
      }
    }
  }

  return null;
};

const buildAccountSummaryItems = (source: unknown): SummaryItem[] => {
  const record = extractAccountRecord(source);
  if (!record) {
    return [];
  }

  const items: SummaryItem[] = [];
  const seen = new Set<string>();

  const pushEntry = (key: string, value: unknown) => {
    const normalizedKey = normalizeAccountKey(key) || key;
    if (seen.has(normalizedKey) || !shouldKeepAccountEntry(normalizedKey, value)) {
      return;
    }

    const copyValue =
      typeof value === "string" && value.trim()
        ? value
        : typeof value === "number" && Number.isFinite(value)
          ? String(value)
          : null;

    const display = ACCOUNT_STATE_KEYS.has(normalizedKey)
      ? formatAccountState(value)
      : formatAccountValue(value);

    if (!display || display === "—") {
      return;
    }

    items.push({
      key: `account-${normalizedKey}`,
      label: resolveAccountLabel(key) || key,
      value: display,
      copyValue,
    });

    seen.add(normalizedKey);
  };

  for (const [key, value] of Object.entries(record)) {
    if (["ok", "msg"].includes(key)) {
      continue;
    }
    pushEntry(key, value);
  }

  if (source && typeof source === "object" && source !== record) {
    const extras = source as Record<string, unknown>;
    for (const [key, value] of Object.entries(extras)) {
      if (["ok", "msg", "Card", "card", "Order", "order", "data", "Data"].includes(key)) {
        continue;
      }
      pushEntry(key, value);
    }
  }

  return items;
};

const buildTeamSummaryItems = (order: OrderInfo | null, card: CardInfo | null): SummaryItem[] => {
  const teamId = formatTeamId(order);
  const email = order?.Order_us_Email ?? order?.PlusEmail ?? null;

  return [
    { key: "status", label: "卡密状态", value: formatCardStateLabel(card, order) },
    { key: "type", label: "卡密类型", value: formatCardType(card, order) },
    { key: "teamId", label: "团队编号", value: teamId.display, copyValue: teamId.raw },
    {
      key: "email",
      label: "绑定邮箱",
      value: email ? email : "—",
      copyValue: toCopyValue(email),
    },
    { key: "invite", label: "邀请状态", value: formatInviteStatusLabel(order) },
    { key: "createdAt", label: "创建时间", value: formatTimestamp(order?.AddTime ?? card?.AddTime) },
  ];
};

const buildPlusSummaryItems = (
  order: OrderInfo | null,
  card: CardInfo | null,
  raw: unknown,
  options?: { includeReceiveTime?: boolean; includeCardState?: boolean },
): SummaryItem[] => {
  const { includeReceiveTime = true, includeCardState = true } = options ?? {};
  const accountEmail = valueFromSources(
    [
      "PlusEmail",
      "AccountEmail",
      "LoginEmail",
      "Email",
      "email",
    ],
    order,
    raw,
    card,
  );
  const password = valueFromSources(
    ["PlusPassword", "Password", "Pwd", "passwd", "AccountPassword"],
    order,
    raw,
    card,
  );
  const receiveTime =
    valueFromSources(["ReceiveTime", "ReceiveAt", "AddTime", "UpdTime"], order, raw, card) ??
    order?.AddTime ??
    card?.AddTime ??
    null;
  const loginAddress = valueFromSources(
    [
      "LoginUrl",
      "LoginURL",
      "login_url",
      "EmailUrl",
      "EmailLogin",
      "EmailTxt",
      "EmailTXT",
    ],
    order,
    raw,
    card,
  );
  const mailboxKey = valueFromSources(
    [
      "MailboxKey",
      "Mailbox_key",
      "MailboxSecret",
      "EmailKey",
      "PlusAccToken",
      "MailboxPwd",
    ],
    order,
    raw,
    card,
  );

  const items: SummaryItem[] = [
    {
      key: "plusEmail",
      label: "登录邮箱",
      value: formatAccountValue(accountEmail),
      copyValue: toCopyValue(accountEmail),
    },
    {
      key: "plusPassword",
      label: "登录密码",
      value: formatAccountValue(password),
      copyValue: toCopyValue(password),
    },
  ];

  items.push({
    key: "mailboxKey",
    label: "邮箱密钥",
    value: formatSensitiveValue(mailboxKey),
    copyValue: toCopyValue(mailboxKey),
  });

  items.push({
    key: "loginUrl",
    label: "邮箱登录网址",
    value: formatAccountValue(loginAddress),
    copyValue: toCopyValue(loginAddress),
    href: resolveExternalUrl(loginAddress),
  });

  if (includeCardState) {
    items.push({
      key: "cardState",
      label: "兑换码状态",
      value: formatCardStateLabel(card, order),
    });
  }

  if (includeReceiveTime) {
    items.push({
      key: "receiveTime",
      label: "领取时间",
      value: formatTemporalValue(receiveTime),
    });
  }

  return items;
};

const buildPlusIosSummaryItems = (
  order: OrderInfo | null,
  card: CardInfo | null,
  raw: unknown,
): SummaryItem[] => {
  const subscribeEmail = valueFromSources(
    [
      "SubscribeEmail",
      "SubscriptionEmail",
      "PlusEmail",
      "Email",
      "email",
    ],
    order,
    raw,
    card,
  );
  const subscribeState = valueFromSources(
    ["PlusState", "SubscriptionState", "SubscribeState"],
    order,
    raw,
    card,
  );
  const subscribeTime =
    valueFromSources(["SubscribeTime", "SubscriptionTime", "AddTime", "UpdTime"], order, raw, card) ??
    order?.AddTime ??
    card?.AddTime ??
    null;

  return [
    {
      key: "subscribeEmail",
      label: "订阅邮箱",
      value: formatAccountValue(subscribeEmail),
      copyValue: toCopyValue(subscribeEmail),
    },
    {
      key: "cardType",
      label: "卡密类型",
      value: formatCardType(card, order),
    },
    {
      key: "subscribeState",
      label: "订阅状态",
      value: formatAccountState(subscribeState),
    },
    {
      key: "subscribeTime",
      label: "订阅时间",
      value: formatTemporalValue(subscribeTime),
    },
    {
      key: "cardState",
      label: "兑换码状态",
      value: formatCardStateLabel(card, order),
    },
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
    let message = typeof response?.msg === "string" && response.msg.trim()
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
          message = "已发送邀请链接，请注意查收邮件，具体信息可通过兑换码查询";
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
  response: null as BizTwoResponse | null,
});

const bizTwoNormalized = computed(() => normalizeCode(bizTwo.code));
const bizTwoValid = computed(() => isValidCode(bizTwoNormalized.value));

const bizTwoSummaryItems = computed<SummaryItem[]>(() => {
  if (!bizTwo.response || !bizTwo.response.ok) {
    return [];
  }
  return bizTwo.response.items;
});

const submitBizTwo = async () => {
  if (!bizTwoValid.value || bizTwo.submitting) {
    return;
  }

  bizTwo.code = bizTwoNormalized.value;
  bizTwo.submitting = true;
  bizTwo.response = null;

  try {
    const response = await requestCard({
      msgoogle: "GetPlusApi",
      data: { Card: bizTwoNormalized.value },
    });

    const ok = response?.ok === true;
    const message = typeof response?.msg === "string" && response.msg.trim()
      ? response.msg
      : ok
        ? "领取成功"
        : "领取失败";

    const rawData = response?.data ?? null;
    const { card, order } = normalizeEntities(rawData);
    const items = buildPlusSummaryItems(order, card, rawData, {
      includeReceiveTime: false,
      includeCardState: false,
    });

    bizTwo.response = { ok, message, items };

    if (ok) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "领取失败，请稍后再试。";
    bizTwo.response = { ok: false, message, items: [] };
    toast.error(message);
  } finally {
    bizTwo.submitting = false;
  }
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

  if (bizFour.result.cardType === "plus") {
    const items = buildPlusSummaryItems(bizFour.result.order, bizFour.result.card, bizFour.result.raw, {
      includeCardState: false,
    });

    const targetUrl = "https://email.baby";
    const loginItem = items.find((item) => item.key === "loginUrl");
    if (loginItem) {
      loginItem.value = targetUrl;
      loginItem.copyValue = targetUrl;
      loginItem.href = targetUrl;
    }

    return items;
  }

  if (bizFour.result.cardType === "plusIOS") {
    return buildPlusIosSummaryItems(bizFour.result.order, bizFour.result.card, bizFour.result.raw);
  }

  return buildTeamSummaryItems(bizFour.result.order, bizFour.result.card);
});

const bizFourDetailTitle = computed(() => {
  if (!bizFour.result || !bizFour.result.ok) {
    return CARD_TYPE_TITLES.unknown;
  }
  return CARD_TYPE_TITLES[bizFour.result.cardType] ?? CARD_TYPE_TITLES.unknown;
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

    const rawData = response?.data ?? null;
    const { card, order } = normalizeEntities(rawData);
    const orderStatus = resolveOrderStatus(order);
    const cardType = resolveCardTypeKey(card, order, rawData);

    bizFour.result = { ok, message, card, order, orderStatus, cardType, raw: rawData };

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
