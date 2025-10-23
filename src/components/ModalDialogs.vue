<template>
  <div>
    <TransitionRoot as="template" :show="State">
      <Dialog class="relative z-10">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to=""
          leave="ease-in duration-200" leave-from="" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to=" translate-y-0 sm:scale-100"
              leave="ease-in duration-200" leave-from=" translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="mb-6 text-center">
                  <h4 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">请再次确认提交信息</h4>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">确认后将提交审核，信息不可修改。</p>
                </div>
                <div
                  className="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-5 text-[15px] dark:border-gray-700 dark:bg-gray-800">
                  <p className="flex items-start justify-between gap-4"><span
                      className="text-gray-500 dark:text-gray-400">您的邮箱：</span><span
                      className="font-medium break-all text-gray-900 dark:text-gray-100">{{ Email }}</span></p>
                  <p className="flex items-start justify-between gap-4"><span
                      className="text-gray-500 dark:text-gray-400">兑换卡密：</span><span
                      className="font-medium break-all text-gray-900 dark:text-gray-100">{{ Card }}</span></p>
                  <p className="flex items-start justify-between gap-4"><span
                      className="text-gray-500 dark:text-gray-400">质保时限：</span><span
                      className="font-medium break-all text-gray-900 dark:text-gray-100">{{ Time }}/天</span></p>
                </div>
                <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">温馨提示：若信息有误，请点击“返回修改”。</p>


                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    @click="ButtonCik(true)">确认无误</button>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="ButtonCik(false)" ref="cancelButtonRef">返回修改</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

defineProps({
  State:{
    type:Boolean,
    default:false
  },
  Card:{
    type:String,
    default:''
  },
  Email:{
    type:String,
    default:''
  },
  Time:{
    type:Number,
    default:0
  }
})
const emit = defineEmits(['btn'])
const ButtonCik = (Tm)=>{
  emit('btn',Tm)
}

</script>