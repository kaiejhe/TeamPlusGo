<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const cardCode = ref("");
</script>

<template>
  <main
    class="min-h-screen bg-[linear-gradient(180deg,#dce8f6_0%,#d5e2f2_100%)] px-4 py-6 sm:px-6 sm:py-10"
  >
    <div
      class="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center sm:min-h-[calc(100vh-5rem)]"
    >
      <section
        class="w-full max-w-[520px] rounded-[24px] border border-white/70 bg-white px-7 py-9 shadow-[0_18px_44px_rgba(90,118,152,0.16)] sm:px-10 sm:py-11"
      >
        <div class="space-y-7">
          <header class="text-center">
            <h1
              class="text-[clamp(2.1rem,4vw,3.1rem)] font-black leading-none tracking-[-0.045em] text-slate-950"
            >
              卡密自助充值
            </h1>
          </header>

          <div class="space-y-3.5">
            <label
              for="card-code"
              class="block text-[1.2rem] font-medium leading-none text-slate-800 sm:text-[1.55rem]"
            >
              请输入充值卡密
            </label>
            <Input
              id="card-code"
              v-model="cardCode"
              class="h-[64px] rounded-[14px] border-2 border-slate-900 bg-white px-5 text-[1.05rem] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-[68px] sm:px-6 sm:text-[1.15rem]"
              autocomplete="off"
            />
          </div>

          <Button
            class="h-[62px] w-full rounded-[14px] bg-emerald-400 text-[1.22rem] font-bold tracking-[0.01em] text-white shadow-none hover:bg-emerald-500 sm:h-[66px] sm:text-[1.4rem]"
          >
            验证卡密
          </Button>
        </div>
      </section>
    </div>
  </main>
</template>
