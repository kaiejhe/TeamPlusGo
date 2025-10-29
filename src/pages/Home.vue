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

              <div v-if="bizOne.response" class="space-y-3 rounded-lg border border-border/70 bg-muted/40 p-4 text-sm">
                <div class="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">状态：{{ bizOne.response.ok ? 'SUCCESS' : 'FAIL' }}</Badge>
                  <Badge v-if="bizOne.response.orderId" variant="outline">订单号 #{{ bizOne.response.orderId }}</Badge>
                </div>
                <p v-if="bizOne.response.ok" class="text-muted-foreground">
                  演示数据：系统已记录兑换请求，可在查询页查看历史。
                </p>
                <p v-else class="text-destructive">演示提示：提交失败，请稍后再试。</p>
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
                  {{ bizFour.loading ? '查询中…' : '查询（演示 UI）' }}
                </Button>
              </div>

              <div v-if="bizFour.result" class="space-y-4 rounded-lg border border-border/70 bg-muted/40 p-4 text-sm">
                <div class="flex flex-wrap items-center gap-2">
                  <Badge>mode: {{ bizFour.result.mode }}</Badge>
                  <Badge variant="outline">state: {{ bizFour.result.state }}</Badge>
                  <Badge variant="secondary">orders: {{ bizFour.result.summary?.orders ?? 0 }}</Badge>
                  <Badge variant="secondary">accounts: {{ bizFour.result.summary?.accounts ?? 0 }}</Badge>
                </div>

                <div v-if="bizFour.result.data?.accounts?.length">
                  <p class="font-medium text-foreground">已领取账号</p>
                  <ul class="list-disc space-y-1 pl-5">
                    <li v-for="(item, index) in bizFour.result.data.accounts" :key="index">
                      {{ item.login_email }}（{{ item.login_url }}）
                    </li>
                  </ul>
                </div>

                <div v-if="bizFour.result.orders?.length">
                  <p class="font-medium text-foreground">订单记录</p>
                  <ul class="list-disc space-y-1 pl-5">
                    <li v-for="(order, index) in bizFour.result.orders" :key="order.order_id ?? index">
                      #{{ order.order_id }} · {{ order.biz }} · {{ order.status }} · {{ order.created_at }}
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

const bizOne = reactive({
  code: "",
  email: "",
  submitting: false,
  response: null as null | { ok: boolean; orderId?: string },
});

const bizOneNormalized = computed(() => normalizeCode(bizOne.code));
const bizOneCodeValid = computed(() => isValidCode(bizOneNormalized.value));
const bizOneEmailValid = computed(() => /.+@.+\..+/.test(bizOne.email.trim()));

const submitBizOne = () => {
  if (!bizOneCodeValid.value || !bizOneEmailValid.value || bizOne.submitting) {
    return;
  }
  bizOne.submitting = true;
  bizOne.response = null;
  const orderId = "ORD_DEMO_" + Math.floor(Math.random() * 9000 + 1000);
  window.setTimeout(() => {
    bizOne.submitting = false;
    bizOne.response = { ok: true, orderId };
  }, 600);
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
  result: null as null | {
    mode: string;
    state: string;
    summary?: { orders?: number; accounts?: number };
    data?: { accounts?: Array<{ login_email: string; login_url: string }> };
    orders?: Array<{ order_id: string; biz: string; status: string; created_at: string }>;
  },
});

const bizFourNormalized = computed(() => normalizeCode(bizFour.code));
const bizFourValid = computed(() => isValidCode(bizFourNormalized.value));

const submitBizFour = () => {
  if (!bizFourValid.value || bizFour.loading) {
    return;
  }
  bizFour.loading = true;
  bizFour.result = null;
  window.setTimeout(() => {
    bizFour.loading = false;
    bizFour.result = {
      mode: "B2",
      state: "USED",
      summary: { orders: 2, accounts: 1 },
      data: {
        accounts: [
          {
            login_email: "user@example.com",
            login_url: "https://mail.example.com",
          },
        ],
      },
      orders: [
        {
          order_id: "ORD_DEMO_001",
          biz: "B3",
          status: "SUCCESS",
          created_at: "2025-10-29 12:00:00",
        },
      ],
    };
  }, 600);
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
