<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, ChevronRight, ExternalLink, Link2, PlayCircle } from "lucide-vue-next";
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

const parseJsonPayload = (value: string) => {
  try {
    const parsed = JSON.parse(value);

    if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
      throw new Error("参数不对，请粘贴完整 JSON 参数");
    }

    return parsed as Record<string, unknown>;
  } catch {
    throw new Error("参数不对，请粘贴完整 JSON 参数");
  }
};

const validateAccountInfo = () => {
  const payload = jsonPayload.value.trim();

  if (!payload) {
    toast.error("请先粘贴 JSON 参数");
    return;
  }

  try {
    parseJsonPayload(payload);
    toast.success("JSON 参数格式正确");
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "参数不对，请粘贴完整 JSON 参数");
  }
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

          <div class="space-y-3">
            <button
              type="button"
              class="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-none transition-colors hover:border-slate-300 hover:bg-slate-50"
              @click="openOfficialLogin"
            >
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <ExternalLink class="h-4 w-4" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-slate-900">打开官网登录</p>
                <p class="mt-0.5 text-xs text-slate-500">先登录要充值的账号</p>
              </div>
              <ChevronRight class="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              class="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-none transition-colors hover:border-slate-300 hover:bg-slate-50"
              @click="openParamsPage"
            >
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Link2 class="h-4 w-4" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-slate-900">打开参数网址</p>
                <p class="mt-0.5 text-xs text-slate-500">复制完整的 JSON 参数</p>
              </div>
              <ChevronRight class="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-900">
                请粘贴复制的 JSON 参数
              </label>
              <p class="text-sm leading-6 text-slate-500">
                仅支持合法 JSON 格式，完整粘贴后再点击下方按钮验证。
              </p>
            </div>

            <Textarea
              v-model="jsonPayload"
              placeholder='例如：{"user":{"email":"demo@example.com"},"account":{"planType":"plus"}}'
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
