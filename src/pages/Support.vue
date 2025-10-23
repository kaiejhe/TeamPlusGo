<template>
  <main class="min-h-screen bg-slate-100 px-4 py-12">
    <div class="mx-auto flex max-w-4xl flex-col gap-6">
      <section class="rounded-xl bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-semibold text-slate-900">客服与帮助</h1>
        <p class="mt-2 text-sm text-slate-500">
          如果在购买或验证卡密时遇到问题，可以通过以下方式联系我们，也可以先查看常见问题。
        </p>
      </section>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <article
          v-for="channel in channels"
          :key="channel.title"
          class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <header>
            <h2 class="text-lg font-semibold text-slate-900">{{ channel.title }}</h2>
            <p class="text-xs text-slate-500">{{ channel.subtitle }}</p>
          </header>
          <p class="text-xs text-slate-500">{{ channel.description }}</p>
          <button
            type="button"
            class="mt-auto inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
            @click="channel.action()"
          >
            {{ channel.cta }}
          </button>
        </article>
      </section>

      <section class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="text-sm font-semibold text-slate-700">常见问题</h2>
        <ul class="mt-3 space-y-3 text-xs text-slate-500">
          <li v-for="faq in faqs" :key="faq.question">
            <p class="font-medium text-slate-800">{{ faq.question }}</p>
            <p class="mt-1">{{ faq.answer }}</p>
          </li>
        </ul>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-sm font-semibold text-slate-700">需要继续操作？</h3>
        <div class="mt-3 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            class="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            @click="goHome"
          >
            返回首页
          </button>
          <button
            type="button"
            class="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
            @click="goPurchase"
          >
            去购买卡密
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const channels = [
  {
    title: "在线客服",
    subtitle: "工作日 09:00-23:00",
    description: "适合紧急问题或订单咨询，我们会实时为你解答。",
    cta: "打开聊天",
    action: () => window.open("https://example.com/chat", "_blank"),
  },
  {
    title: "邮件支持",
    subtitle: "全天候受理",
    description: "写邮件告诉我们问题详情，我们会在 24 小时内回复。",
    cta: "发送邮件",
    action: () => {
      window.location.href = "mailto:support@example.com";
    },
  },
];

const faqs = [
  {
    question: "卡密验证失败怎么办？",
    answer: "请检查是否输入了空格或大小写错误，如仍失败可截图联系客服协助处理。",
  },
  {
    question: "付款后多久能收到卡密？",
    answer: "通常 1 分钟内即可收到。如果超过 5 分钟仍未收到，请联系客服。",
  },
  {
    question: "能否多人共用一张卡密？",
    answer: "建议一人一张卡密。如需多人使用，可购买团队套餐或联系客服咨询。",
  },
];

const goHome = () => router.push({ name: "Home" });
const goPurchase = () => router.push({ name: "PurchaseCard" });
</script>
