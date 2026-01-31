<template>
  <main class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="w-full max-w-md">
      <div class="rounded-[var(--radius-xl)] border border-border bg-card shadow-lg px-6 py-8 text-center">
        <h1 class="text-2xl font-semibold text-foreground">打开 Grok App</h1>
        <p class="mt-2 text-sm text-muted-foreground">
          输入 sessionCookie 后点击按钮将尝试打开 App 登录页面。
        </p>
        <div class="mt-6 space-y-2 text-left">
          <label class="text-sm font-medium text-foreground" for="session-cookie">
            sessionCookie
          </label>
          <Input
            id="session-cookie"
            v-model="sessionCookie"
            placeholder="请输入 sessionCookie"
            class="h-11 rounded-[var(--radius-xl)]"
            autocomplete="off"
          />
        </div>
        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            class="h-11 rounded-[var(--radius-xl)]"
            :disabled="!sessionCookie.trim()"
            @click="openApp('android')"
          >
            打开 Android
          </Button>
          <Button
            variant="outline"
            class="h-11 rounded-[var(--radius-xl)]"
            :disabled="!sessionCookie.trim()"
            @click="openApp('ios')"
          >
            打开 iOS
          </Button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ref } from "vue";

const sessionCookie = ref("");

const openApp = (_platform: "android" | "ios") => {
  const value = sessionCookie.value.trim();
  if (!value) return;
  const deeplink = `com.grokapp://login?sessionCookie=${encodeURIComponent(value)}`;
  window.location.href = deeplink;
};
</script>
