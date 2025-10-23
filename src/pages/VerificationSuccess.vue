<template>
  <main class="min-h-screen bg-slate-100 px-6 py-16">
    <div class="mx-auto w-full max-w-4xl space-y-6">
      <Card class="shadow-sm">
        <CardHeader class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="space-y-2">
              <CardTitle class="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                卡密详情
              </CardTitle>
              <CardDescription v-if="statusMeta.description" class="text-sm text-slate-600 md:text-base">
                {{ statusMeta.description }}
              </CardDescription>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <Badge :variant="statusMeta.badgeVariant">{{ statusMeta.label }}</Badge>
              <Button
                variant="outline"
                size="sm"
                class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                @click="goBack"
              >
                <ArrowLeft class="h-4 w-4" />
                返回首页
              </Button>
            </div>
          </div>

          <div class="grid gap-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="space-y-1">
                <p class="text-xs text-slate-500">Team 兑换码</p>
                <p class="font-mono text-sm font-medium text-slate-900">{{ cardKey }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-500">最近检测</p>
                <p class="text-xs font-medium text-slate-700">{{ lastVerifiedDisplay }}</p>
              </div>
            </div>

            <div v-if="orderInfo" class="grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
              <div class="space-y-1">
                <p class="text-xs text-slate-500">绑定邮箱</p>
                <p class="font-mono text-sm text-slate-900">
                  {{ orderInfo.Order_us_Email ?? storedState?.email ?? "—" }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-slate-500">Team ID</p>
                <p class="font-mono text-[11px] text-slate-900">
                  {{ orderInfo.OrderTeamID ?? orderInfo.TeamCard ?? cardKey }}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card class="shadow-sm">
        <CardHeader class="space-y-2">
          <CardTitle class="flex items-center gap-2 text-xl">
            <ShieldCheck class="h-5 w-5 text-primary" />
            {{ statusMeta.title }}
          </CardTitle>
          <CardDescription v-if="statusMeta.hint">
            {{ statusMeta.hint }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          <div class="grid gap-3 rounded-lg border border-slate-200 bg-white/80 p-4 text-xs text-slate-600">
            <div class="flex items-center justify-between">
              <span class="text-slate-500">卡密状态</span>
              <span class="font-medium text-slate-900">{{ statusMeta.label }}</span>
            </div>
            <div class="flex items-center justify-between" v-if="afterSalesDays !== null">
              <span class="text-slate-500">售后时长</span>
              <span class="font-medium text-slate-900">{{ afterSalesDays }} 天</span>
            </div>
            <div class="flex items-center justify-between" v-if="cardInfo?.AddTime">
              <span class="text-slate-500">创建时间</span>
              <span class="font-medium text-slate-900">{{ formatTimestamp(cardInfo.AddTime) }}</span>
            </div>
            <div class="flex items-center justify-between" v-if="orderInfo">
              <span class="text-slate-500">邀请状态</span>
              <span
                class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                :class="orderStatusMeta.className"
              >
                {{ orderStatusMeta.label }}
              </span>
            </div>
          </div>

          <section v-if="statusKey === 'unused'" class="space-y-5">
            <Alert variant="default">
              <AlertTitle>卡密未使用</AlertTitle>
              <AlertDescription>
                填写收件邮箱后，系统将自动发送邀请邮件。
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

          <section v-else class="space-y-4 text-xs text-slate-600">
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
            <template v-else>
              <div class="flex flex-wrap gap-2">
                <Button variant="outline" class="flex-1 min-w-[140px]" @click="openSupport">
                  联系客服
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
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, ShieldCheck } from "lucide-vue-next";
import { toast } from "@/components/ui/toast";
import { Card as requestCard } from "../apijs/uts";

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

type ModalApi = {
  showModal?: (options: Record<string, unknown>) => Promise<{ confirm: boolean; cancel?: boolean }>;
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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;

const cardInfo = computed(() => storedState.value?.cardInfo ?? null);
const orderInfo = computed(() => storedState.value?.orderInfo ?? null);

const statusKey = computed<StatusKey>(() => deriveStatus(cardInfo.value, orderInfo.value));
const statusMeta = computed(() => STATUS_META[statusKey.value]);
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

  if (typeof window !== "undefined") {
    const modalApi = (window as typeof window & { Tm?: ModalApi }).Tm;
    if (modalApi?.showModal) {
      const confirmResult = await modalApi.showModal({
        title: "确认提交邮箱",
        content: `我们将把邀请发送至：${teamEmail.value}\n请确认邮箱无误后继续。`,
        confirmText: "确认提交",
        cancelText: "返回修改",
        showCancel: true,
        contentAlign: "left",
      });

      if (!confirmResult?.confirm) {
        return;
      }
    } else if (!window.confirm(`我们将把邀请发送至：${teamEmail.value}\n请确认邮箱无误后继续。`)) {
      return;
    }
  }

  submitting.value = true;
  const loadingId = toast.loading("正在绑定邮箱...");

  try {
    const response = await requestCard({
      msgoogle: "TeamEmail",
      data: {
        Card: cardKey.value,
        Email: teamEmail.value,
      },
    });

    const successMessage = response?.msg ?? "提交成功，我们会尽快发送邀请。";
    toast.success(successMessage, { id: loadingId });
    emailSuccess.value = successMessage;
    submitted.value = true;

    const now = Date.now();
    const record: InviteRecord = {
      email: teamEmail.value,
      timestamp: now,
      type: "初次提交",
      message: response?.msg,
      teamId: storedState.value?.card ?? cardKey.value,
    };

    const responseOrder = (response as unknown as { data?: { Order?: OrderInfo } })?.data?.Order;

    const derivedOrderInfo: OrderInfo =
      responseOrder ??
      ({
        id: storedState.value?.orderInfo?.id ?? Date.now(),
        OrderTeamID: storedState.value?.orderInfo?.OrderTeamID ?? storedState.value?.card ?? cardKey.value,
        Order_us_Email: teamEmail.value,
        AfterSales: storedState.value?.orderInfo?.AfterSales ?? cardInfo.value?.AfterSales ?? 0,
        TeamOrderState: storedState.value?.orderInfo?.TeamOrderState ?? "o2",
        TeamCard: storedState.value?.orderInfo?.TeamCard ?? storedState.value?.card ?? cardKey.value,
        AddTime:
          ensureMilliseconds(
            storedState.value?.orderInfo?.AddTime ??
              (cardInfo.value?.AddTime ? ensureMilliseconds(cardInfo.value.AddTime) : Date.now()),
          ),
        UpdTime: Date.now(),
        Content: response?.msg ?? storedState.value?.orderInfo?.Content ?? "",
      } as OrderInfo);

    const nextState: StoredCardState = {
      card: cardKey.value,
      verifiedAt: storedState.value?.verifiedAt ?? now,
      email: teamEmail.value,
      inviteCount: (storedState.value?.inviteCount ?? 0) + 1,
      history: [record, ...(storedState.value?.history ?? [])],
      cardInfo: storedState.value?.cardInfo ?? null,
      orderInfo: derivedOrderInfo,
    };

    storedState.value = nextState;
    persistState(nextState);

    await sendInvite({ order: derivedOrderInfo, silent: true });
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
  if (sendingInvite.value) {
    return;
  }
  sendingInvite.value = true;
  const loadingId = options?.silent ? toast.loading("正在发送邀请...") : toast.loading("正在发送邀请...");
  try {
    const response = await requestCard({
      msgoogle: "GetTeamApi",
      data: { int: targetOrder.id },
    });
    if (response?.ok) {
      toast.success(response.msg ?? "邀请发送成功。", { id: loadingId });
      const rawData = (response as unknown as { data?: unknown })?.data;

      let latestOrder: OrderInfo | null = null;
      let latestCard: CardInfo | null = null;

      if (rawData && typeof rawData === "object") {
        const maybeOrder = rawData as Partial<OrderInfo>;
        if (
          "OrderTeamID" in maybeOrder ||
          "Order_us_Email" in maybeOrder ||
          "TeamOrderState" in maybeOrder
        ) {
          latestOrder = {
            id: maybeOrder.id ?? targetOrder.id,
            OrderTeamID: maybeOrder.OrderTeamID ?? targetOrder.OrderTeamID,
            Order_us_Email: maybeOrder.Order_us_Email ?? targetOrder.Order_us_Email,
            AfterSales: maybeOrder.AfterSales ?? targetOrder.AfterSales,
            TeamOrderState: maybeOrder.TeamOrderState ?? targetOrder.TeamOrderState,
            TeamCard: maybeOrder.TeamCard ?? targetOrder.TeamCard,
            AddTime: ensureMilliseconds(maybeOrder.AddTime ?? targetOrder.AddTime),
            UpdTime: ensureMilliseconds(maybeOrder.UpdTime ?? Date.now()),
            Content: maybeOrder.Content ?? targetOrder.Content,
          };
        } else if ("Order" in (rawData as Record<string, unknown>)) {
          const nested = (rawData as { Order?: OrderInfo; Card?: CardInfo }).Order ?? null;
          if (nested) {
            latestOrder = {
              ...nested,
              AddTime: ensureMilliseconds(nested.AddTime),
              UpdTime: ensureMilliseconds(nested.UpdTime ?? Date.now()),
            };
          }
          if ("Card" in (rawData as Record<string, unknown>)) {
            const nestedCard = (rawData as { Card?: CardInfo }).Card;
            if (nestedCard) {
              latestCard = {
                ...nestedCard,
                AddTime: ensureMilliseconds(nestedCard.AddTime),
                UpdTime: ensureMilliseconds(nestedCard.UpdTime ?? Date.now()),
              };
            }
          }
        }
      }

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
  toast.info("已提交换团申请，稍后会有工作人员与您确认。");
};

const optimizeMembers = () => {
  if (!orderInfo.value) {
    toast.error("当前卡密未绑定订单");
    return;
  }
  toast.info("已记录成员优化需求，请等待售后团队跟进。");
};

const openSupport = () => {
  router.push({ name: "Support" });
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
