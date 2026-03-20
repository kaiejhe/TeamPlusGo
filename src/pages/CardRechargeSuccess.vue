<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, ExternalLink, Link2, PlayCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

const router = useRouter();
const jsonPayload = ref("");

const goBack = () => {
  router.push({ name: "CardRecharge" });
};

const openOfficialLogin = () => {
  toast("官网登录入口待接入");
};

const openParamsPage = () => {
  toast("参数网址待接入");
};

const openDemo = () => {
  toast("演示视频功能待接入");
};

const validateAccountInfo = () => {
  if (!jsonPayload.value.trim()) {
    toast.error("请先粘贴 JSON 参数");
    return;
  }

  toast.success("账号信息验证功能待接入");
};
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
    <div class="mx-auto max-w-3xl space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          class="h-10 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900"
          @click="goBack"
        >
          <ArrowLeft class="mr-2 h-4 w-4" />
          返回上一页
        </Button>

        <Button
          variant="outline"
          class="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="openDemo"
        >
          <PlayCircle class="mr-2 h-4 w-4" />
          演示视频
        </Button>
      </div>

      <Card class="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader class="space-y-2 border-b border-slate-100 pb-5">
          <CardTitle class="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            参数验证
          </CardTitle>
          <CardDescription class="text-sm leading-6 text-slate-500">
            先完成前置操作，再粘贴参数并验证账号信息。
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6 p-5 sm:p-6">
          <div class="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              class="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
              @click="openOfficialLogin"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-200"
                >
                  <ExternalLink class="h-4 w-4" />
                </div>
                <div class="min-w-0 space-y-1">
                  <p class="text-sm font-semibold text-slate-900">打开官网登录</p>
                  <p class="text-xs leading-5 text-slate-500">
                    登录要充值的账号
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              class="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
              @click="openParamsPage"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-200"
                >
                  <Link2 class="h-4 w-4" />
                </div>
                <div class="min-w-0 space-y-1">
                  <p class="text-sm font-semibold text-slate-900">打开参数网址</p>
                  <p class="text-xs leading-5 text-slate-500">
                    复制完整 JSON 参数
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div class="space-y-3">
            <div class="space-y-1">
              <label class="text-sm font-semibold text-slate-900">
                请粘贴复制的 JSON 参数
              </label>
              <p class="text-sm leading-6 text-slate-500">
                完整粘贴后，点击下方按钮验证账号信息。
              </p>
            </div>

            <Textarea
              v-model="jsonPayload"
              placeholder='例如：{"token":"xxxx","email":"demo@example.com"}'
              class="min-h-[260px] resize-none rounded-xl border-slate-200 bg-white px-4 py-3 font-mono text-sm leading-7 text-slate-800 shadow-none focus-visible:ring-0"
              spellcheck="false"
            />
          </div>

          <Button
            class="h-12 w-full rounded-xl bg-emerald-500 text-base font-semibold text-white shadow-none hover:bg-emerald-600"
            @click="validateAccountInfo"
          >
            验证账号信息
          </Button>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
