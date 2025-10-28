<template>
  <main class="min-h-[100dvh] bg-background px-4 py-8 md:py-10">
    <ConfirmDialog
      :open="confirmDialogState.open"
      :card="confirmDialogState.card"
      :email="confirmDialogState.email"
      :after-sales="confirmDialogState.afterSales ?? undefined"
      @confirm="handleConfirmDialog(true)"
      @cancel="handleConfirmDialog(false)"
    />
    <div class="mx-auto w-full max-w-4xl space-y-6">
      <Card class="border border-border/80 bg-card shadow-sm">
        <CardHeader class="space-y-0">
          <VerificationSummaryHeader
            :title="headerMeta.title"
            :description="headerMeta.description"
            back-label="返回首页"
            @back="goBack"
          />
        </CardHeader>
      </Card>

      <Card class="border border-border/80 bg-card shadow-sm">
        <CardHeader v-if="statusKey === 'used'" class="space-y-4">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="space-y-1">
              <CardTitle class="flex items-center gap-2 text-lg font-semibold text-foreground md:text-xl">
                <ShieldCheck class="h-5 w-5 text-primary" />
                Team 兑换码兑换详情
              </CardTitle>
              <CardDescription class="text-xs text-muted-foreground md:text-sm">
                核心信息与售后记录一屏查看，方便后续处理。
              </CardDescription>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground md:text-xs">
              <div class="flex items-center gap-2">
                <span>卡密状态</span>
                <Badge variant="outline" :class="cardStatusBadgeClass">
                  {{ statusMeta.label }}
                </Badge>
              </div>
              <div class="flex items-center gap-2">
                <span>邀请状态</span>
                <Badge variant="outline" :class="orderStatusBadgeClass">
                  {{ orderStatusMeta.label }}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardHeader v-else class="space-y-2">
          <CardTitle class="flex items-center gap-2 text-lg font-semibold text-foreground md:text-xl">
            <ShieldCheck class="h-5 w-5 text-primary" />
            {{ statusMeta.title }}
          </CardTitle>
          <CardDescription v-if="statusMeta.description" class="text-xs text-muted-foreground md:text-sm">
            {{ statusMeta.description }}
          </CardDescription>
          <CardDescription v-if="statusMeta.hint" class="text-xs text-muted-foreground md:text-sm">
            {{ statusMeta.hint }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6 text-xs text-muted-foreground md:text-sm">
          <template v-if="statusKey === 'used'">
            <div class="space-y-8">
              <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <div v-for="item in usedPrimaryInfo" :key="item.key" class="space-y-2">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground md:text-xs">
                    {{ item.label }}
                  </p>
                  <div class="flex items-center gap-2">
                    <span
                      :title="item.value"
                      :class="[
                        'flex-1 truncate text-sm font-medium text-foreground md:text-base',
                        item.monospace ? 'font-mono' : '',
                        item.truncate ? 'max-w-[220px] md:max-w-[260px]' : 'max-w-full',
                      ]"
                    >
                      {{ item.displayValue ?? item.value }}
                    </span>
                    <Button
                      v-if="item.copyValue"
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                      @click="copyText(item.copyValue, item.label)"
                    >
                      <Copy class="h-4 w-4" />
                      <span class="sr-only">复制 {{ item.label }}</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div v-if="usedMetaInfo.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="item in usedMetaInfo" :key="item.key" class="space-y-1">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground md:text-xs">
                    {{ item.label }}
                  </p>
                  <p class="text-sm font-medium text-foreground md:text-base">{{ item.value }}</p>
                </div>
              </div>

              <div class="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                <div class="space-y-4 rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm">
                  <div class="space-y-1">
                    <p class="text-sm font-semibold text-foreground md:text-base">操作</p>
                    <p class="text-xs text-muted-foreground md:text-sm">快速处理邀请与团队协作相关事务。</p>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      class="flex-1 min-w-[140px] border-emerald-500 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      @click="sendInvite()"
                      :disabled="!orderInfo || sendingInvite"
                    >
                      发送邀请
                    </Button>
                    <Button
                      variant="outline"
                      class="flex-1 min-w-[140px] border-sky-500 text-sky-700 hover:bg-sky-50 hover:text-sky-800"
                      @click="switchTeam"
                      :disabled="!orderInfo"
                    >
                      一键换团
                    </Button>
                    <Button
                      variant="outline"
                      class="flex-1 min-w-[140px] border-indigo-500 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                      @click="optimizeMembers"
                      :disabled="!orderInfo"
                    >
                      成员优化
                    </Button>
                  </div>
                </div>
                <div class="space-y-4 rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm">
                  <div class="space-y-1">
                    <p class="text-sm font-semibold text-foreground md:text-base">更多</p>
                    <p class="text-xs text-muted-foreground md:text-sm">补充信息和售后指引，方便后续处理。</p>
                  </div>
                  <ul class="space-y-3 text-xs text-muted-foreground md:text-sm">
                    <li class="space-y-1">
                      <p class="text-sm font-medium text-foreground md:text-base">售后说明</p>
                      <p>售后剩余 {{ usedAfterSalesDisplay }}，如需换绑请提供卡密与绑定邮箱。</p>
                    </li>
                    <li class="space-y-1">
                      <p class="text-sm font-medium text-foreground md:text-base">订单备注</p>
                      <p>{{ orderInfo?.Content || "暂无备注信息，可根据实际情况补充。" }}</p>
                    </li>
                    <li class="space-y-1">
                      <p class="text-sm font-medium text-foreground md:text-base">历史记录</p>
                      <p>最近验证时间：{{ lastVerifiedDisplay }}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="grid gap-3 rounded-xl border border-border/60 bg-muted/50 p-4 text-xs md:text-sm">
              <div class="flex items-center justify-between gap-2">
                <span class="text-muted-foreground">卡密状态</span>
                <span class="font-medium text-foreground">{{ statusMeta.label }}</span>
              </div>
              <div class="flex items-center justify-between gap-2" v-if="afterSalesDays !== null">
                <span class="text-muted-foreground">售后时长</span>
                <span class="font-medium text-foreground">{{ afterSalesDays }} 天</span>
              </div>
              <div class="flex items-center justify-between gap-2" v-if="cardInfo?.AddTime">
                <span class="text-muted-foreground">创建时间</span>
                <span class="font-medium text-foreground">{{ formatTimestamp(cardInfo.AddTime) }}</span>
              </div>
              <div class="flex items-center justify-between gap-2" v-if="orderInfo">
                <span class="text-muted-foreground">邀请状态</span>
                <span
                  class="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium"
                  :class="orderStatusMeta.className"
                >
                  {{ orderStatusMeta.label }}
                </span>
              </div>
            </div>
            <div class="grid gap-4 rounded-xl border border-border/40 bg-muted/30 px-4 py-3 shadow-sm">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="space-y-1 text-xs md:text-sm">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Team 兑换码</p>
                  <p class="font-mono text-sm font-medium text-foreground md:text-base">{{ cardKey }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">最近检测</p>
                  <p class="text-xs font-medium text-muted-foreground md:text-sm">{{ lastVerifiedDisplay }}</p>
                </div>
              </div>

              <div class="grid gap-3 text-xs md:text-sm sm:grid-cols-2">
                <div class="space-y-1">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">绑定邮箱</p>
                  <p class="font-mono text-xs text-foreground md:text-sm">
                    {{ orderInfo?.Order_us_Email ?? storedState?.email ?? '—' }}
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Team ID</p>
                  <p class="font-mono text-[11px] text-foreground md:text-[13px]">
                    {{ orderInfo?.OrderTeamID ?? orderInfo?.TeamCard ?? cardKey }}
                  </p>
                </div>
              </div>
            </div>

            <section v-if="statusKey === 'unused'" class="space-y-4">
              <Alert variant="default" class="border border-border/60 bg-muted/40">
                <AlertDescription class="space-y-2 text-xs text-muted-foreground md:text-sm">
                  <p class="leading-relaxed">
                    绑定邮箱前，请先确认 GPT 注册邮箱，确保填写的信息准确无误。
                  </p>
                  <details class="group space-y-1 text-[11px] leading-relaxed text-muted-foreground md:text-xs">
                    <summary
                      class="cursor-pointer text-xs font-medium text-primary transition hover:underline group-open:text-primary/80 md:text-sm"
                    >
                      如何确认 GPT 注册邮箱？
                    </summary>
                    <ol class="list-decimal space-y-1 pl-4">
                      <li>
                        登录
                        <a
                          href="https://chatgpt.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-primary hover:underline"
                        >
                          chatgpt.com
                        </a>
                        并保持会话。
                      </li>
                      <li>
                        在同一浏览器打开
                        <a
                          href="https://chatgpt.com/api/auth/session"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-primary hover:underline"
                        >
                          /api/auth/session
                        </a>
                        页面。
                      </li>
                      <li>
                        页面返回的 JSON 数据中
                        <span class="font-mono text-muted-foreground">user.email</span>
                        字段即为当前绑定的邮箱。
                      </li>
                    </ol>
                  </details>
                </AlertDescription>
              </Alert>

              <form class="space-y-4" @submit.prevent="handleEmailSubmit">
                <div class="space-y-2">
                  <label class="text-xs font-medium uppercase tracking-wide text-muted-foreground" for="team-email">
                    接收邀请邮箱
                  </label>
                  <Input
                    id="team-email"
                    v-model.trim="teamEmail"
                    type="email"
                    placeholder="例如：yourname@example.com"
                    :disabled="submitting"
                    class="h-11"
                  />
                </div>

                <div class="space-y-2">
                  <Alert v-if="emailError" variant="destructive">
                    <AlertTitle>提交遇到问题</AlertTitle>
                    <AlertDescription>{{ emailError }}</AlertDescription>
                  </Alert>
                  <div
                    v-if="emailSuccess && !emailError"
                    class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700 md:text-sm"
                  >
                    {{ emailSuccess }}
                  </div>
                </div>

                <Button type="submit" size="lg" class="w-full justify-center gap-2 text-sm md:text-base" :disabled="submitting">
                  <svg
                    v-if="submitting"
                    class="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  {{ submitted ? "已提交" : submitting ? "提交中..." : "提交邮箱" }}
                </Button>
              </form>
            </section>

            <section v-else class="space-y-3 text-xs text-muted-foreground md:text-sm">
              <Alert :variant="statusKey === 'locked' ? 'destructive' : 'default'">
                <AlertTitle class="text-sm font-semibold text-foreground md:text-base">{{ statusMeta.label }}</AlertTitle>
                <AlertDescription class="text-xs text-muted-foreground md:text-sm">
                  {{
                    statusKey === "locked"
                      ? "当前卡密已锁定，如需继续处理请联系管理员或客服。"
                      : "如需通知成员或处理售后，请使用下方快捷操作。"
                  }}
                </AlertDescription>
              </Alert>
            </section>
          </template>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import VerificationSummaryHeader from "@/components/VerificationSummaryHeader.vue";
import { Copy, ShieldCheck } from "lucide-vue-next";
import { toast } from "@/components/ui/toast";
import { Card as requestCard } from "../apijs/uts";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

type InviteRecord = {
  email: string;
  timestamp: number;
  type: string;
  message?: string;
  teamId?: string;
};

type CardInfo = {
  id: number;
  TeamCard: string;
  TeamCardState: string;
  TeamType?: string;
  AfterSales: number;
  AddTime: number;
  UpdTime: number | null;
};

type OrderInfo = {
  id: number;
  OrderTeamID: string;
  Order_us_Email: string;
  AfterSales: number;
  TeamOrderState: string;
  TeamCard: string;
  AddTime: number;
  UpdTime: number | null;
  Content?: string;
};

type StoredCardState = {
  card: string;
  verifiedAt: number;
  email?: string;
  inviteCount: number;
  history: InviteRecord[];
  cardInfo?: CardInfo | null;
  orderInfo?: OrderInfo | null;
};

type NormalizePayloadContext = {
  card: string;
  email: string;
  message?: string;
  previousOrder: OrderInfo | null;
  previousCard: CardInfo | null;
};

type NormalizedEntities = {
  order: OrderInfo | null;
  card: CardInfo | null;
};

type ConfirmationRequest = {
  card: string;
  email: string;
  afterSales: number | null;
};

type StatusKey = "unused" | "used" | "locked";

type UsedInfoItem = {
  key: string;
  label: string;
  value: string;
  displayValue?: string;
  monospace?: boolean;
  copyValue?: string;
  truncate?: boolean;
};

const STATUS_META: Record<
  StatusKey,
  {
    label: string;
    description: string;
    badgeVariant: "default" | "secondary" | "destructive";
    title: string;
    hint: string;
  }
> = {
  unused: {
    label: "未使用",
    description: "卡密可用，请登记邮箱完成绑定。",
    badgeVariant: "secondary",
    title: "待绑定邮箱",
    hint: "填写收件邮箱，系统会自动发送邀请邮件。",
  },
  used: {
    label: "已使用",
    description: "",
    badgeVariant: "default",
    title: "已绑定订单",
    hint: "",
  },
  locked: {
    label: "已锁定",
    description: "卡密暂不可用，如需解锁请联系管理员或客服。",
    badgeVariant: "destructive",
    title: "卡密已锁定",
    hint: "",
  },
};

const STORAGE_KEY = "team-verified-card";

const route = useRoute();
const router = useRouter();

const storedState = ref<StoredCardState | null>(null);
const teamEmail = ref("");
const submitting = ref(false);
const submitted = ref(false);
const emailError = ref<string | null>(null);
const emailSuccess = ref<string | null>(null);
const lastVerified = ref<number | null>(null);
const sendingInvite = ref(false);
const confirmDialogState = reactive<{
  open: boolean;
  card: string;
  email: string;
  afterSales: number | null;
}>({
  open: false,
  card: "",
  email: "",
  afterSales: null,
});

let resolveConfirmation: ((result: boolean) => void) | null = null;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;

const cardInfo = computed(() => storedState.value?.cardInfo ?? null);
const orderInfo = computed(() => storedState.value?.orderInfo ?? null);

const statusKey = computed<StatusKey>(() => deriveStatus(cardInfo.value, orderInfo.value));
const statusMeta = computed(() => STATUS_META[statusKey.value]);
const TEAM_TYPE_COPY: Record<"team" | "plus", { title: string; description: string }> = {
  team: {
    title: "Team 团队自动邀请",
    description: "自动发送团队邀请，适合快速为成员开通使用权限。",
  },
  plus: {
    title: "Plus 成品号",
    description: "提供即开即用的 Plus 成品账号，登录即可体验完整功能。",
  },
};
const teamType = computed(() => {
  const candidates: Array<string | null | undefined> = [cardInfo.value?.TeamType, storedState.value?.cardInfo?.TeamType];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
});
const headerMeta = computed(() => {
  const normalized = teamType.value.toLowerCase();
  if (normalized === "team") {
    return TEAM_TYPE_COPY.team;
  }
  if (normalized === "plus") {
    return TEAM_TYPE_COPY.plus;
  }
  return {
    title: "卡密详情",
    description: "查看卡密状态与后续操作指引。",
  };
});
const afterSalesDays = computed(() => orderInfo.value?.AfterSales ?? cardInfo.value?.AfterSales ?? null);
const lastVerifiedDisplay = computed(() => formatTimestamp(lastVerified.value));
const ORDER_STATUS_META: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  o1: {
    label: "待发送邀请链接",
    className: "border-amber-200 bg-amber-100 text-amber-700",
  },
  o2: {
    label: "已发送邀请链接",
    className: "border-emerald-200 bg-emerald-100 text-emerald-700",
  },
  o3: {
    label: "发送邀请失败",
    className: "border-rose-200 bg-rose-100 text-rose-700",
  },
  default: {
    label: "状态未知",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  },
};

const orderStatusMeta = computed(() => {
  if (!orderInfo.value?.TeamOrderState) {
    return ORDER_STATUS_META.default;
  }
  const key = orderInfo.value.TeamOrderState.toLowerCase();
  return ORDER_STATUS_META[key] ?? ORDER_STATUS_META.default;
});

const CARD_STATUS_BADGE_CLASS: Record<StatusKey, string> = {
  unused: "border-slate-200 bg-slate-100 text-slate-700",
  used: "border-emerald-200 bg-emerald-100 text-emerald-700",
  locked: "border-rose-200 bg-rose-100 text-rose-700",
};

const cardStatusBadgeClass = computed(() => CARD_STATUS_BADGE_CLASS[statusKey.value] ?? CARD_STATUS_BADGE_CLASS.unused);
const orderStatusBadgeClass = computed(() => orderStatusMeta.value.className);

const cardKey = computed(() => {
  if (storedState.value?.card) return storedState.value.card;
  const queryCard = typeof route.query.card === "string" ? route.query.card.trim() : "";
  return queryCard;
});

const formatIdentifier = (value: string) => {
  if (!value) return "";
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
};
const usedPrimaryInfo = computed<UsedInfoItem[]>(() => {
  if (statusKey.value !== "used") {
    return [];
  }

  const email = orderInfo.value?.Order_us_Email ?? storedState.value?.email ?? "";
  const teamId =
    orderInfo.value?.OrderTeamID ??
    orderInfo.value?.TeamCard ??
    cardInfo.value?.TeamCard ??
    cardKey.value ??
    "";

  return [
    {
      key: "card",
      label: "兑换卡密",
      value: cardKey.value || "—",
      monospace: true,
      copyValue: cardKey.value || "",
    },
    {
      key: "team",
      label: "TEAM ID",
      value: teamId || "—",
      displayValue: teamId ? formatIdentifier(teamId) : "—",
      monospace: true,
      copyValue: teamId || "",
    },
    {
      key: "email",
      label: "绑定邮箱",
      value: email || "—",
      monospace: true,
      copyValue: email || "",
    },
  ];
});
const usedMetaInfo = computed<UsedInfoItem[]>(() => {
  if (statusKey.value !== "used") {
    return [];
  }

  const meta: UsedInfoItem[] = [];

  meta.push({
    key: "after-sales",
    label: "售后时长",
    value: afterSalesDays.value !== null ? `${afterSalesDays.value} 天` : "—",
  });

  const createdAt = orderInfo.value?.AddTime ?? null;
  meta.push({
    key: "created-at",
    label: "创建时间",
    value: formatTimestamp(createdAt),
  });

  meta.push({
    key: "last-verified",
    label: "最近检测",
    value: lastVerifiedDisplay.value,
  });

  return meta;
});

const usedAfterSalesDisplay = computed(() => {
  if (afterSalesDays.value === null) {
    return "暂无记录";
  }
  return `${afterSalesDays.value} 天`;
});

const formatTimestamp = (value: number | null | undefined) => {
  if (!value || Number.isNaN(value)) return "—";
  const timestamp = value > 1e12 ? value : value * 1000;
  return new Date(timestamp).toLocaleString("zh-CN", { hour12: false });
};

function deriveStatus(card: CardInfo | null, order: OrderInfo | null): StatusKey {
  const code = (order?.TeamOrderState ?? card?.TeamCardState ?? "").toLowerCase();

  if (["lock", "locked", "o3", "freeze", "suspend"].includes(code)) {
    return "locked";
  }

  if (order) {
    return "used";
  }

  return "unused";
}

const loadState = (): StoredCardState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredCardState) : null;
  } catch (error) {
    console.warn("[VerificationSuccess] Failed to parse stored state:", error);
    return null;
  }
};

const persistState = (state: StoredCardState) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const requestEmailConfirmation = (payload: ConfirmationRequest) => {
  confirmDialogState.card = payload.card;
  confirmDialogState.email = payload.email;
  confirmDialogState.afterSales = payload.afterSales;
  confirmDialogState.open = true;

  return new Promise<boolean>((resolve) => {
    resolveConfirmation = resolve;
  });
};

const handleConfirmDialog = (confirmed: boolean) => {
  confirmDialogState.open = false;
  if (resolveConfirmation) {
    resolveConfirmation(confirmed);
    resolveConfirmation = null;
  }

  confirmDialogState.card = "";
  confirmDialogState.email = "";
  confirmDialogState.afterSales = null;
};

const handleEmailSubmit = async () => {
  if (statusKey.value !== "unused") {
    toast.error("当前卡密无需重新提交邮箱");
    return;
  }

  emailError.value = null;
  emailSuccess.value = null;

  if (!cardKey.value) {
    emailError.value = "缺少卡密信息，请返回首页重新验证。";
    toast.error(emailError.value);
    return;
  }

  if (!teamEmail.value) {
    emailError.value = "邮箱不能为空，请填写接收邀请的邮箱。";
    toast.error(emailError.value);
    return;
  }

  if (!EMAIL_REGEX.test(teamEmail.value)) {
    emailError.value = "邮箱格式不正确，请检查后再提交。";
    toast.error(emailError.value);
    return;
  }

  const confirmed = await requestEmailConfirmation({
    card: cardKey.value,
    email: teamEmail.value,
    afterSales: afterSalesDays.value,
  });

  if (!confirmed) {
    return;
  }

  submitting.value = true;
  const loadingId = toast.loading("正在创建订单...");

  try {
    const response = await requestCard({
      msgoogle: "TeamEmail",
      data: {
        Card: cardKey.value,
        Email: teamEmail.value,
      },
    });

    if (!response?.ok) {
      const errorMessage = response?.msg ?? "创建订单失败，请稍后再试或联系客服。";
      emailError.value = errorMessage;
      toast.error(errorMessage, { id: loadingId });
      return;
    }

    const { order: createdOrder, card: latestCard } = normalizeApiPayload(response?.data, {
      card: cardKey.value,
      email: teamEmail.value,
      message: response?.msg,
      previousOrder: storedState.value?.orderInfo ?? null,
      previousCard: storedState.value?.cardInfo ?? null,
    });

    if (!createdOrder) {
      const errorMessage = "返回数据缺少订单信息，请稍后再试或联系客服。";
      emailError.value = errorMessage;
      toast.error(errorMessage, { id: loadingId });
      return;
    }

    const successMessage = response?.msg ?? "订单创建成功，我们会尽快发送邀请。";
    toast.success(successMessage, { id: loadingId });
    emailSuccess.value = successMessage;
    submitted.value = true;

    const now = Date.now();
    const record: InviteRecord = {
      email: createdOrder.Order_us_Email ?? teamEmail.value,
      timestamp: now,
      type: "初次提交",
      message: successMessage,
      teamId: createdOrder.TeamCard ?? cardKey.value,
    };

    const nextState: StoredCardState = {
      card: cardKey.value,
      verifiedAt: storedState.value?.verifiedAt ?? now,
      email: createdOrder.Order_us_Email ?? teamEmail.value,
      inviteCount: (storedState.value?.inviteCount ?? 0) + 1,
      history: [record, ...(storedState.value?.history ?? [])],
      cardInfo: latestCard ?? storedState.value?.cardInfo ?? null,
      orderInfo: createdOrder,
    };

    storedState.value = nextState;
    persistState(nextState);

    await sendInvite({ order: createdOrder, silent: true });
  } catch (error) {
    const fallbackMessage =
      error instanceof Error ? error.message : "提交失败，请稍后再试或联系客服。";
    emailError.value = fallbackMessage;
    toast.error(fallbackMessage, { id: loadingId });
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  router.push({ name: "Home" });
};

const copyText = async (value: string, label: string) => {
  if (!value) {
    toast.error(`暂无可复制的${label}`);
    return;
  }

  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    toast.error("当前环境暂不支持复制");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} 已复制`);
  } catch (error) {
    console.error("[VerificationSuccess] copy failed", error);
    toast.error("复制失败，请稍后重试");
  }
};

const sendInvite = async (options?: { order?: OrderInfo; silent?: boolean }) => {
  const targetOrder = options?.order ?? orderInfo.value;
  if (!targetOrder) {
    toast.error("当前卡密未绑定订单");
    return;
  }

  const orderId = Number(targetOrder.id);
  if (!Number.isFinite(orderId) || orderId <= 0) {
    toast.error("订单编号缺失，无法发送邀请");
    return;
  }

  if (sendingInvite.value) {
    return;
  }
  sendingInvite.value = true;
  const loadingId = options?.silent ? toast.loading("正在发送邀请...") : toast.loading("正在发送邀请...");
  try {
    const response = await requestCard({
      msgoogle: "GetTeamApi",
      data: { int: orderId },
    });
    if (response?.ok) {
      const successMessage = response.msg ?? "邀请发送成功。";
      toast.success(successMessage, { id: loadingId });
      const rawData = (response as unknown as { data?: unknown })?.data;
      const normalizedTarget: OrderInfo = { ...targetOrder, id: orderId };
      const { order: latestOrder, card: latestCard } = normalizeApiPayload(rawData, {
        card: cardKey.value,
        email: normalizedTarget.Order_us_Email ?? storedState.value?.email ?? "",
        message: successMessage,
        previousOrder: normalizedTarget,
        previousCard: storedState.value?.cardInfo ?? null,
      });

      if (!latestOrder) {
        await refreshCardState();
      } else {
        const nextState: StoredCardState = {
          card: cardKey.value,
          verifiedAt: Date.now(),
          email: latestOrder.Order_us_Email ?? storedState.value?.email ?? "",
          inviteCount: storedState.value?.inviteCount ?? 0,
          history: storedState.value?.history ?? [],
          cardInfo: latestCard ?? storedState.value?.cardInfo ?? null,
          orderInfo: latestOrder,
        };

        storedState.value = nextState;
        lastVerified.value = nextState.verifiedAt;
        teamEmail.value = nextState.email ?? teamEmail.value;
        persistState(nextState);
      }
    } else {
      toast.error(response?.msg ?? "邀请发送失败，请稍后再试或联系客服。", { id: loadingId });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "发送邀请失败，请稍后再试或联系客服。";
    toast.error(message, { id: loadingId });
  } finally {
    sendingInvite.value = false;
  }
};


const switchTeam = () => {
  if (!orderInfo.value) {
    toast.error("当前卡密未绑定订单");
    return;
  }
  toast.info("一键换团功能暂未开通，请联系客服协助处理。");
};

const optimizeMembers = () => {
  if (!orderInfo.value) {
    toast.error("当前卡密未绑定订单");
    return;
  }
  toast.info("成员优化功能开发中，敬请期待。");
};



function normalizeApiPayload(payload: unknown, context: NormalizePayloadContext): NormalizedEntities {
  const { order: rawOrder, card: rawCard } = splitPayloadEntities(payload);
  const order = normalizeOrderInfo(rawOrder, context);
  const card = normalizeCardInfo(rawCard, { cardKey: context.card, previous: context.previousCard });
  return {
    order,
    card,
  };
}

function splitPayloadEntities(payload: unknown): { order: unknown; card: unknown } {
  if (payload == null) {
    return { order: null, card: null };
  }

  if (typeof payload === "number" || typeof payload === "string") {
    return { order: payload, card: null };
  }

  if (typeof payload !== "object") {
    return { order: null, card: null };
  }

  const record = payload as Record<string, unknown>;

  if ("Order" in record || "order" in record || "Card" in record || "card" in record) {
    return {
      order: "Order" in record ? record.Order : "order" in record ? record.order : null,
      card: "Card" in record ? record.Card : "card" in record ? record.card : null,
    };
  }

  if ("data" in record && record.data && typeof record.data === "object") {
    return splitPayloadEntities(record.data);
  }

  return { order: record, card: null };
}

function normalizeOrderInfo(raw: unknown, context: NormalizePayloadContext): OrderInfo | null {
  const fallbackOrder = context.previousOrder ? { ...context.previousOrder } : null;
  const fallbackCard = context.previousCard ?? null;

  if (raw == null) {
    return fallbackOrder;
  }

  let record: Record<string, unknown>;
  if (typeof raw === "number" || typeof raw === "string") {
    record = { id: raw };
  } else if (typeof raw === "object") {
    record = raw as Record<string, unknown>;
  } else {
    return fallbackOrder;
  }

  const id =
    toPositiveInt(record.id) ??
    toPositiveInt(record.ID) ??
    toPositiveInt(record.orderId) ??
    toPositiveInt(record.order_id) ??
    toPositiveInt(record.int);

  if (!id) {
    return fallbackOrder;
  }

  const resolvedEmail =
    typeof record.Order_us_Email === "string" && record.Order_us_Email.trim()
      ? record.Order_us_Email.trim()
      : context.email || fallbackOrder?.Order_us_Email || "";

  const resolvedTeamCard =
    typeof record.TeamCard === "string" && record.TeamCard.trim()
      ? record.TeamCard.trim()
      : fallbackOrder?.TeamCard ?? context.card;

  const resolvedOrderTeamId =
    typeof record.OrderTeamID === "string" && record.OrderTeamID.trim()
      ? record.OrderTeamID.trim()
      : fallbackOrder?.OrderTeamID ?? resolvedTeamCard;

  const resolvedState =
    typeof record.TeamOrderState === "string" && record.TeamOrderState.trim()
      ? record.TeamOrderState.trim()
      : fallbackOrder?.TeamOrderState ?? "o1";

  const resolvedAfterSales =
    resolveNumber(record.AfterSales) ?? fallbackOrder?.AfterSales ?? fallbackCard?.AfterSales ?? 0;

  const resolvedContent =
    typeof record.Content === "string" && record.Content.trim()
      ? record.Content.trim()
      : fallbackOrder?.Content ?? context.message ?? "";

  const resolvedAddTime =
    resolveNumber(record.AddTime) ??
    resolveNumber((record as Record<string, unknown>).addTime) ??
    fallbackOrder?.AddTime ??
    fallbackCard?.AddTime ??
    Date.now();

  const resolvedUpdTime =
    resolveNumber(record.UpdTime) ??
    resolveNumber((record as Record<string, unknown>).updTime) ??
    Date.now();

  return {
    id,
    OrderTeamID: resolvedOrderTeamId,
    Order_us_Email: resolvedEmail,
    AfterSales: resolvedAfterSales,
    TeamOrderState: resolvedState,
    TeamCard: resolvedTeamCard,
    AddTime: ensureMilliseconds(resolvedAddTime),
    UpdTime: ensureMilliseconds(resolvedUpdTime),
    Content: resolvedContent,
  };
}

function normalizeCardInfo(
  raw: unknown,
  context: { cardKey: string; previous: CardInfo | null },
): CardInfo | null {
  const previous = context.previous ? { ...context.previous } : null;

  if (raw == null) {
    return previous;
  }

  if (typeof raw !== "object") {
    return previous;
  }

  const record = raw as Record<string, unknown>;

  const id =
    toPositiveInt(record.id) ??
    toPositiveInt(record.ID) ??
    toPositiveInt(record.cardId) ??
    toPositiveInt(record.card_id);

  if (!id) {
    return previous;
  }

  const resolvedTeamCard =
    typeof record.TeamCard === "string" && record.TeamCard.trim()
      ? record.TeamCard.trim()
      : previous?.TeamCard ?? context.cardKey;

  const resolvedState =
    typeof record.TeamCardState === "string" && record.TeamCardState.trim()
      ? record.TeamCardState.trim()
      : previous?.TeamCardState ?? "";
  const resolvedTeamType =
    typeof record.TeamType === "string" && record.TeamType.trim()
      ? record.TeamType.trim()
      : previous?.TeamType ?? "";

  const resolvedAfterSales =
    resolveNumber(record.AfterSales) ?? previous?.AfterSales ?? 0;

  const resolvedAddTime =
    resolveNumber(record.AddTime) ??
    resolveNumber((record as Record<string, unknown>).addTime) ??
    previous?.AddTime ??
    Date.now();

  const resolvedUpdTime =
    resolveNumber(record.UpdTime) ??
    resolveNumber((record as Record<string, unknown>).updTime) ??
    previous?.UpdTime ??
    Date.now();

  return {
    id,
    TeamCard: resolvedTeamCard,
    TeamCardState: resolvedState,
    TeamType: resolvedTeamType,
    AfterSales: resolvedAfterSales,
    AddTime: ensureMilliseconds(resolvedAddTime),
    UpdTime: ensureMilliseconds(resolvedUpdTime),
  };
}

function resolveNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function toPositiveInt(value: unknown): number | null {
  const numeric = resolveNumber(value);
  if (numeric === null) {
    return null;
  }
  const intValue = Math.trunc(numeric);
  return intValue > 0 ? intValue : null;
}

const refreshCardState = async () => {
  if (!cardKey.value) return;
  try {
    const response = await requestCard({
      msgoogle: "TeamCard",
      data: { Card: cardKey.value },
    });

    if (response?.ok) {
      const nextCardInfo = (response?.data?.Card as CardInfo | undefined) ?? cardInfo.value ?? null;
      const nextOrderInfo = (response?.data?.Order as OrderInfo | undefined) ?? orderInfo.value ?? null;

      const nextState: StoredCardState = {
        card: cardKey.value,
        verifiedAt: Date.now(),
        email:
          nextOrderInfo?.Order_us_Email ?? storedState.value?.email ?? teamEmail.value ?? "",
        inviteCount: storedState.value?.inviteCount ?? 0,
        history: storedState.value?.history ?? [],
        cardInfo: nextCardInfo,
        orderInfo: nextOrderInfo,
      };

      storedState.value = nextState;
      lastVerified.value = nextState.verifiedAt;
      if (nextOrderInfo?.Order_us_Email) {
        teamEmail.value = nextOrderInfo.Order_us_Email;
      }
      persistState(nextState);
    }
  } catch (error) {
    console.warn("[VerificationSuccess] failed to refresh card state", error);
  }
};

onMounted(() => {
  const existing = loadState();
  if (existing?.card) {
    storedState.value = existing;
    teamEmail.value = existing.email ?? existing.orderInfo?.Order_us_Email ?? "";
    submitted.value = Boolean(existing.email) || existing.inviteCount > 0;
    lastVerified.value = existing.verifiedAt;
    return;
  }

  const queryCard = typeof route.query.card === "string" ? route.query.card.trim() : "";
  if (!queryCard) {
    toast.error("缺少验证记录，请返回首页重新验证。");
    router.replace({ name: "Home" });
    return;
  }

  const fallbackState: StoredCardState = {
    card: queryCard,
    verifiedAt: Date.now(),
    inviteCount: 0,
    history: [],
    cardInfo: null,
    orderInfo: null,
  };
  storedState.value = fallbackState;
  lastVerified.value = fallbackState.verifiedAt;
  persistState(fallbackState);
});

function ensureMilliseconds(value: number) {
  if (!value || Number.isNaN(value)) return Date.now();
  return value > 1e12 ? value : value * 1000;
}
</script>
