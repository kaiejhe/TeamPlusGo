<template>
  <main class="min-h-screen w-full bg-background px-4 py-6 sm:px-6 sm:py-10 flex items-center justify-center">
    <Card class="w-full max-w-4xl shadow-sm border-border">
      <CardHeader class="pb-5">
        <div class="flex  gap-3 flex-row items-start justify-between gap-4">
          <div class="space-y-2">
            <CardTitle class="text-2xl sm:text-3xl tracking-tight">Plus 自助订阅</CardTitle>
            <p class="text-sm sm:text-base text-muted-foreground">XXXX-XXXX-XXXX-XXXX</p>
          </div>
          <Button variant="outline" size="sm" @click="goHome">
            返回首页
          </Button>
        </div>
      </CardHeader>

      <Separator />

      <CardContent class="pt-6 pb-8 px-4 sm:px-8 space-y-8">
        <!-- 操作步骤 -->
        <div class="space-y-4">
          <h2 class="text-sm sm:text-base font-medium text-muted-foreground">获取Json参数步骤</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
              <div class="flex items-center gap-2 text-sm sm:text-base font-medium">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/80 text-primary-foreground text-xs">1</span>
                <span>登录订阅账号</span>
              </div>
              <Button type="button" variant="outline" size="sm" class="mt-1  ml-8" @click="openUrl('https://chatgpt.com')">
                立即打开
              </Button>
            </div>

            <div class="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
              <div class="flex items-center gap-2 text-sm sm:text-base font-medium">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/80 text-primary-foreground text-xs">2</span>
                <span>复制Json参数</span>
              </div>
              <Button type="button" size="sm" variant="outline" class="mt-1  ml-8" @click="openUrl('https://chatgpt.com/api/auth/session')">
                打开链接
              </Button>
            </div>
          </div>
        </div>

        <!-- JSON 输入区域 -->
        <div class="space-y-3">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div class="flex items-center gap-2">
              <Badge variant="outline" class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/80 text-primary-foreground text-xs">3</Badge>
              <span class="text-sm sm:text-base font-medium">粘贴Json参数</span>
            </div>
            <span class="text-xs sm:text-sm text-muted-foreground">请确保完整粘贴，包含首尾的大括号 {"{"} {"}"}</span>
          </div>

          <Textarea
            v-model="jsonValue"
            placeholder='例如：{"subscription_id":"...","plan":"plus",...}'
            class="min-h-[220px] text-sm font-mono resize-y rounded-[var(--radius-xl)] border-border"
          />
          <p v-if="jsonStatus.message" :class="jsonStatus.type === 'success' ? 'text-emerald-600' : 'text-destructive'" class="text-sm flex items-center gap-2">
            <span v-if="jsonStatus.type === 'success'">✔</span>
            <span v-else>✖</span>
            {{ jsonStatus.message }}
          </p>
        </div>

        <!-- 提交按钮 -->
        <div class="pt-2 flex justify-end">
          <Button type="button" size="lg" class="inline-flex items-center gap-2" @click="handleSubmit" :disabled="isSubmitting">
            <CheckCircle2 class="h-4 w-4" />
            {{ isSubmitting ? '正在验证Json参数...' : 'Json参数验证' }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Globe2, Link2, FileJson2, CheckCircle2, KeyRound } from "lucide-vue-next";
import { useRoute } from "vue-router";

type BindAccountJsonPageProps = {
  redeemCode?: string;
};

const props = defineProps<BindAccountJsonPageProps>();
const route = useRoute();
const jsonValue = ref("");
const isSubmitting = ref(false);
const jsonStatus = ref<{ type: 'success' | 'error'; message: string } | { type: null; message: '' }>({ type: null, message: '' } as any);

const displayCode = computed(() => {
  return props.redeemCode || (route.query.card as string) || "PLUS-XXXX-XXXX 示例兑换码";
});

const openUrl = (url: string) => {
  window.open(url, "_blank");
};

const goHome = () => {
  window.location.href = "/";
};

const validateJson = () => {
  const trimmed = jsonValue.value.trim();
  if (!trimmed) {
    jsonStatus.value = { type: 'error', message: '请输入完整的 JSON 参数' } as any;
    return false;
  }
  try {
    JSON.parse(trimmed);
    jsonStatus.value = { type: 'success', message: 'JSON 格式正确' } as any;
    return true;
  } catch (e) {
    jsonStatus.value = { type: 'error', message: 'JSON 格式不正确，请检查后再试' } as any;
    return false;
  }
};

const handleSubmit = () => {
  if (!validateJson()) return;
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    alert('提交成功，已解析 JSON 参数！');
  }, 400);
};
</script>
