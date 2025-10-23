<template>
  <main class="min-h-screen bg-slate-100 px-4 py-12">
    <div class="mx-auto flex max-w-4xl flex-col gap-6">
      <section class="rounded-xl bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-semibold text-slate-900">购买卡密</h1>
        <p class="mt-2 text-sm text-slate-500">
          请选择合适的套餐，支付完成后即可收到唯一的兑换卡密。拿到卡密后，回到首页即可完成验证。
        </p>
      </section>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article
          v-for="plan in plans"
          :key="plan.name"
          class="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <header class="space-y-1">
            <h2 class="text-lg font-semibold text-slate-900">{{ plan.name }}</h2>
            <p class="text-sm text-slate-500">{{ plan.description }}</p>
          </header>

          <p class="text-2xl font-bold text-slate-900">
            {{ plan.price }}
            <span class="ml-1 text-sm font-medium text-slate-500">/{{ plan.unit }}</span>
          </p>

          <ul class="space-y-1 text-xs text-slate-500">
            <li v-for="feature in plan.features" :key="feature">· {{ feature }}</li>
          </ul>

          <button
            type="button"
            class="mt-auto inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            立即购买
          </button>
        </article>
      </section>

      <section class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="text-sm font-semibold text-slate-700">购买流程</h2>
        <ol class="mt-3 list-decimal space-y-2 pl-5 text-xs text-slate-500">
          <li>挑选上方套餐并完成支付。</li>
          <li>收到兑换卡密后，请妥善保管。</li>
          <li>回到首页输入卡密，验证成功后填写邮箱即可。</li>
        </ol>
        <p class="mt-3 text-xs text-slate-500">
          大批量采购或个性化需求，欢迎前往
          <RouterLink class="font-medium text-slate-900 underline" :to="{ name: 'Support' }">
            联系客服
          </RouterLink>
          获取帮助。
        </p>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-sm font-semibold text-slate-700">已经买好了？</h3>
        <p class="mt-2 text-xs text-slate-500">点击下面的按钮回到首页，立即验证卡密。</p>
        <button
          type="button"
          class="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          @click="goHome"
        >
          回到首页验证
        </button>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const plans = [
  {
    name: "个人体验",
    description: "短期体验或单人使用",
    price: "¥68",
    unit: "次",
    features: ["24 小时有效", "不限次数提问", "基础客服支持"],
  },
  {
    name: "进阶升级",
    description: "适合长期使用者",
    price: "¥199",
    unit: "周",
    features: ["7 天有效", "优先客服响应", "可多人共享"],
  },
  {
    name: "团队套餐",
    description: "团队或企业集中采购",
    price: "¥599",
    unit: "月",
    features: ["30 天有效", "账号管理工具", "专属客服通道"],
  },
];

const goHome = () => {
  router.push({ name: "Home" });
};
</script>
