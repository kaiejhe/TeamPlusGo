<template>
  <main class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="w-full max-w-md">
      <div class="rounded-[var(--radius-xl)] border border-border bg-card shadow-lg px-6 py-8 text-center">
        <h1 class="text-2xl font-semibold text-foreground">打开 Grok App</h1>
        <p class="mt-2 text-sm text-muted-foreground">
          点击按钮将尝试打开 App 登录页面。
        </p>
        <Button class="mt-6 w-full h-11 rounded-[var(--radius-xl)]" @click="openApp">
          打开 Grok
        </Button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";

const GROK_DEEPLINK =
  "com.grokapp://login?sessionCookie=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uX2lkIjoiNjQ4MGZhNTctZjU5Ni00YTY3LWI5MzctODQ5YmQ0NGI0M2NjIn0.pBv_WPEMErq-GveW2ivSf_wJnVNgxYzl4dY6O1LYQ08";

const openApp = () => {
  window.location.href = GROK_DEEPLINK;
};
</script>
