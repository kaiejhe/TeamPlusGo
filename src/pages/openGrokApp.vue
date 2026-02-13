<template>
  <main class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="w-full max-w-md">
      <div class="rounded-[var(--radius-xl)] border border-border bg-card shadow-lg px-6 py-8 text-center">
        <h1 class="text-2xl font-semibold text-foreground">Grok Login</h1>
        <p class="mt-2 text-sm text-muted-foreground">
          输入 Token 后选择类型，再点击对应按钮进行上号
        </p>
        <div class="mt-6 space-y-2 text-left">
          <label class="text-sm font-medium text-foreground" for="session-token">
            Token
          </label>
          <Textarea
            id="session-token"
            v-model="sessionToken"
            placeholder="请输入 Token"
            class="min-h-[120px] rounded-[var(--radius-xl)]"
            spellcheck="false"
          />
        </div>
        <div class="mt-4 space-y-2 text-left">
          <label class="text-sm font-medium text-foreground" for="type-select">
            类型选择
          </label>
          <select
            id="type-select"
            v-model="selectedType"
            class="h-11 w-full rounded-[var(--radius-xl)] border border-input bg-background px-3 text-sm"
          >
            <option value="Tmsso">接口一</option>
            <option value="Yrsso">接口二</option>
          </select>
        </div>
        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            class="h-11 rounded-[var(--radius-xl)]"
            :disabled="!sessionToken.trim()"
            @click="openAndroid"
          >
            Android 上号
          </Button>
          <Button
            variant="outline"
            class="h-11 rounded-[var(--radius-xl)]"
            :disabled="!sessionToken.trim() || submittingIos"
            @click="openIos"
          >
            {{ submittingIos ? "提交中..." : "IOS 上号" }}
          </Button>
        </div>
        <p v-if="statusMessage" class="mt-4 text-sm text-muted-foreground">
          {{ statusMessage }}
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ref } from "vue";

const sessionToken = ref("");
const selectedType = ref<"Tmsso" | "Yrsso">("Tmsso");
const submittingIos = ref(false);
const statusMessage = ref("");

const openAndroid = () => {
  const value = sessionToken.value.trim();
  if (!value) return;
  const deeplink = `com.grokapp://login?sessionCookie=${encodeURIComponent(value)}`;
  window.location.href = deeplink;
};

const openIos = async () => {
  const value = sessionToken.value.trim();
  if (!value || submittingIos.value) return;
  submittingIos.value = true;
  statusMessage.value = "";
  try {
    const response = await fetch("https://plusapi.jieka5456.workers.dev/b/Home/HomeSso", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        Type: selectedType.value,
        Token: value,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && data?.Code === 200) {
      statusMessage.value = "IOS 上号成功";
    } else {
      statusMessage.value = data?.Msg || data?.Message || "IOS 上号失败";
    }
  } catch (error) {
    statusMessage.value = error instanceof Error ? error.message : "请求异常，请稍后再试";
  } finally {
    submittingIos.value = false;
  }
};
</script>


