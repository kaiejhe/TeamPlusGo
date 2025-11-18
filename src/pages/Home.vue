<template>
  <main class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="w-full max-w-md">
      <Card class="w-full rounded-[var(--radius-xl)] border border-border bg-card shadow-lg">
        <CardHeader class="space-y-2 text-center">
          <CardTitle class="text-3xl font-extrabold tracking-tight text-slate-900">
            {{ copy.heroTitle }}
          </CardTitle>
          <CardDescription class="text-sm text-muted-foreground">
            {{ copy.heroDesc }}
          </CardDescription>
        </CardHeader>
        <CardContent class="px-8 pb-8 pt-2">
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <Label class="text-[15px] font-semibold text-foreground" for="join-code">{{ copy.codeLabel }}</Label>
              <Input
                id="join-code"
                v-model="cardKey"
                :placeholder="copy.codePlaceholder"
                :disabled="submitting"
                maxlength="19"
                class="h-11 rounded-[var(--radius-xl)] text-[15px]"
                autocomplete="off"
                inputmode="text"
                :aria-label="copy.codeLabel"
                @input="handleInput"
                required
              />
            </div>

            <div class="space-y-2">
              <Label class="text-[15px] font-semibold text-foreground" for="join-email">{{ copy.emailLabel }}</Label>
              <Input
                id="join-email"
                type="email"
                v-model="email"
                :placeholder="copy.emailPlaceholder"
                :disabled="submitting"
                class="h-11 rounded-[var(--radius-xl)] text-[15px]"
                autocomplete="off"
                :aria-label="copy.emailLabel"
                :class="{ 'border-destructive text-destructive placeholder:text-destructive/70': emailInvalid }"
                required
              />
            </div>

            <Button
              type="submit"
              class="w-full mt-2 h-11 rounded-[var(--radius-xl)] text-base font-semibold"
              :disabled="submitting || !formatValid || emailInvalid"
            >
              <svg
                v-if="submitting"
                class="mr-2 h-4 w-4 animate-spin"
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
              {{ submitting ? copy.submitting : copy.primaryCta }}
            </Button>

            <p class="text-center text-[11px] text-slate-400 leading-relaxed">
              {{ copy.helper }}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
    <Dialog :open="confirmDialogOpen" @update:open="confirmDialogOpen = $event">
      <DialogContent class="sm:max-w-[420px] space-y-4">
        <DialogHeader class="space-y-1.5 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BadgeCheck class="h-5 w-5" />
          </div>
          <DialogTitle>确认提交信息</DialogTitle>
          <DialogDescription>请确认您的邮箱正确无误，绑定后无法修改！</DialogDescription>
        </DialogHeader>
        <div class="rounded-[var(--radius-xl)] border border-border bg-muted/30 px-4 py-4 text-sm text-foreground space-y-3">
          <div class="flex items-center justify-between gap-3">
            <span class="text-muted-foreground">兑换卡密</span>
            <span class="font-medium break-all text-right">{{ pendingCard || "—" }}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-muted-foreground">绑定邮箱</span>
            <span class="font-medium break-all text-right">{{ pendingEmail || "—" }}</span>
          </div>
        </div>
        <DialogFooter class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            class="sm:min-w-[120px]"
            @click="handleConfirmCancel"
            :disabled="submitting"
          >
            返回修改
          </Button>
          <Button type="button" class="sm:min-w-[120px]" @click="handleConfirmProceed" :disabled="submitting">
            确认提交
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </main>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BadgeCheck } from "lucide-vue-next";
import { toast } from "@/components/ui/toast";
import { Card as verifyCard } from "../apijs/uts";

type CardType = "Team" | "Plus" | "PlusIOS";
type CardInfo = {
  id: number;
  TeamCard: string;
  TeamCardState: string;
  AfterSales: number;
  AddTime: number;
  UpdTime: number | null;
  TeamType?: CardType | string;
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
type InviteRecord = {
  email: string;
  timestamp: number;
  type: string;
  message?: string;
  teamId?: string;
};
type StoredState = {
  card: string;
  verifiedAt: number;
  inviteCount: number;
  history: InviteRecord[];
  cardInfo?: CardInfo | null;
  orderInfo?: OrderInfo | null;
  email?: string;
  teamType?: CardType;
};

const STORAGE_KEY = "team-verified-card";
const CARD_PATTERN = /^[A-Z0-9]{4}(?:-[A-Z0-9]{4}){3}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const router = useRouter();

const cardKey = ref("");
const email = ref("");
const submitting = ref(false);
const storedState = ref<StoredState | null>(null);
const confirmDialogOpen = ref(false);
const pendingCard = ref("");
const pendingEmail = ref("");

const copy = {
  heroTitle: "兑换码自助兑换",
  heroDesc: "输入兑换码与邮箱进行自助兑换",
  codeLabel: "兑换卡密",
  codePlaceholder: "请输入兑换码",
  emailLabel: "兑换邮箱",
  emailPlaceholder: "请输入您的邮箱",
  helper: "我们将把兑换结果发送到您填写的邮箱，请确保邮箱地址填写正确。",
  submitting: "提交中...",
  primaryCta: "立即兑换",
} as const;

const formatCardValue = (value: string) => {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const normalized = cleaned.slice(0, 16);
  const chunks = normalized.match(/.{1,4}/g) ?? [];
  return chunks.join("-");
};

const formatValid = computed(() => CARD_PATTERN.test(cardKey.value));
const emailValid = computed(() => EMAIL_PATTERN.test(email.value.trim()));
const emailInvalid = computed(() => !!email.value && !emailValid.value);

const resolveCardType = (value: unknown): CardType => {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized === "Plus" || normalized === "PlusIOS") {
    return normalized;
  }
  return "Team";
};

const toTimestamp = (value?: number | null) => {
  if (typeof value !== "number" || value <= 0) {
    return Date.now();
  }
  return value > 1e12 ? value : value * 1000;
};

const persistState = (payload: StoredState) => {
  storedState.value = payload;
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  cardKey.value = formatCardValue(target.value);
};

const handleConfirmCancel = () => {
  confirmDialogOpen.value = false;
};

const handleConfirmProceed = () => {
  if (!pendingCard.value || !pendingEmail.value) {
    confirmDialogOpen.value = false;
    return;
  }
  confirmDialogOpen.value = false;
  submitVerification(pendingCard.value, pendingEmail.value);
};

onMounted(() => {
  if (typeof window !== "undefined") {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredState;
        storedState.value = parsed;
        if (parsed.card) {
          cardKey.value = formatCardValue(parsed.card);
        }
        if (parsed.email) {
          email.value = parsed.email;
        }
      }
    } catch (error) {
      console.warn("[Home] failed to restore state", error);
    }
  }
});

const handleSubmit = async () => {
  if (submitting.value) {
    return;
  }

  const normalized = formatCardValue(cardKey.value);
  cardKey.value = normalized;
  const normalizedEmail = email.value.trim();

  if (!normalizedEmail) {
    toast.error("请输入邮箱");
    return;
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    toast.error("邮箱格式有误");
    return;
  }

  if (!normalized) {
    toast.error("请输入完整的兑换码");
    return;
  }

  if (!CARD_PATTERN.test(normalized)) {
    toast.error("兑换码格式有误，请检查");
    return;
  }

  pendingCard.value = normalized;
  pendingEmail.value = normalizedEmail;
  confirmDialogOpen.value = true;
};

const submitVerification = async (normalized: string, normalizedEmail: string) => {
  submitting.value = true;

  try {
    const response = await verifyCard({
      msgoogle: "TeamEmail",
      data: { Email: normalizedEmail, Card: normalized },
    });

    const responsePayload = response?.data ?? null;
    const extractedOrder =
      responsePayload && typeof responsePayload === "object"
        ? (responsePayload.Order ??
            responsePayload.order ??
            ("OrderTeamID" in responsePayload ||
            "TeamCard" in responsePayload ||
            "Order_us_Email" in responsePayload
              ? responsePayload
              : null))
        : null;
    const extractedCard =
      responsePayload && typeof responsePayload === "object"
        ? responsePayload.Card ?? responsePayload.card ?? ("TeamCard" in responsePayload ? responsePayload : null)
        : null;

    if (!response?.ok && !extractedOrder && !extractedCard) {
      toast.error(response?.msg ?? "请求出错，请稍后再试。");
      return;
    }

    toast.success(response.msg ?? "卡密验证成功");

    const cardInfo = (extractedCard as CardInfo | undefined) ?? null;
    const orderInfo = (extractedOrder as OrderInfo | undefined) ?? null;

    const inviteRecord =
      orderInfo && (orderInfo.Order_us_Email || orderInfo.OrderTeamID || orderInfo.TeamCard)
        ? {
            email: orderInfo.Order_us_Email ?? "",
            timestamp: toTimestamp(orderInfo.UpdTime ?? orderInfo.AddTime),
            type: orderInfo.TeamOrderState ?? "已使用",
            message: orderInfo.Content,
            teamId: orderInfo.OrderTeamID ?? orderInfo.TeamCard ?? normalized,
          }
        : null;

    const nextHistory = inviteRecord
      ? [inviteRecord, ...(storedState.value?.history ?? [])]
      : storedState.value?.history ?? [];

    const payload: StoredState = {
      card: normalized,
      verifiedAt: Date.now(),
      inviteCount: nextHistory.length,
      history: nextHistory.slice(0, 5),
      cardInfo,
      orderInfo,
      email: normalizedEmail,
      teamType: resolveCardType(cardInfo?.TeamType ?? orderInfo?.TeamCard),
    };

    persistState(payload);

    router.push({
      name: "VerificationSuccess",
      query: { card: normalized },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "请求出错，请稍后再试。";
    toast.error(message);
  } finally {
    submitting.value = false;
  }
};
</script>
