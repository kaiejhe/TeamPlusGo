<template>
  <main class="min-h-screen w-full bg-background px-4 py-6 sm:px-6 sm:py-10 flex items-center justify-center">
    <Card class="w-full max-w-xl shadow-sm border-border">
      <CardContent class="pt-6 pb-8 px-4 sm:pt-8 sm:pb-10 sm:px-8 space-y-8">
        <!-- 顶部标题 -->
        <div class="flex flex-col items-center gap-3 text-center">
          <div class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground bg-muted/60">
            <ShieldCheck class="h-3.5 w-3.5" />
            <span>安全 · 自动 · 快速开通</span>
          </div>
          <div class="space-y-1">
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Plus 兑换码自助订阅</h1>
            <p class="text-sm text-muted-foreground sm:text-base">输入兑换码后下一步粘贴参数，即可完成自助订阅。</p>
          </div>
        </div>

        <!-- 步骤指示 -->
        <div class="flex flex-row flex-wrap items-center justify-center gap-3 text-sm font-medium text-muted-foreground sm:gap-4">
          <div class="flex items-center gap-2">
            <Badge variant="outline" class="rounded-full px-2 py-0.5 text-xs">1</Badge>
            <span>验证卡密</span>
          </div>
          <div class="w-12 sm:w-20">
            <Separator class="mx-auto" />
          </div>
          <div class="flex items-center gap-2 text-muted-foreground/80">
            <Badge variant="outline" class="rounded-full px-2 py-0.5 text-xs">2</Badge>
            <span>粘贴参数</span>
          </div>
        </div>

        <!-- 输入与按钮 -->
        <div class="mx-auto w-full sm:w-[420px] space-y-4">
          <label class="text-sm font-medium flex items-center gap-2">
            <KeyRound class="h-4 w-4 text-muted-foreground" />
            兑换码
          </label>
          <Input
            v-model="code"
            placeholder="请输入卡密（例如：ABCD-EFGH-IJKL-MNOP）"
            class="h-11 text-sm"
          />

          <div class="pt-2 sm:pt-4 flex justify-center">
            <Button
              class="h-11 w-full sm:w-auto px-8 text-sm font-medium inline-flex items-center gap-2"
              type="button"
              @click="handleSubmit"
            >
              <ShieldCheck class="h-4 w-4" />
              下一步
              <ArrowRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { KeyRound, ArrowRight, ShieldCheck } from "lucide-vue-next";

const code = ref("");
const router = useRouter();

const handleSubmit = () => {
  const card = (code.value || "").trim();
  router.push({ path: "/plus-subscription", query: { card } });
};
</script>
