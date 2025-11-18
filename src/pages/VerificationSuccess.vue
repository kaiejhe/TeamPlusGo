<template>
  <main class="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 sm:py-16">
    <ConfirmDialog
      :open="confirmDialogState.open"
      :card="confirmDialogState.card"
      :email="confirmDialogState.email"
      :after-sales="confirmDialogState.afterSales ?? undefined"
      @confirm="handleConfirmDialog(true)"
      @cancel="handleConfirmDialog(false)"
    />
    <Dialog :open="sendInviteConfirmOpen" @update:open="sendInviteConfirmOpen = $event">
      <DialogContent class="sm:max-w-[420px] space-y-4">
        <DialogHeader class="space-y-1.5 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck class="h-5 w-5" />
          </div>
          <DialogTitle>确认发送邀请</DialogTitle>
          <DialogDescription>确认后将重新发送团队邀请邮件。</DialogDescription>
        </DialogHeader>
        <div class="rounded-[var(--radius-xl)] border border-border bg-muted/30 px-4 py-4 text-sm text-foreground space-y-3">
          <div class="flex items-center justify-between gap-3">
            <span class="text-muted-foreground">团队状态</span>
            <span class="font-medium text-right" :class="orderStateDisplay.class">{{ orderStateDisplay.label }}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-muted-foreground">绑定邮箱</span>
            <span class="font-medium break-all text-right">{{ displayedEmail }}</span>
          </div>
        </div>
        <DialogFooter class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" class="sm:min-w-[120px]" @click="handleSendInviteCancel" :disabled="sendingInvite">
            返回
          </Button>
          <Button class="sm:min-w-[120px]" @click="handleSendInviteConfirm" :disabled="sendingInvite">
            确认发送
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <Dialog :open="switchTeamConfirmOpen" @update:open="switchTeamConfirmOpen = $event">
      <DialogContent class="sm:max-w-[420px] space-y-4">
        <DialogHeader class="space-y-1.5 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound class="h-5 w-5" />
          </div>
          <DialogTitle>确认更换团队</DialogTitle>
          <DialogDescription>更换后需重新发送邀请，是否继续？</DialogDescription>
        </DialogHeader>
        <div class="rounded-[var(--radius-xl)] border border-border bg-muted/30 px-4 py-4 text-sm text-foreground space-y-3">
          <div class="flex items-center justify-between gap-3">
            <span class="text-muted-foreground">团队状态</span>
            <span class="font-medium text-right" :class="orderStateDisplay.class">{{ orderStateDisplay.label }}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-muted-foreground">团队编号</span>
            <span class="font-medium break-all text-right">{{ teamIdMasked }}</span>
          </div>
        </div>
        <DialogFooter class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" class="sm:min-w-[120px]" @click="handleSwitchTeamCancel" :disabled="switchingTeam">
            返回
          </Button>
          <Button class="sm:min-w-[120px]" @click="handleSwitchTeamConfirm" :disabled="switchingTeam">
            确认更换
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <div v-if="isTeamFlow" class="mx-auto w-full max-w-lg">
      <Card class="w-full rounded-[var(--radius-xl)] border border-border bg-card shadow-lg">
        <CardHeader class="space-y-4 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ShieldCheck class="h-8 w-8" />
          </div>
          <div class="space-y-1">
            <CardTitle class="text-2xl font-semibold text-foreground">兑换成功</CardTitle>
            <CardDescription class="text-sm text-muted-foreground">
              {{ successHint }}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="rounded-[var(--radius-xl)] border border-border bg-muted/40 px-4 py-4 text-sm text-foreground">
            <dl class="space-y-3">
              <div class="flex items-center justify-between gap-3">
                <dt class="text-muted-foreground">兑换卡密</dt>
                <dd class="text-right font-medium text-foreground break-all">{{ cardKey || "—" }}</dd>
              </div>
              <div class="flex items-center justify-between gap-3">
                <dt class="text-muted-foreground">绑定邮箱</dt>
                <dd class="text-right font-medium text-foreground break-all">{{ displayedEmail }}</dd>
              </div>
              <div class="flex items-center justify-between gap-3">
                <dt class="text-muted-foreground">团队状态</dt>
                <dd class="text-right text-sm font-semibold" :class="orderStateDisplay.class">
                  {{ orderStateDisplay.label }}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-3">
                <dt class="text-muted-foreground">到期时间</dt>
                <dd class="text-right font-medium text-foreground">{{ expireDisplay }}</dd>
              </div>
              <div class="flex items-center justify-between gap-3">
                <dt class="text-muted-foreground">团队编号</dt>
                <dd class="flex items-center justify-end gap-2 text-right font-medium text-foreground break-all">
                  <span>{{ teamIdMasked }}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 text-muted-foreground hover:text-primary"
                    @click="copyTeamId"
                    :disabled="!teamIdRaw"
                  >
                    <Copy class="h-4 w-4" />
                  </Button>
                </dd>
              </div>
            </dl>
          </div>

          <div class="rounded-[var(--radius-xl)] bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground space-y-1.5">
            <p>· 发送邀请后,网页刷新即可,App需要重新登录</p>
            <p>· 若团队被封,可点击更换团队后重新发送邀请</p>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2 sm:flex-row">
              <Button class="flex-1 min-w-[140px]" @click="handleSendInviteClick" :disabled="!orderInfo || sendingInvite">
                重新发送邀请邮件
              </Button>
              <Button
                variant="outline"
                class="flex-1 min-w-[140px]"
                @click="handleSwitchTeamClick"
                :disabled="switchingTeam"
              >
                更换团队
              </Button>
            </div>
            <Button variant="outline" class="w-full" disabled>
              卡密续费（暂未开放）
            </Button>
            <button
              type="button"
              class="mt-1 text-center text-[11px] text-muted-foreground underline-offset-2 hover:underline"
              @click="goBack"
            >
              继续兑换其他卡密
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
    <div v-else class="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header class="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div class="flex items-center gap-2">
            <Button variant="ghost" size="icon" class="hidden sm:inline-flex" @click="goBack">
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <span class="text-sm font-semibold text-slate-900 sm:text-base">拼单平台 · 成品账号</span>
            <Badge variant="outline" class="hidden sm:inline-flex gap-1 text-xs sm:text-sm">
              <ShieldCheck class="h-3.5 w-3.5" />
              UI 预览
            </Badge>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <Badge variant="outline" class="inline-flex items-center gap-1 text-xs sm:text-sm">
              <ShieldCheck class="h-3.5 w-3.5" />
              当前类型：{{ cardTypeLabel }}
            </Badge>
            <Button variant="outline" size="sm" class="h-9 gap-2 text-xs text-slate-600 sm:text-sm" @click="handlePlusToggleStatus">
              <RefreshCw class="h-4 w-4" />
              切换状态：{{ plusStatusLabel }}
            </Button>
            <Button variant="ghost" size="sm" class="flex h-9 items-center gap-2 text-xs text-slate-600 sm:text-sm" @click="goBack">
              <ChevronLeft class="h-4 w-4" />
              返回首页
            </Button>
          </div>
        </div>
      </header>

      <div class="mx-auto w-full max-w-6xl space-y-6 px-4 pb-12 pt-6 sm:space-y-8 sm:px-6 sm:pb-16 sm:pt-10">
        <div class="space-y-2 sm:space-y-3">
          <h2 class="text-xl font-semibold text-slate-900 sm:text-2xl">成品账号管理面板</h2>
          <p class="text-sm text-slate-600 sm:text-base">
            在这里校验兑换码、领取账号，并管理验证码邮箱。
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <div class="space-y-6">
            <Card class="shadow-sm">
              <CardHeader class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle class="text-base sm:text-lg">兑换码信息</CardTitle>
                  <CardDescription>展示核心字段，完整卡密仅会在确认弹窗中短暂明文显示。</CardDescription>
                </div>
                <Badge :variant="plusStatus.value === 'used' ? 'secondary' : 'default'" class="gap-1">
                  <KeyRound class="h-3.5 w-3.5" />
                  {{ plusStatusLabel }}
                </Badge>
              </CardHeader>
              <CardContent>
                <div class="grid gap-4 md:grid-cols-2">
                  <div class="space-y-3 rounded-xl border p-4">
                    <div class="flex items-center justify-between text-sm sm:text-base">
                      <span class="text-muted-foreground">兑换码</span>
                      <span class="font-mono text-sm sm:text-base">{{ maskCode(cardKey) }}</span>
                    </div>
                    <Separator />
                    <div class="flex items-center justify-between text-sm sm:text-base">
                      <span class="text-muted-foreground">创建时间</span>
                      <span>{{ cardInfo?.AddTime ? formatTimestamp(cardInfo.AddTime) : "—" }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm sm:text-base">
                      <span class="text-muted-foreground">使用时间</span>
                      <span>{{ plusStatus.value === "used" ? formatTimestamp(storedState.value?.verifiedAt ?? Date.now()) : "—" }}</span>
                    </div>
                  </div>
                  <div class="space-y-2 rounded-xl border bg-muted/40 p-4">
                    <div class="text-sm font-medium text-slate-900 sm:text-base">使用说明</div>
                    <ul class="list-disc space-y-1 pl-5 text-sm text-muted-foreground sm:text-base sm:leading-relaxed">
                      <li>未使用：点击下方按钮即可领取一个成品账号</li>
                      <li>已使用：展示已领取账号的登录凭证</li>
                      <li>账号密码仅支持一次性明文查看，之后将自动遮罩</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

          <Card v-if="plusStatus.value === 'unused'" class="border border-dashed">
            <CardHeader>
              <CardTitle class="text-base sm:text-lg">暂无账号</CardTitle>
              <CardDescription>该兑换码尚未使用，点击下方按钮即可分配一个 Plus 成品账号。</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" class="w-full gap-2 sm:w-auto" @click="plusClaimDialogOpen = true">
                <KeyRound class="h-4 w-4" />
                提取成品账号
              </Button>
            </CardContent>
          </Card>

          <Card v-else-if="plusAccount" class="shadow-md">
            <CardHeader class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle class="text-base sm:text-lg">领取的账号信息</CardTitle>
                <CardDescription>请尽快登录并及时修改密码，建议同时开启二次验证。</CardDescription>
              </div>
              <Badge variant="secondary" class="gap-1">
                <ShieldCheck class="h-3.5 w-3.5" />
                已分配
              </Badge>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="rounded-xl bg-muted/40 p-3">
                  <div class="mb-1 text-xs text-muted-foreground">登录邮箱/用户名</div>
                  <div class="flex items-center justify-between gap-2">
                    <div class="font-mono text-sm sm:text-base" :title="plusAccount.username">{{ plusAccount.username }}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="shrink-0"
                      @click="copyPlusValue(plusAccount.username, 'user')"
                    >
                      <CheckCircle v-if="plusCopying === 'user'" class="h-4 w-4" />
                      <Copy v-else class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div class="rounded-xl bg-muted/40 p-3">
                  <div class="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    密码
                    <Badge v-if="plusAccount.oneTimeView !== false && !plusOneTimeViewed" variant="outline">一次性查看</Badge>
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <div class="font-mono text-sm sm:text-base" :title="plusOneTimeViewed ? plusAccount.password : maskPassword(plusAccount.password)">
                      {{ plusOneTimeViewed ? plusAccount.password : maskPassword(plusAccount.password) }}
                    </div>
                    <Button
                      v-if="plusAccount.oneTimeView !== false && !plusOneTimeViewed"
                      size="sm"
                      class="gap-1"
                      @click="handlePlusRevealPassword"
                    >
                      <Eye class="h-4 w-4" />
                      一次性查看
                    </Button>
                    <Button
                      v-else
                      variant="ghost"
                      size="icon"
                      class="shrink-0"
                      @click="copyPlusValue(plusAccount.password, 'pass')"
                    >
                      <CheckCircle v-if="plusCopying === 'pass'" class="h-4 w-4" />
                      <Copy v-else class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Alert>
                <ShieldCheck class="h-4 w-4" />
                <AlertTitle>安全提示</AlertTitle>
                <AlertDescription>
                  建议在 5 分钟内完成改密、绑定二步验证，并妥善保管账号信息，不要转发给他人。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        <div class="space-y-5">
          <Card>
            <CardHeader class="space-y-1">
              <CardTitle class="flex items-center gap-2 text-base sm:text-lg">
                <Mail class="h-4 w-4" />
                邮箱查询入口
              </CardTitle>
              <CardDescription>登录验证码会发送到此专用收件箱，可随时刷新查看最新邮件。</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">收件箱地址</p>
                <p class="font-mono text-sm sm:text-base">
                  {{ plusMailbox || fallbackMailbox(getEffectiveCardKey()) }}
                </p>
              </div>
              <div class="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" class="w-full gap-2 sm:w-auto" @click="handlePlusOpenMailbox">
                  <Inbox class="h-4 w-4" />
                  打开收件箱
                </Button>
                <Button variant="ghost" class="w-full gap-2 sm:w-auto" @click="handlePlusRefreshInbox">
                  <RefreshCw class="h-4 w-4" />
                  刷新
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card class="h-full">
            <CardHeader class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle class="flex items-center gap-2 text-base sm:text-lg">
                  <Inbox class="h-4 w-4" />
                  最近邮件
                </CardTitle>
                <CardDescription>显示最近 5 封邮件，点击可查看完整内容和验证码。</CardDescription>
              </div>
              <Button variant="ghost" size="icon" class="self-start sm:self-auto" @click="handlePlusRefreshInbox">
                <RefreshCw class="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div class="-mx-4 overflow-x-auto sm:mx-0">
                <Table class="min-w-[520px] sm:min-w-0">
                  <TableHeader>
                    <TableRow>
                      <TableHead>发件人</TableHead>
                      <TableHead>主题</TableHead>
                      <TableHead class="w-[140px]">时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow
                      v-for="mail in plusRecentMails"
                      :key="mail.id"
                      class="cursor-pointer hover:bg-muted/50"
                      @click="handlePlusOpenMailDetail(mail)"
                    >
                      <TableCell class="text-sm">{{ mail.from }}</TableCell>
                      <TableCell class="text-sm truncate" :title="`${mail.subject} — ${mail.snippet}`">
                        <span class="font-medium">{{ mail.subject }}</span>
                        <span class="text-muted-foreground"> — {{ mail.snippet.slice(0, 48) }}...</span>
                      </TableCell>
                      <TableCell class="text-xs text-muted-foreground whitespace-nowrap">
                        {{ formatMailTimestamp(mail.timestamp) }}
                      </TableCell>
                    </TableRow>
                    <TableRow v-if="!plusRecentMails.length">
                      <TableCell colspan="3" class="py-6 text-center text-sm text-muted-foreground">
                        暂无邮件记录
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>

<Dialog :open="plusClaimDialogOpen" @update:open="plusClaimDialogOpen = $event">
  <DialogContent>
    <DialogHeader>
      <DialogTitle>确认提取</DialogTitle>
      <DialogDescription>提取后将分配一个成品账号，密码仅支持一次性明文查看，请妥善保存。</DialogDescription>
    </DialogHeader>
    <div class="rounded-xl bg-muted/40 p-4 space-y-2">
      <div class="text-sm text-muted-foreground">兑换码</div>
      <div class="font-mono text-sm">{{ maskCode(cardKey) }}</div>
      <Alert class="mt-2">
        <ShieldAlert class="h-4 w-4" />
        <AlertTitle>不可撤销</AlertTitle>
        <AlertDescription>该操作提交后无法更换账号，确认继续吗？</AlertDescription>
      </Alert>
    </div>
    <DialogFooter>
      <Button variant="outline" @click="plusClaimDialogOpen = false">取消</Button>
      <Button class="gap-2" :disabled="plusClaimLoading" @click="handlePlusClaimConfirm">
        <Loader2 v-if="plusClaimLoading" class="h-4 w-4 animate-spin" />
        <ShieldCheck v-else class="h-4 w-4" />
        确认提取
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog :open="plusMailboxDialogOpen" @update:open="handlePlusMailboxDialogChange">
  <DialogContent class="sm:max-w-3xl max-w-[92vw]">
    <DialogHeader>
      <DialogTitle class="text-base flex items-center gap-2"><Inbox class="h-4 w-4" /> 收件箱</DialogTitle>
      <DialogDescription>点击一行以查看完整内容</DialogDescription>
    </DialogHeader>
    <div class="flex items-center justify-between mb-2">
      <div class="text-xs text-muted-foreground">显示最近 {{ plusMails.length }} 封邮件（示例数据）</div>
      <Button variant="ghost" size="sm" class="gap-1" @click="handlePlusRefreshInbox"><RefreshCw class="h-4 w-4" /> 刷新</Button>
    </div>
    <ScrollArea class="h-[420px] pr-2">
      <Table class="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead class="w-40">发件人</TableHead>
            <TableHead>主题/摘要</TableHead>
            <TableHead class="w-36">时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="mail in plusMails"
            :key="mail.id"
            class="hover:bg-muted/50 cursor-pointer"
            @click="handlePlusOpenMailDetail(mail)"
          >
            <TableCell class="text-sm w-40 truncate align-top">{{ mail.from }}</TableCell>
            <TableCell class="align-top">
              <div
                class="text-sm break-words"
                style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
                :title="`${mail.subject} — ${mail.snippet}`"
              >
                <span class="font-medium">{{ mail.subject }}</span>
                <span class="text-muted-foreground"> — {{ mail.snippet }}</span>
              </div>
            </TableCell>
            <TableCell class="text-xs text-muted-foreground w-36 whitespace-nowrap align-top">{{ formatMailTimestamp(mail.timestamp) }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ScrollArea>
    <DialogFooter>
      <Button variant="outline" @click="plusMailboxDialogOpen = false">关闭</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog :open="plusMailDetailOpen" @update:open="plusMailDetailOpen = $event">
  <DialogContent class="max-w-2xl">
    <DialogHeader>
      <DialogTitle class="text-base">{{ plusSelectedMail?.subject ?? '邮件详情' }}</DialogTitle>
      <DialogDescription>
        发件人：{{ plusSelectedMail?.from ?? '—' }} · 时间：{{ plusSelectedMail ? formatMailTimestamp(plusSelectedMail.timestamp) : '—' }}
      </DialogDescription>
    </DialogHeader>
    <div v-if="plusSelectedMail" class="space-y-3">
      <Alert v-if="plusDetectedCode">
        <ShieldCheck class="h-4 w-4" />
        <AlertTitle>识别到验证码</AlertTitle>
        <AlertDescription class="font-mono text-base">{{ plusDetectedCode }}</AlertDescription>
      </Alert>
      <div class="rounded-xl border bg-muted/30 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {{ plusSelectedMail.snippet }}
      </div>
    </div>
    <div v-else class="text-sm text-muted-foreground">未选择邮件</div>
    <DialogFooter>
      <Button variant="outline" @click="plusMailDetailOpen = false">关闭</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, CheckCircle, ChevronLeft, Copy, Eye, Inbox, KeyRound, Loader2, Mail, MailCheck, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-vue-next";
import { toast } from "@/components/ui/toast";
import { Card as requestCard } from "../apijs/uts";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

type CardType = "Team" | "Plus" | "PlusIOS";

type InviteRecord = {
  email: string;
  timestamp: number;
  type: string;
  message?: string;
  teamId?: string;
};

type CardInfo = {
  id: number;
  TeamCard: string;
  TeamCardState: string;
  AfterSales: number;
  AddTime: number;
  UpdTime: number | null;
  TeamType?: CardType | string;
};

type OrderInfo = {
  id: number;
  OrderTeamID: string;
  Order_us_Email: string;
  AfterSales: number;
  TeamOrderState: string;
  TeamCard: string;
  AddTime: number;
  UpdTime: number | null;
  Content?: string;
};

type StoredCardState = {
  card: string;
  verifiedAt: number;
  email?: string;
  inviteCount: number;
  history: InviteRecord[];
  cardInfo?: CardInfo | null;
  orderInfo?: OrderInfo | null;
  teamType?: CardType;
  plus?: StoredPlusState;
};

type NormalizePayloadContext = {
  card: string;
  email: string;
  message?: string;
  previousOrder: OrderInfo | null;
  previousCard: CardInfo | null;
};

type NormalizedEntities = {
  order: OrderInfo | null;
  card: CardInfo | null;
};

type ConfirmationRequest = {
  card: string;
  email: string;
  afterSales: number | null;
};

type PlusStatus = "unused" | "used";

type PlusMailItem = {
  id: string;
  from: string;
  subject: string;
  timestamp: number;
  snippet: string;
};

type PlusAccountInfo = {
  username: string;
  password: string;
  oneTimeView?: boolean;
};

type StoredPlusState = {
  status: PlusStatus;
  mailbox: string;
  account?: PlusAccountInfo | null;
  mails?: PlusMailItem[];
};

type StatusKey = "unused" | "used" | "locked";

const STATUS_META: Record<
  StatusKey,
  {
    label: string;
    description: string;
    badgeVariant: "default" | "secondary" | "destructive";
    title: string;
    hint: string;
  }
> = {
  unused: {
    label: "未使用",
    description: "卡密可用，请登记邮箱完成绑定。",
    badgeVariant: "secondary",
    title: "待绑定邮箱",
    hint: "填写收件邮箱，系统会自动发送邀请邮件。",
  },
  used: {
    label: "已使用",
    description: "",
    badgeVariant: "default",
    title: "已绑定订单",
    hint: "",
  },
  locked: {
    label: "已锁定",
    description: "卡密暂不可用，如需解锁请联系管理员或客服。",
    badgeVariant: "destructive",
    title: "卡密已锁定",
    hint: "",
  },
};

const ORDER_STATE_META: Record<string, { label: string; class: string }> = {
  o1: { label: "等待发送邀请", class: "text-amber-600" },
  o2: { label: "已发送邀请", class: "text-emerald-600" },
  o3: { label: "已到期", class: "text-slate-500" },
  o4: { label: "已停用", class: "text-destructive" },
  default: { label: "未同步", class: "text-foreground" },
};

const ORDER_STATUS_META: Record<string, { label: string; className: string }> = {
  default: {
    label: "未知",
    className: "bg-slate-100 text-slate-600",
  },
  o1: {
    label: "待发送",
    className: "bg-amber-100 text-amber-700",
  },
  o2: {
    label: "已送达",
    className: "bg-emerald-100 text-emerald-700",
  },
  o3: {
    label: "已过期",
    className: "bg-slate-100 text-slate-600",
  },
  o4: {
    label: "已停用",
    className: "bg-rose-100 text-rose-700",
  },
};

const STORAGE_KEY = "team-verified-card";

const route = useRoute();
const router = useRouter();

const storedState = ref<StoredCardState | null>(null);
const teamEmail = ref("");
const submitting = ref(false);
const submitted = ref(false);
const emailError = ref<string | null>(null);
const emailSuccess = ref<string | null>(null);
const lastVerified = ref<number | null>(null);
const sendingInvite = ref(false);
const switchingTeam = ref(false);
const confirmDialogState = reactive<{
  open: boolean;
  card: string;
  email: string;
  afterSales: number | null;
}>({
  open: false,
  card: "",
  email: "",
  afterSales: null,
});
const sendInviteConfirmOpen = ref(false);
const pendingInviteOrder = ref<OrderInfo | null>(null);
const switchTeamConfirmOpen = ref(false);
const pendingSwitchOrder = ref<OrderInfo | null>(null);

let resolveConfirmation: ((result: boolean) => void) | null = null;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;

const resolveCardType = (value: unknown): CardType => {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized === "Plus" || normalized === "PlusIOS") {
    return normalized;
  }
  return "Team";
};

const cardInfo = computed(() => storedState.value?.cardInfo ?? null);
const orderInfo = computed(() => storedState.value?.orderInfo ?? null);
const cardType = computed<CardType>(() => {
  const state = storedState.value;
  if (state) {
    const fromState = state.teamType ?? state.cardInfo?.TeamType;
    if (fromState) {
      return resolveCardType(fromState);
    }
  }
  const queryType = typeof route.query.type === "string" ? route.query.type : undefined;
  return resolveCardType(cardInfo.value?.TeamType ?? queryType);
});
const isTeamFlow = computed(() => cardType.value === "Team");
const isPlusFlow = computed(() => cardType.value === "Plus" || cardType.value === "PlusIOS");
const cardTypeLabel = computed(() => {
  if (cardType.value === "PlusIOS") {
    return "Plus 代订阅";
  }
  if (cardType.value === "Plus") {
    return "Plus 成品号";
  }
  return "Team 团队邀请";
});
const statusKey = computed<StatusKey>(() => deriveStatus(cardInfo.value, orderInfo.value));
const statusMeta = computed(() => STATUS_META[statusKey.value] ?? STATUS_META.unused);
const successHint = computed(
  () => statusMeta.value.description || "兑换卡密已绑定到您的团队，请留意绑定邮箱的通知。",
);
const orderStateDisplay = computed(() => {
  const state = (orderInfo.value?.TeamOrderState ?? "").toLowerCase();
  return ORDER_STATE_META[state] ?? ORDER_STATE_META.default;
});
const afterSalesDays = computed(() => {
  const orderDays = toPositiveInt(orderInfo.value?.AfterSales);
  if (orderDays !== null) {
    return orderDays;
  }
  const cardDays = toPositiveInt(cardInfo.value?.AfterSales);
  if (cardDays !== null) {
    return cardDays;
  }
  return null;
});
const displayedEmail = computed(
  () => orderInfo.value?.Order_us_Email ?? storedState.value?.email ?? "—",
);
const expireDisplay = computed(() => {
  const candidate = orderInfo.value?.UpdTime ?? cardInfo.value?.UpdTime ?? storedState.value?.verifiedAt ?? null;
  return formatTimestamp(candidate);
});
const teamIdRaw = computed(
  () => orderInfo.value?.OrderTeamID ?? orderInfo.value?.TeamCard ?? storedState.value?.card ?? "",
);
const teamIdMasked = computed(() => maskIdentifier(teamIdRaw.value));
const orderStateCode = computed(() => (orderInfo.value?.TeamOrderState ?? "").toLowerCase());
const canSwitchTeam = computed(() => {
  if (!orderInfo.value) return false;
  const state = (orderInfo.value.TeamOrderState ?? "").toLowerCase();
  return state === "o4";
});
const lastVerifiedDisplay = computed(() => {
  if (!lastVerified.value) {
    return "δ����";
  }
  return new Date(lastVerified.value).toLocaleString("zh-CN", { hour12: false });
});
const plusStatus = ref<PlusStatus>("unused");
const plusAccount = ref<PlusAccountInfo | null>(null);
const plusMailbox = ref("");
const plusMails = ref<PlusMailItem[]>([]);
const plusOneTimeViewed = ref(false);
const plusClaimDialogOpen = ref(false);
const plusClaimLoading = ref(false);
const plusMailboxDialogOpen = ref(false);
const plusMailDetailOpen = ref(false);
const plusSelectedMail = ref<PlusMailItem | null>(null);
const plusCopying = ref<"user" | "pass" | null>(null);

const plusStatusLabel = computed(() => (plusStatus.value === "used" ? "已使用" : "未使用"));
const plusRecentMails = computed(() => plusMails.value.slice(0, 5));
const plusDetectedCode = computed(() => {
  const snippet = plusSelectedMail.value?.snippet ?? "";
  const match = snippet.match(/\b(\d{6})\b/);
  return match ? match[1] : "";
});

const fallbackMailbox = (card: string) => {
  const suffix = card.slice(-4) || "0000";
  return `inbox-${suffix}@yourmail.com`;
};

const maskCode = (code: string) => {
  if (!code) return "";
  const normalized = code.replace(/\s+/g, "").toUpperCase();
  return `${normalized.slice(0, 4)}-****-****-${normalized.slice(-4)}`;
};

const maskPassword = (pwd: string) => {
  if (!pwd) return "";
  if (pwd.length <= 2) {
    return "*".repeat(pwd.length || 2);
  }
  return `${pwd[0]}${"*".repeat(Math.max(2, pwd.length - 2))}${pwd[pwd.length - 1]}`;
};

function maskIdentifier(value: string) {
  if (!value) return "—";
  const trimmed = value.trim();
  if (trimmed.length <= 12) {
    const visible = Math.max(2, Math.floor(trimmed.length / 4));
    return `${trimmed.slice(0, visible)}****${trimmed.slice(-visible)}`;
  }
  return `${trimmed.slice(0, 6)}****${trimmed.slice(-6)}`;
}

const formatMailTimestamp = (value: number) => {
  if (!value) return "—";
  const normalized = value > 1e12 ? value : value * 1000;
  return new Date(normalized).toLocaleString("zh-CN", { hour12: false });
};

const createMockAccount = (card: string): PlusAccountInfo => {
  const suffix = card.slice(-4) || "0000";
  const prefix = card.slice(0, 2) || "AA";
  return {
    username: `user_${suffix}@example.com`,
    password: `P@ss${prefix}${suffix}!`,
    oneTimeView: true,
  };
};

const createMockMails = (card: string): PlusMailItem[] =>
  Array.from({ length: 10 }).map((_, index) => {
    const now = Math.floor(Date.now() / 1000);
    const isCode = index % 2 === 1;
    const code = 100000 + index * 137;
    return {
      id: `mock-mail-${index}`,
      from: isCode ? "no-reply@openai.com" : "security@mail.app",
      subject: isCode ? "Your verification code" : "Login attempt detected",
      timestamp: now - index * 900,
      snippet: isCode
        ? `Your one-time code is ${code}. It expires in 10 minutes.`
        : "If this wasn't you, please secure your account as soon as possible.",
    };
  });

const orderStatusMeta = computed(() => {
  if (!orderInfo.value?.TeamOrderState) {
    return ORDER_STATUS_META.default;
  }
  const key = orderInfo.value.TeamOrderState.toLowerCase();
  return ORDER_STATUS_META[key] ?? ORDER_STATUS_META.default;
});

const cardKey = computed(() => {
  if (storedState.value?.card) return storedState.value.card;
  const queryCard = typeof route.query.card === "string" ? route.query.card.trim() : "";
  return queryCard;
});
const getEffectiveCardKey = () => cardKey.value || storedState.value?.card || "";

watch(
  () => ({
    active: isPlusFlow.value,
    card: getEffectiveCardKey(),
    plus: storedState.value?.plus,
  }),
  ({ active, card, plus }) => {
    if (!active) {
      return;
    }
    plusMailbox.value = plus?.mailbox ?? fallbackMailbox(card);
    plusStatus.value = plus?.status ?? (plus?.account ? "used" : "unused");
    if (plus?.account) {
      plusAccount.value = { ...plus.account };
      plusOneTimeViewed.value = plus.account.oneTimeView === false;
    } else if (plusStatus.value === "used") {
      plusAccount.value = createMockAccount(card);
      plusOneTimeViewed.value = false;
    } else {
      plusAccount.value = null;
      plusOneTimeViewed.value = false;
    }
    plusMails.value = plus?.mails && plus.mails.length ? [...plus.mails] : createMockMails(card);
  },
  { immediate: true }
);

watch(plusMailDetailOpen, (open) => {
  if (!open) {
    plusSelectedMail.value = null;
  }
});

const syncPlusState = () => {
  if (!storedState.value) {
    return;
  }
  const card = getEffectiveCardKey();
  storedState.value = {
    ...storedState.value,
    plus: {
      status: plusStatus.value,
      mailbox: plusMailbox.value || fallbackMailbox(card),
      account: plusAccount.value
        ? { ...plusAccount.value, oneTimeView: !plusOneTimeViewed.value }
        : null,
      mails: [...plusMails.value],
    },
  };
  persistState(storedState.value);
};

const handlePlusToggleStatus = () => {
  if (plusStatus.value === "unused") {
    plusStatus.value = "used";
    if (!plusAccount.value) {
      plusAccount.value = createMockAccount(getEffectiveCardKey());
    }
    plusOneTimeViewed.value = false;
  } else {
    plusStatus.value = "unused";
    plusAccount.value = null;
    plusOneTimeViewed.value = false;
  }
  syncPlusState();
};

const handlePlusClaimConfirm = async () => {
  plusClaimLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));
  plusClaimLoading.value = false;
  plusClaimDialogOpen.value = false;
  plusStatus.value = "used";
  plusAccount.value = createMockAccount(getEffectiveCardKey());
  plusOneTimeViewed.value = false;
  syncPlusState();
  toast.success("已分配成品账号");
};

const handlePlusRevealPassword = () => {
  plusOneTimeViewed.value = true;
  if (plusAccount.value) {
    plusAccount.value = { ...plusAccount.value, oneTimeView: false };
  }
  syncPlusState();
};

const copyPlusValue = async (text: string, key: "user" | "pass") => {
  if (!text) return;
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    toast.error("复制失败，请手动复制");
    return;
  }
  try {
    plusCopying.value = key;
    await navigator.clipboard.writeText(text);
    toast.success(key === "user" ? "已复制账号" : "已复制密码");
  } catch (error) {
    toast.error("复制失败");
  } finally {
    setTimeout(() => {
      plusCopying.value = null;
    }, 800);
  }
};

const handlePlusRefreshInbox = () => {
  plusMails.value = createMockMails(getEffectiveCardKey()).map((item, index) => ({
    ...item,
    timestamp: item.timestamp - index * 120,
  }));
  syncPlusState();
  toast.success("收件箱已刷新");
};

const handlePlusOpenMailbox = () => {
  plusMailboxDialogOpen.value = true;
};

const handlePlusMailboxDialogChange = (open: boolean) => {
  plusMailboxDialogOpen.value = open;
};

const handlePlusOpenMailDetail = (mail: PlusMailItem) => {
  plusSelectedMail.value = mail;
  plusMailDetailOpen.value = true;
};


const formatTimestamp = (value: number | null | undefined) => {
  if (!value || Number.isNaN(value)) return "—";
  const timestamp = value > 1e12 ? value : value * 1000;
  return new Date(timestamp).toLocaleString("zh-CN", { hour12: false });
};

function deriveStatus(card: CardInfo | null, order: OrderInfo | null): StatusKey {
  const code = (order?.TeamOrderState ?? card?.TeamCardState ?? "").toLowerCase();

  if (["lock", "locked", "o3", "freeze", "suspend"].includes(code)) {
    return "locked";
  }

  if (order) {
    return "used";
  }

  return "unused";
}

const loadState = (): StoredCardState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredCardState) : null;
  } catch (error) {
    console.warn("[VerificationSuccess] Failed to parse stored state:", error);
    return null;
  }
};

const persistState = (state: StoredCardState) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const clearStoredState = () => {
  storedState.value = null;
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(STORAGE_KEY);
  }
};

const requestEmailConfirmation = (payload: ConfirmationRequest) => {
  confirmDialogState.card = payload.card;
  confirmDialogState.email = payload.email;
  confirmDialogState.afterSales = payload.afterSales;
  confirmDialogState.open = true;

  return new Promise<boolean>((resolve) => {
    resolveConfirmation = resolve;
  });
};

const handleConfirmDialog = (confirmed: boolean) => {
  confirmDialogState.open = false;
  if (resolveConfirmation) {
    resolveConfirmation(confirmed);
    resolveConfirmation = null;
  }

  confirmDialogState.card = "";
  confirmDialogState.email = "";
  confirmDialogState.afterSales = null;
};

const handleEmailSubmit = async () => {
  if (statusKey.value !== "unused") {
    toast.error("当前卡密无需重新提交邮箱");
    return;
  }

  emailError.value = null;
  emailSuccess.value = null;

  if (!cardKey.value) {
    emailError.value = "缺少卡密信息，请返回首页重新验证。";
    toast.error(emailError.value);
    return;
  }

  if (!teamEmail.value) {
    emailError.value = "邮箱不能为空，请填写接收邀请的邮箱。";
    toast.error(emailError.value);
    return;
  }

  if (!EMAIL_REGEX.test(teamEmail.value)) {
    emailError.value = "邮箱格式不正确，请检查后再提交。";
    toast.error(emailError.value);
    return;
  }

  const confirmed = await requestEmailConfirmation({
    card: cardKey.value,
    email: teamEmail.value,
    afterSales: afterSalesDays.value,
  });

  if (!confirmed) {
    return;
  }

  submitting.value = true;
  const loadingId = toast.loading("正在创建订单...");

  try {
    const response = await requestCard({
      msgoogle: "TeamEmail",
      data: {
        Card: cardKey.value,
        Email: teamEmail.value,
      },
    });

    if (!response?.ok) {
      const errorMessage = response?.msg ?? "创建订单失败，请稍后再试或联系客服。";
      emailError.value = errorMessage;
      toast.error(errorMessage, { id: loadingId });
      return;
    }

    const { order: createdOrder, card: latestCard } = normalizeApiPayload(response?.data, {
      card: cardKey.value,
      email: teamEmail.value,
      message: response?.msg,
      previousOrder: storedState.value?.orderInfo ?? null,
      previousCard: storedState.value?.cardInfo ?? null,
    });

    if (!createdOrder) {
      const errorMessage = "返回数据缺少订单信息，请稍后再试或联系客服。";
      emailError.value = errorMessage;
      toast.error(errorMessage, { id: loadingId });
      return;
    }

    const successMessage = response?.msg ?? "订单创建成功，我们会尽快发送邀请。";
    toast.success(successMessage, { id: loadingId });
    emailSuccess.value = successMessage;
    submitted.value = true;

    const now = Date.now();
    const record: InviteRecord = {
      email: createdOrder.Order_us_Email ?? teamEmail.value,
      timestamp: now,
      type: "初次提交",
      message: successMessage,
      teamId: createdOrder.TeamCard ?? cardKey.value,
    };

    const nextState: StoredCardState = {
      card: cardKey.value,
      verifiedAt: storedState.value?.verifiedAt ?? now,
      email: createdOrder.Order_us_Email ?? teamEmail.value,
      inviteCount: (storedState.value?.inviteCount ?? 0) + 1,
      history: [record, ...(storedState.value?.history ?? [])],
      cardInfo: latestCard ?? storedState.value?.cardInfo ?? null,
      orderInfo: createdOrder,
      teamType: resolveCardType(latestCard?.TeamType ?? storedState.value?.teamType ?? storedState.value?.cardInfo?.TeamType),
    };

    storedState.value = nextState;
    persistState(nextState);

    await sendInvite({ order: createdOrder, silent: true });
  } catch (error) {
    const fallbackMessage =
      error instanceof Error ? error.message : "提交失败，请稍后再试或联系客服。";
    emailError.value = fallbackMessage;
    toast.error(fallbackMessage, { id: loadingId });
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  clearStoredState();
  teamEmail.value = "";
  router.push({ name: "Home" });
};

const handleSendInviteClick = () => {
  if (!orderInfo.value) {
    toast.error("当前卡密未绑定订单");
    return;
  }
  const state = orderStateCode.value;
  if (state === "o3") {
    toast.info("兑换码已过期，请续费");
    return;
  }
  if (state === "o4") {
    toast.info("当前团队已停用，请先更换团队");
    return;
  }
  if (state !== "o1" && state !== "o2") {
    toast.info("当前状态暂不支持发送邀请");
    return;
  }
  pendingInviteOrder.value = orderInfo.value;
  sendInviteConfirmOpen.value = true;
};

const handleSendInviteConfirm = () => {
  if (!pendingInviteOrder.value) {
    sendInviteConfirmOpen.value = false;
    return;
  }
  sendInviteConfirmOpen.value = false;
  sendInvite({ order: pendingInviteOrder.value });
  pendingInviteOrder.value = null;
};

const handleSendInviteCancel = () => {
  sendInviteConfirmOpen.value = false;
  pendingInviteOrder.value = null;
};

const handleSwitchTeamClick = () => {
  if (!orderInfo.value) {
    toast.error("当前卡密未绑定订单");
    return;
  }
  const state = orderStateCode.value;
  if (state === "o3") {
    toast.info("兑换码已过期，请续费");
    return;
  }
  if (state !== "o4") {
    toast.info("仅支持已停用的团队更换新的团队");
    return;
  }
  pendingSwitchOrder.value = orderInfo.value;
  switchTeamConfirmOpen.value = true;
};

const handleSwitchTeamConfirm = async () => {
  if (!pendingSwitchOrder.value) {
    switchTeamConfirmOpen.value = false;
    return;
  }
  switchTeamConfirmOpen.value = false;
  const orderId = Number(pendingSwitchOrder.value.id);
  pendingSwitchOrder.value = null;
  if (!Number.isFinite(orderId) || orderId <= 0) {
    toast.error("订单编号缺失，无法更换团队");
    return;
  }

  switchingTeam.value = true;
  const loadingId = toast.loading("正在更换团队...");
  try {
    const response = await requestCard({
      msgoogle: "GenghuanTeam",
      data: { id: orderId },
    });

    if (response?.ok) {
      toast.success(response.msg ?? "团队更换成功，请重新发起邀请", { id: loadingId });
      await refreshCardState();
    } else {
      toast.error(response?.msg ?? "更换团队失败，请稍后再试或联系客服。", { id: loadingId });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "更换团队时出现异常，请稍后再试或联系客服。";
    toast.error(message, { id: loadingId });
  } finally {
    switchingTeam.value = false;
  }
};

const handleSwitchTeamCancel = () => {
  switchTeamConfirmOpen.value = false;
  pendingSwitchOrder.value = null;
};

const sendInvite = async (options?: { order?: OrderInfo; silent?: boolean }) => {
  const targetOrder = options?.order ?? orderInfo.value;
  if (!targetOrder) {
    toast.error("当前卡密未绑定订单");
    return;
  }

  const orderId = Number(targetOrder.id);
  if (!Number.isFinite(orderId) || orderId <= 0) {
    toast.error("订单编号缺失，无法发送邀请");
    return;
  }

  if (sendingInvite.value) {
    return;
  }
  sendingInvite.value = true;
  const loadingId = options?.silent ? toast.loading("正在发送邀请...") : toast.loading("正在发送邀请...");
  try {
    const response = await requestCard({
      msgoogle: "GetTeamApi",
      data: { int: orderId },
    });
    if (response?.ok) {
      const successMessage = response.msg ?? "邀请发送成功。";
      toast.success(successMessage, { id: loadingId });
      const rawData = (response as unknown as { data?: unknown })?.data;
      const normalizedTarget: OrderInfo = { ...targetOrder, id: orderId };
      const { order: latestOrder, card: latestCard } = normalizeApiPayload(rawData, {
        card: cardKey.value,
        email: normalizedTarget.Order_us_Email ?? storedState.value?.email ?? "",
        message: successMessage,
        previousOrder: normalizedTarget,
        previousCard: storedState.value?.cardInfo ?? null,
      });

      const ensuredOrder: OrderInfo = {
        ...(latestOrder ?? normalizedTarget),
        TeamOrderState: "o2",
        UpdTime: ensureMilliseconds(Date.now()),
      };

      const nextState: StoredCardState = {
        card: cardKey.value,
        verifiedAt: Date.now(),
        email: ensuredOrder.Order_us_Email ?? storedState.value?.email ?? "",
        inviteCount: storedState.value?.inviteCount ?? 0,
        history: storedState.value?.history ?? [],
        cardInfo: latestCard ?? storedState.value?.cardInfo ?? null,
        orderInfo: ensuredOrder,
        teamType: resolveCardType(
          latestCard?.TeamType ?? storedState.value?.teamType ?? storedState.value?.cardInfo?.TeamType,
        ),
      };

      storedState.value = nextState;
      lastVerified.value = nextState.verifiedAt;
      teamEmail.value = nextState.email ?? teamEmail.value;
      persistState(nextState);

      if (!latestOrder) {
        await refreshCardState();
      }
    } else {
      toast.error(response?.msg ?? "邀请发送失败，请稍后再试或联系客服。", { id: loadingId });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "发送邀请失败，请稍后再试或联系客服。";
    toast.error(message, { id: loadingId });
  } finally {
    sendingInvite.value = false;
  }
};



function normalizeApiPayload(payload: unknown, context: NormalizePayloadContext): NormalizedEntities {
  const { order: rawOrder, card: rawCard } = splitPayloadEntities(payload);
  const order = normalizeOrderInfo(rawOrder, context);
  const card = normalizeCardInfo(rawCard, { cardKey: context.card, previous: context.previousCard });
  return {
    order,
    card,
  };
}

function splitPayloadEntities(payload: unknown): { order: unknown; card: unknown } {
  if (payload == null) {
    return { order: null, card: null };
  }

  if (typeof payload === "number" || typeof payload === "string") {
    return { order: payload, card: null };
  }

  if (typeof payload !== "object") {
    return { order: null, card: null };
  }

  const record = payload as Record<string, unknown>;

  if ("Order" in record || "order" in record || "Card" in record || "card" in record) {
    return {
      order: "Order" in record ? record.Order : "order" in record ? record.order : null,
      card: "Card" in record ? record.Card : "card" in record ? record.card : null,
    };
  }

  if ("data" in record && record.data && typeof record.data === "object") {
    return splitPayloadEntities(record.data);
  }

  return { order: record, card: null };
}

function normalizeOrderInfo(raw: unknown, context: NormalizePayloadContext): OrderInfo | null {
  const fallbackOrder = context.previousOrder ? { ...context.previousOrder } : null;
  const fallbackCard = context.previousCard ?? null;

  if (raw == null) {
    return fallbackOrder;
  }

  let record: Record<string, unknown>;
  if (typeof raw === "number" || typeof raw === "string") {
    record = { id: raw };
  } else if (typeof raw === "object") {
    record = raw as Record<string, unknown>;
  } else {
    return fallbackOrder;
  }

  const id =
    toPositiveInt(record.id) ??
    toPositiveInt(record.ID) ??
    toPositiveInt(record.orderId) ??
    toPositiveInt(record.order_id) ??
    toPositiveInt(record.int);

  if (!id) {
    return fallbackOrder;
  }

  const resolvedEmail =
    typeof record.Order_us_Email === "string" && record.Order_us_Email.trim()
      ? record.Order_us_Email.trim()
      : context.email || fallbackOrder?.Order_us_Email || "";

  const resolvedTeamCard =
    typeof record.TeamCard === "string" && record.TeamCard.trim()
      ? record.TeamCard.trim()
      : fallbackOrder?.TeamCard ?? context.card;

  const resolvedOrderTeamId =
    typeof record.OrderTeamID === "string" && record.OrderTeamID.trim()
      ? record.OrderTeamID.trim()
      : fallbackOrder?.OrderTeamID ?? resolvedTeamCard;

  const resolvedState =
    typeof record.TeamOrderState === "string" && record.TeamOrderState.trim()
      ? record.TeamOrderState.trim()
      : fallbackOrder?.TeamOrderState ?? "o1";

  const resolvedAfterSales =
    resolveNumber(record.AfterSales) ?? fallbackOrder?.AfterSales ?? fallbackCard?.AfterSales ?? 0;

  const resolvedContent =
    typeof record.Content === "string" && record.Content.trim()
      ? record.Content.trim()
      : fallbackOrder?.Content ?? context.message ?? "";

  const resolvedAddTime =
    resolveNumber(record.AddTime) ??
    resolveNumber((record as Record<string, unknown>).addTime) ??
    fallbackOrder?.AddTime ??
    fallbackCard?.AddTime ??
    Date.now();

  const resolvedUpdTime =
    resolveNumber(record.UpdTime) ??
    resolveNumber((record as Record<string, unknown>).updTime) ??
    Date.now();

  return {
    id,
    OrderTeamID: resolvedOrderTeamId,
    Order_us_Email: resolvedEmail,
    AfterSales: resolvedAfterSales,
    TeamOrderState: resolvedState,
    TeamCard: resolvedTeamCard,
    AddTime: ensureMilliseconds(resolvedAddTime),
    UpdTime: ensureMilliseconds(resolvedUpdTime),
    Content: resolvedContent,
  };
}

function normalizeCardInfo(
  raw: unknown,
  context: { cardKey: string; previous: CardInfo | null },
): CardInfo | null {
  const previous = context.previous ? { ...context.previous } : null;

  if (raw == null) {
    return previous;
  }

  if (typeof raw !== "object") {
    return previous;
  }

  const record = raw as Record<string, unknown>;

  const id =
    toPositiveInt(record.id) ??
    toPositiveInt(record.ID) ??
    toPositiveInt(record.cardId) ??
    toPositiveInt(record.card_id);

  if (!id) {
    return previous;
  }

  const resolvedTeamCard =
    typeof record.TeamCard === "string" && record.TeamCard.trim()
      ? record.TeamCard.trim()
      : previous?.TeamCard ?? context.cardKey;

  const resolvedState =
    typeof record.TeamCardState === "string" && record.TeamCardState.trim()
      ? record.TeamCardState.trim()
      : previous?.TeamCardState ?? "";

  const resolvedAfterSales =
    resolveNumber(record.AfterSales) ?? previous?.AfterSales ?? 0;

  const resolvedAddTime =
    resolveNumber(record.AddTime) ??
    resolveNumber((record as Record<string, unknown>).addTime) ??
    previous?.AddTime ??
    Date.now();

  const resolvedUpdTime =
    resolveNumber(record.UpdTime) ??
    resolveNumber((record as Record<string, unknown>).updTime) ??
    previous?.UpdTime ??
    Date.now();

  const resolvedTeamType =
    typeof record.TeamType === "string" && record.TeamType.trim()
      ? record.TeamType.trim()
      : previous?.TeamType ?? undefined;

  return {
    id,
    TeamCard: resolvedTeamCard,
    TeamCardState: resolvedState,
    AfterSales: resolvedAfterSales,
    AddTime: ensureMilliseconds(resolvedAddTime),
    UpdTime: ensureMilliseconds(resolvedUpdTime),
    TeamType: resolvedTeamType,
  };
}

function resolveNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function toPositiveInt(value: unknown): number | null {
  const numeric = resolveNumber(value);
  if (numeric === null) {
    return null;
  }
  const intValue = Math.trunc(numeric);
  return intValue > 0 ? intValue : null;
}

const optimizeMembers = () => {
  if (!orderInfo.value) {
    toast.error("当前卡密未绑定订单");
    return;
  }
  toast.info("当前功能暂未接入");
};

const openSupport = () => {
  router.push({ name: "Support" });
};
const copyTeamId = async () => {
  if (!teamIdRaw.value) return;
  try {
    await navigator.clipboard.writeText(teamIdRaw.value);
    toast.success("团队编号已复制");
  } catch (error) {
    toast.error("复制失败，请稍后重试");
  }
};

const refreshCardState = async () => {
  if (!cardKey.value) return;
  try {
    const response = await requestCard({
      msgoogle: "TeamCard",
      data: { Card: cardKey.value },
    });

    if (response?.ok) {
      const nextCardInfo = (response?.data?.Card as CardInfo | undefined) ?? cardInfo.value ?? null;
      const nextOrderInfo = (response?.data?.Order as OrderInfo | undefined) ?? orderInfo.value ?? null;

      const nextState: StoredCardState = {
        card: cardKey.value,
        verifiedAt: Date.now(),
        email:
          nextOrderInfo?.Order_us_Email ?? storedState.value?.email ?? teamEmail.value ?? "",
        inviteCount: storedState.value?.inviteCount ?? 0,
        history: storedState.value?.history ?? [],
        cardInfo: nextCardInfo,
        orderInfo: nextOrderInfo,
        teamType: resolveCardType(
          nextCardInfo?.TeamType ?? storedState.value?.teamType ?? storedState.value?.cardInfo?.TeamType
        ),
      };

      storedState.value = nextState;
      lastVerified.value = nextState.verifiedAt;
      if (nextOrderInfo?.Order_us_Email) {
        teamEmail.value = nextOrderInfo.Order_us_Email;
      }
      persistState(nextState);
    }
  } catch (error) {
    console.warn("[VerificationSuccess] failed to refresh card state", error);
  }
};

onMounted(() => {
  const existing = loadState();
  if (existing?.card) {
    storedState.value = existing;
    teamEmail.value = existing.email ?? existing.orderInfo?.Order_us_Email ?? "";
    submitted.value = Boolean(existing.email) || existing.inviteCount > 0;
    lastVerified.value = existing.verifiedAt;
    return;
  }

  const queryCard = typeof route.query.card === "string" ? route.query.card.trim() : "";
  if (!queryCard) {
    toast.error("缺少验证记录，请返回首页重新验证。");
    router.replace({ name: "Home" });
    return;
  }

  const fallbackState: StoredCardState = {
    card: queryCard,
    verifiedAt: Date.now(),
    inviteCount: 0,
    history: [],
    cardInfo: null,
    orderInfo: null,
    teamType: resolveCardType(typeof route.query.type === "string" ? route.query.type : undefined),
  };
  storedState.value = fallbackState;
  lastVerified.value = fallbackState.verifiedAt;
  persistState(fallbackState);
});

function ensureMilliseconds(value: number) {
  if (!value || Number.isNaN(value)) return Date.now();
  return value > 1e12 ? value : value * 1000;
}
</script>
