<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const cardCode = ref("");
</script>

<template>
  <main
    class="min-h-screen bg-[linear-gradient(180deg,#d9e6f5_0%,#d4e0f0_100%)] px-4 py-8 sm:px-6"
  >
    <div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
      <section
        class="w-full max-w-[580px] rounded-[22px] bg-white px-8 py-12 shadow-[0_20px_50px_rgba(90,118,152,0.2)] sm:px-14 sm:py-16"
      >
        <div class="space-y-10">
          <header class="text-center">
            <h1 class="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              卡密自助充值
            </h1>
          </header>

          <div class="space-y-5">
            <label for="card-code" class="block text-2xl font-medium text-slate-800">
              请输入充值卡密
            </label>
            <Input
              id="card-code"
              v-model="cardCode"
              class="h-[76px] rounded-[14px] border-2 border-slate-900 bg-white px-6 text-xl shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              autocomplete="off"
            />
          </div>

          <Button
            class="h-[74px] w-full rounded-[14px] bg-emerald-400 text-2xl font-bold text-white shadow-none hover:bg-emerald-500"
          >
            验证卡密
          </Button>
        </div>
      </section>
    </div>
  </main>
</template>
