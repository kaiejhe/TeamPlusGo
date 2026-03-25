<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, ExternalLink, Link2, PlayCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div class="mx-auto max-w-3xl">
      <Card class="rounded-2xl border-slate-200 shadow-sm">
        <CardContent class="space-y-6 p-5 sm:p-6">
          <div class="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              class="h-11 justify-center rounded-xl border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-none hover:bg-slate-50"
              @click="goBack"
            >
              <ArrowLeft class="mr-2 h-4 w-4" />
              返回上一页
            </Button>

            <Button
              variant="outline"
              class="h-11 justify-center rounded-xl border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-none hover:bg-slate-50"
              @click="openDemo"
            >
              <PlayCircle class="mr-2 h-4 w-4" />
              演示视频
            </Button>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              class="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
              @click="openOfficialLogin"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <ExternalLink class="h-4 w-4" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-900">打开官网登录</p>
                  <p class="mt-1 text-xs text-slate-500">先登录要充值的账号</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              class="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
              @click="openParamsPage"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Link2 class="h-4 w-4" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-900">打开参数网址</p>
                  <p class="mt-1 text-xs text-slate-500">复制完整的 JSON 参数</p>
                </div>
              </div>
            </button>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <div class="space-y-2">
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
              class="mt-4 min-h-[260px] resize-none rounded-xl border-slate-200 bg-white px-4 py-3 font-mono text-sm leading-7 text-slate-800 shadow-none focus-visible:ring-0"
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
