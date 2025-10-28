<template>
  <main class="min-h-screen bg-background px-4 py-12">
    <ConfirmDialog
      :open="confirmDialogState.open"
      :card="confirmDialogState.card"
      :email="confirmDialogState.email"
      :after-sales="confirmDialogState.afterSales ?? undefined"
      @confirm="handleConfirmDialog(true)"
      @cancel="handleConfirmDialog(false)"
    />
    <div class="mx-auto w-full max-w-4xl space-y-8">
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
        <CardHeader class="space-y-3">
          <CardTitle class="flex items-center gap-2 text-xl text-foreground">
            <ShieldCheck class="h-5 w-5 text-primary" />
            {{ statusMeta.title }}
          </CardTitle>
          <CardDescription v-if="statusMeta.description" class="text-sm text-muted-foreground">
            {{ statusMeta.description }}
          </CardDescription>
          <CardDescription v-if="statusMeta.hint" class="text-sm text-muted-foreground">
            {{ statusMeta.hint }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6 text-sm text-muted-foreground">
          <div class="grid gap-3 rounded-xl border border-border/60 bg-muted/50 p-4 text-sm">
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
                class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                :class="orderStatusMeta.className"
              >
                {{ orderStatusMeta.label }}
              </span>
            </div>
          </div>
          <div class="grid gap-4 rounded-xl border border-border/40 bg-muted/30 px-4 py-3 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="space-y-1 text-sm">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Team 兑换码</p>
                <p class="font-mono text-base font-medium text-foreground">{{ cardKey }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">最近检测</p>
                <p class="text-sm font-medium text-muted-foreground">{{ lastVerifiedDisplay }}</p>
              </div>
            </div>

            <div class="grid gap-3 text-sm sm:grid-cols-2">
              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">绑定邮箱</p>
                <p class="font-mono text-sm text-foreground">
                  {{ orderInfo?.Order_us_Email ?? storedState?.email ?? '—' }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Team ID</p>
                <p class="font-mono text-[13px] text-foreground">
                  {{ orderInfo?.OrderTeamID ?? orderInfo?.TeamCard ?? cardKey }}
                </p>
              </div>
            </div>
          </div>

          <section v-if="statusKey === 'unused'" class="space-y-5">
            <Alert variant="default" class="border border-border/60 bg-muted/40">
              <AlertDescription class="space-y-2 text-sm text-muted-foreground">
                <p class="leading-relaxed">
                  绑定邮箱前，请先确认 GPT 注册邮箱，确保填写的信息准确无误。
                </p>
                <details class="group space-y-1 text-xs leading-relaxed text-muted-foreground">
                  <summary
                    class="cursor-pointer text-sm font-medium text-primary transition hover:underline group-open:text-primary/80"
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

            <form class="space-y-5" @submit.prevent="handleEmailSubmit">
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
                  class="h-12"
                />
              </div>

              <div class="space-y-3">
                <Alert v-if="emailError" variant="destructive">
                  <AlertTitle>提交遇到问题</AlertTitle>
                  <AlertDescription>{{ emailError }}</AlertDescription>
                </Alert>
                <div
                  v-if="emailSuccess && !emailError"
                  class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  {{ emailSuccess }}
                </div>
              </div>

              <Button type="submit" size="lg" class="w-full justify-center gap-2 text-base" :disabled="submitting">
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

          <section v-else class="space-y-4 text-sm text-muted-foreground">
            <Alert :variant="statusKey === 'locked' ? 'destructive' : 'default'">
              <AlertTitle>{{ statusMeta.label }}</AlertTitle>
              <AlertDescription>
                {{
                  statusKey === "locked"
                    ? "当前卡密已锁定，如需继续处理请联系管理员或客服。"
                    : "如需通知成员或处理售后，请使用下方快捷操作。"
                }}
              </AlertDescription>
            </Alert>

            <template v-if="statusKey === 'used'">
              <div class="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  class="flex-1 min-w-[140px] border-emerald-500 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-60"
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
            </template>
          </section>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import VerificationSummaryHeader from "@/components/VerificationSummaryHeader.vue";
import { ShieldCheck } from "lucide-vue-next";
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
    className: "bg-amber-100 text-amber-700",
  },
  o2: {
    label: "已发送邀请链接",
    className: "bg-emerald-100 text-emerald-700",
  },
  o3: {
    label: "发送邀请失败",
    className: "bg-rose-100 text-rose-700",
  },
  default: {
    label: "状态未知",
    className: "bg-slate-200 text-slate-700",
  },
};

const orderStatusMeta = computed(() => {
  if (!orderInfo.value?.TeamOrderState) {
    return ORDER_STATUS_META.default;
  }
  const key = orderInfo.value.TeamOrderState.toLowerCase();
  return ORDER_STATUS_META[key] ?? ORDER_STATUS_META.default;
});

const cardKey = computed(() => {
  if (storedState.value?.card) return storedState.value.card;
  const queryCard = typeof route.query.card === "string" ? route.query.card.trim() : "";
  return queryCard;
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

const switchTeam = () => {
  if (!orderInfo.value) {
    toast.error("当前卡密未绑定订单");
    return;
  }
  toast.info("当前功能暂未接入");
};

const optimizeMembers = () => {
  if (!orderInfo.value) {
    toast.error("当前卡密未绑定订单");
    return;
  }
  toast.info("当前功能暂未接入");
};

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
