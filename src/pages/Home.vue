<template>
  <main class="min-h-screen bg-slate-100 py-16">
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 lg:px-0">
      <Card class="shadow-sm">
        <CardHeader class="space-y-3 text-center">
          <Badge variant="secondary" class="inline-flex w-fit items-center gap-2 px-3 py-1 text-xs font-semibold">
            <Ticket class="h-3.5 w-3.5" />
            ChatGPT Team 管理
          </Badge>
          <div class="space-y-2">
            <CardTitle class="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              校验卡密，进入详情处理
            </CardTitle>
            <CardDescription class="text-sm text-slate-600 md:text-base">
              输入兑换卡密后，系统会判断是否存在并跳转至详情页处理后续操作。
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card class="shadow-sm">
        <CardContent class="space-y-6 p-6">
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div class="space-y-2 text-left">
              <label class="text-xs font-medium uppercase tracking-wide text-muted-foreground" for="card-key">
                兑换卡密
              </label>
              <Input
                id="card-key"
                v-model="cardKey"
                placeholder="例如：TEAM-ABCD-EFGH-IJKL"
                :disabled="submitting"
                maxlength="19"
                class="h-12"
              />
            </div>

            <Button type="submit" size="lg" class="w-full gap-2" :disabled="submitting">
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
              {{ submitting ? "验证中..." : "检测卡密" }}
            </Button>
          </form>

          <p class="text-center text-xs text-slate-500">
            验证通过后将自动跳转至详情页面完成邮箱绑定或查看订单信息。
          </p>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ticket } from "lucide-vue-next";
import { toast } from "@/components/ui/toast";
import { Card as verifyCard } from "../apijs/uts";

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
};

const STORAGE_KEY = "team-verified-card";

const router = useRouter();

const cardKey = ref("");
const submitting = ref(false);

onMounted(() => {
  if (typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as StoredState;
    if (parsed.card) {
      cardKey.value = parsed.card;
    }
  } catch (error) {
    console.warn("[Home] failed to restore card key", error);
  }
});

const handleSubmit = async () => {
  if (submitting.value) {
    return;
  }

  const trimmed = cardKey.value.trim().toUpperCase();
  if (!trimmed) {
    toast.error("请输入完整的兑换卡密");
    return;
  }

  const CARD_PATTERN = /^[A-Z0-9]{4}(?:-[A-Z0-9]{4}){3}$/;
  if (!CARD_PATTERN.test(trimmed)) {
    toast.error("激活码错误，请检查后重试");
    return;
  }

  cardKey.value = trimmed;
  submitting.value = true;

  try {
    const response = await verifyCard({
      msgoogle: "TeamCard",
      data: { Card: trimmed },
    });

    if (response?.ok) {
      toast.success(response.msg ?? "卡密验证成功");

      const cardInfo = (response?.data?.Card as CardInfo | undefined) ?? null;
      const orderInfo = (response?.data?.Order as OrderInfo | undefined) ?? null;

      const orderRecord =
        orderInfo && (orderInfo.Order_us_Email || orderInfo.OrderTeamID || orderInfo.TeamCard)
          ? {
              email: orderInfo.Order_us_Email ?? "",
              timestamp: (() => {
                const timeValue = orderInfo.UpdTime ?? orderInfo.AddTime;
                if (typeof timeValue === "number" && timeValue > 0) {
                  return timeValue > 1e12 ? timeValue : timeValue * 1000;
                }
                return Date.now();
              })(),
              type: orderInfo.TeamOrderState ?? "已使用",
              message: orderInfo.Content,
              teamId: orderInfo.OrderTeamID ?? orderInfo.TeamCard ?? trimmed,
            }
          : null;

      const payload: StoredState = {
        card: trimmed,
        verifiedAt: Date.now(),
        inviteCount: orderRecord ? 1 : 0,
        history: orderRecord ? [orderRecord] : [],
        cardInfo,
        orderInfo,
        email: orderInfo?.Order_us_Email ?? "",
      };

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }

      router.push({
        name: "VerificationSuccess",
        query: { card: trimmed },
      });
      return;
    }

    toast.error(response?.msg ?? "未能验证该卡密，请稍后再试。");
  } catch (error) {
    const fallbackMessage =
      error instanceof Error ? error.message : "请求出错，请稍后再试或联系客服。";
    toast.error(fallbackMessage);
  } finally {
    submitting.value = false;
  }
};
</script>
