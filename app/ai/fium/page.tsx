'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Bot,
  Send,
  Loader2,
  LogIn,
  MessageCircle,
  Sparkles,
  Plus,
  Share2,
  X,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SupportModal } from '@/components/support-modal'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Button } from '@/components/ui/button'
import { TextArea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Modal, ModalTitle, ModalDescription } from '@/components/ui/Modal'
import { useAuthContext } from '@/contexts/AuthContext'
import { useFRSC } from '@/contexts/FRSCContext'
import { toast } from 'sonner'
import { LangContext, useLangState, useLang } from '@/hooks/useLang'
import { MaintenanceModal } from '@/components/ui/MaintenanceModal'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatTab {
  id: string
  messages: ChatMessage[]
}

const MAX_MESSAGE_LENGTH = 2000
const MAX_TABS = 3

const tiers = [
  { amount: 10, price: 'Rp 10.000', perCoin: 'Rp 1.000/FRSC' },
  { amount: 30, price: 'Rp 25.000', perCoin: 'Rp 833/FRSC' },
  { amount: 75, price: 'Rp 50.000', perCoin: 'Rp 667/FRSC' },
]

const pageContent = {
  id: {
    breadcrumbAi: 'AI Tools',
    breadcrumbCurrent: 'Fium Chat Assistant',
    title: 'Fium Chat Assistant',
    badge: 'Live',
    badgeSubtitle: 'AI Assistant',
    description:
      'Bicarakan ide konten, SEO, marketplace copywriting, workflow digital, dan strategi kreatif bersama Fium.',
    loginToUse: 'Login untuk menggunakan Fium',
    emptyTitle: 'Mulai chat dengan Fium',
    emptyDesc:
      'Tanyakan apa saja tentang konten, SEO, copywriting marketplace, atau ide kreatif untuk bisnismu.',
    inputPlaceholder: 'Tulis pesan...',
    sendBtn: 'Kirim',
    sendingBtn: 'Fium sedang berpikir...',
    shareBtn: 'Bagikan',
    shareToast: 'Link Fium disalin!',
    closeConfirmTitle: 'Tutup chat?',
    closeConfirmDesc: 'Percakapan akan dihapus dan tidak bisa dikembalikan.',
    closeConfirmCancel: 'Batal',
    closeConfirmConfirm: 'Hapus',
    charCount: (n: number) => `${n} / ${MAX_MESSAGE_LENGTH}`,
    errorDefault: 'Fium gagal menjawab. Coba lagi beberapa saat.',
    tooLong: 'Pesan terlalu panjang. Maksimal 2.000 karakter.',
    sidebarTool: 'Tool',
    sidebarLimit: 'Batas harian',
    sidebarStatus: 'Status',
    sidebarOnline: 'Online',
    sidebarCost: 'Biaya',
    sidebarFree: 'Gratis (beta)',
    sidebarFuturePrice: 'Harga FRSC mungkin akan ditambahkan kemudian.',
    frscBalance: 'Saldo FRSC',
    frscTopUp: 'Top Up FRSC',
    frscRate: '1 FRSC = 1 Generate',
    suggestedPrompts: [
      'Bantu saya buat ide konten Instagram untuk produk saya',
      'Buatkan caption marketplace yang lebih menarik',
      'Jelaskan strategi SEO sederhana untuk UMKM',
      'Bantu saya susun ide AI tool untuk Farisium',
    ],
    faqTitle: 'Pertanyaan yang Sering Ditanyakan',
    faqs: [
      {
        q: 'Apa itu Fium?',
        a: 'Fium adalah AI assistant ringan milik Farisium yang siap membantu kamu dalam brainstorming ide konten, menulis caption marketplace, strategi SEO sederhana, workflow digital, dan diskusi produktif lainnya.',
      },
      {
        q: 'Apakah Fium gratis?',
        a: 'Ya, saat ini Fium masih dalam masa beta dan gratis digunakan. Batas harian berlaku untuk menjaga performa server.',
      },
      {
        q: 'Apakah Fium sama dengan SEO Caption Generator?',
        a: 'Tidak. SEO Caption Generator adalah tools khusus untuk membuat caption dan deskripsi terstruktur untuk marketplace dan media sosial. Fium adalah asisten chat yang bisa diajak diskusi secara bebas dan lebih fleksibel.',
      },
      {
        q: 'Apakah Fium memakai FRSC?',
        a: 'Selama masa beta, Fium gratis dan tidak memerlukan FRSC. Jika ada perubahan harga, akan diumumkan sebelumnya.',
      },
      {
        q: 'Apakah chat saya disimpan?',
        a: 'Chat tidak disimpan secara permanen di server. Riwayat chat hanya tersimpan di browser kamu selama sesi halaman ini aktif.',
      },
    ],
  },
  en: {
    breadcrumbAi: 'AI Tools',
    breadcrumbCurrent: 'Fium Chat Assistant',
    title: 'Fium Chat Assistant',
    badge: 'Live',
    badgeSubtitle: 'AI Assistant',
    description:
      'Chat about content ideas, SEO, marketplace copywriting, digital workflows, and creative strategies with Fium.',
    loginToUse: 'Login to use Fium',
    emptyTitle: 'Start chatting with Fium',
    emptyDesc:
      'Ask anything about content, SEO, marketplace copywriting, or creative ideas for your business.',
    inputPlaceholder: 'Type a message...',
    sendBtn: 'Send',
    sendingBtn: 'Fium is thinking...',
    shareBtn: 'Share',
    shareToast: 'Fium link copied!',
    closeConfirmTitle: 'Close chat?',
    closeConfirmDesc: 'The conversation will be deleted and cannot be restored.',
    closeConfirmCancel: 'Cancel',
    closeConfirmConfirm: 'Delete',
    charCount: (n: number) => `${n} / ${MAX_MESSAGE_LENGTH}`,
    errorDefault: 'Fium failed to respond. Please try again.',
    tooLong: 'Message too long. Maximum 2,000 characters.',
    sidebarTool: 'Tool',
    sidebarLimit: 'Daily free limit',
    sidebarStatus: 'Status',
    sidebarOnline: 'Online',
    sidebarCost: 'Cost',
    sidebarFree: 'Free (beta)',
    sidebarFuturePrice: 'FRSC pricing may be added later.',
    frscBalance: 'FRSC Balance',
    frscTopUp: 'Top Up FRSC',
    frscRate: '1 FRSC = 1 Generate',
    suggestedPrompts: [
      'Help me create Instagram content ideas for my product',
      'Write a more engaging marketplace caption',
      'Explain simple SEO strategies for small business',
      'Help me brainstorm an AI tool idea for Farisium',
    ],
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'What is Fium?',
        a: 'Fium is Farisium\'s lightweight AI assistant ready to help you with content brainstorming, marketplace captions, simple SEO strategies, digital workflows, and other productive discussions.',
      },
      {
        q: 'Is Fium free?',
        a: 'Yes, Fium is currently in beta and free to use. Daily limits apply to maintain server performance.',
      },
      {
        q: 'Is Fium the same as SEO Caption Generator?',
        a: 'No. SEO Caption Generator is a specialized tool for creating structured captions and descriptions for marketplaces and social media. Fium is a chat assistant for free-form discussions and is more flexible.',
      },
      {
        q: 'Does Fium use FRSC?',
        a: 'During the beta period, Fium is free and does not require FRSC. Any pricing changes will be announced beforehand.',
      },
      {
        q: 'Are my chats saved?',
        a: 'Chats are not permanently stored on the server. Chat history is only saved in your browser during this active session.',
      },
    ],
  },
}

/* ── Inline Markdown Renderer ── */
function renderInline(text: string): React.ReactNode {
  const boldSegments = text.split(/(\*\*.*?\*\*)/)
  return boldSegments.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    const italicSegments = part.split(/(\*.*?\*)/)
    return italicSegments.map((sub, j) => {
      if (sub.startsWith('*') && sub.endsWith('*')) {
        return <em key={`${i}-${j}`}>{sub.slice(1, -1)}</em>
      }
      return sub
    })
  })
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <>
      {content.split('\n').map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {renderInline(line)}
        </span>
      ))}
    </>
  )
}

/* ── Chat Bubbles ── */
function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-frsc-crimson-800/40 to-frsc-purple-800/20 px-4 py-3 text-sm text-frsc-white-bright shadow-sm ring-1 ring-frsc-crimson-500/20 sm:max-w-[75%]">
        <MarkdownContent content={content} />
      </div>
    </div>
  )
}

function FiumBubble({ content }: { content: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/50 to-frsc-purple-800/30 ring-1 ring-frsc-crimson-700/30">
        <Bot className="h-4 w-4 text-frsc-crimson-400" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 px-4 py-3 text-sm leading-relaxed text-frsc-text-200 shadow-sm sm:max-w-[75%]">
        <MarkdownContent content={content} />
      </div>
    </div>
  )
}

function FiumTyping() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/50 to-frsc-purple-800/30 ring-1 ring-frsc-crimson-700/30">
        <Bot className="h-4 w-4 text-frsc-crimson-400" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 px-5 py-4 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-frsc-crimson-400/60 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-frsc-crimson-400/60 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-frsc-crimson-400/60 [animation-delay:300ms]" />
      </div>
    </div>
  )
}

function ErrorBubble({ message }: { message: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/50 to-frsc-purple-800/30 ring-1 ring-frsc-crimson-700/30">
        <Bot className="h-4 w-4 text-frsc-crimson-400" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-red-500/15 bg-red-500/5 px-4 py-3 text-sm text-red-400 shadow-sm sm:max-w-[75%]">
        <p>{message}</p>
      </div>
    </div>
  )
}

export default function FiumPage() {
  const langState = useLangState()
  const c = pageContent[langState.lang] ?? pageContent.id

  return (
    <LangContext.Provider value={langState}>
      <PageContent c={c} />
    </LangContext.Provider>
  )
}

function PageContent({ c }: { c: (typeof pageContent)['id'] }) {
  const auth = useAuthContext()
  const { coins } = useFRSC()
  const { lang } = useLang()
  const [supportOpen, setSupportOpen] = useState(false)

  /* ── Tab state ── */
  const [tabs, setTabs] = useState<ChatTab[]>([{ id: '1', messages: [] }])
  const [activeTabId, setActiveTabId] = useState('1')
  const [tabCounter, setTabCounter] = useState(2)
  const [confirmCloseTabId, setConfirmCloseTabId] = useState<string | null>(null)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeTab?.messages, loading])

  /* ── Tab management ── */
  const createNewTab = useCallback(() => {
    if (tabs.length >= MAX_TABS) return
    const id = String(tabCounter)
    setTabs((prev) => [...prev, { id, messages: [] }])
    setActiveTabId(id)
    setTabCounter((n) => n + 1)
    setShowSuggestions(true)
    setError(null)
  }, [tabs.length, tabCounter])

  const requestCloseTab = useCallback((tabId: string) => {
    setConfirmCloseTabId(tabId)
  }, [])

  const confirmCloseTab = useCallback(() => {
    if (!confirmCloseTabId) return
    setTabs((prev) => {
      const remaining = prev.filter((t) => t.id !== confirmCloseTabId)
      if (remaining.length === 0) {
        const id = String(tabCounter)
        setTabCounter((n) => n + 1)
        setActiveTabId(id)
        return [{ id, messages: [] }]
      }
      if (confirmCloseTabId === activeTabId) {
        const idx = prev.findIndex((t) => t.id === confirmCloseTabId)
        const nextTab = remaining[Math.min(idx, remaining.length - 1)]
        setActiveTabId(nextTab.id)
      }
      return remaining
    })
    setConfirmCloseTabId(null)
  }, [confirmCloseTabId, activeTabId, tabCounter])

  const cancelCloseTab = useCallback(() => {
    setConfirmCloseTabId(null)
  }, [])

  /* ── Send message ── */
  const sendMessage = async (text: string) => {
    const msg = text.trim()
    if (!msg || loading) return
    if (!auth.user) return

    setError(null)
    setShowSuggestions(false)

    const userMessage: ChatMessage = { role: 'user', content: msg }

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, messages: [...t.messages, userMessage] }
          : t,
      ),
    )
    setInput('')
    setLoading(true)

    const currentMessages = activeTab
      ? [...activeTab.messages, userMessage]
      : [userMessage]

    try {
      const res = await fetch('/api/ai/fium/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages,
          language: lang,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || c.errorDefault)
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: json.reply,
      }
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, messages: [...t.messages, assistantMessage] }
            : t,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : c.errorDefault)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => {
    if (input.trim().length > MAX_MESSAGE_LENGTH) {
      setError(c.tooLong)
      return
    }
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePromptClick = (prompt: string) => {
    if (auth.user) {
      sendMessage(prompt)
    } else {
      setInput(prompt)
      inputRef.current?.focus()
    }
  }

  const inputLength = input.trim().length

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1 blur-[2px] brightness-75 pointer-events-none select-none">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-6">
          <nav
            className="mb-4 flex items-center gap-2 text-xs text-frsc-text-300"
            aria-label="Breadcrumb"
          >
            <Link
              href="/ai"
              className="transition-colors hover:text-foreground"
            >
              {c.breadcrumbAi}
            </Link>
            <span className="text-frsc-text-300/50" aria-hidden="true">
              /
            </span>
            <span aria-current="page" className="text-foreground">
              {c.breadcrumbCurrent}
            </span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-700/30 shadow-[0_0_24px_rgba(224,48,78,0.08)]">
              <MessageCircle className="h-7 w-7 text-frsc-crimson-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="heading-fluid text-h2 text-foreground">
                  {c.title}
                </h1>
                <Badge variant="crimson" size="sm">
                  {c.badge}
                </Badge>
              </div>
              <p className="mt-1 text-pretty text-sm text-frsc-text-200">
                {c.description}
              </p>
            </div>
          </div>
        </div>

        <section className="mx-auto w-full max-w-7xl px-4 pb-6 lg:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] items-start">
            {/* Chat panel */}
            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 shadow-metallic overflow-hidden flex flex-col">
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-frsc-crimson-400" />
                  <span className="text-sm font-semibold text-frsc-white-bright">
                    Fium
                  </span>
                  <span className="text-[11px] text-frsc-text-300/60">
                    {c.badgeSubtitle}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('https://farisium.com/ai/fium')
                    toast(c.shareToast)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-frsc-text-300 transition-all hover:bg-white/[0.06] hover:text-frsc-text-100 active:scale-95"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {c.shareBtn}
                </button>
              </div>

              {/* Tab bar */}
              <div className="flex items-center gap-1 border-b border-white/[0.06] bg-white/[0.01] px-3 py-1.5 overflow-x-auto scrollbar-none">
                {tabs.map((tab, idx) => (
                  <div
                    key={tab.id}
                    className={`group flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                      tab.id === activeTabId
                        ? 'bg-frsc-crimson-800/30 text-frsc-white-bright ring-1 ring-frsc-crimson-700/30'
                        : 'text-frsc-text-300 hover:bg-white/[0.04] hover:text-frsc-text-100'
                    }`}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <MessageCircle className="h-3 w-3 shrink-0" />
                    <span>{`Chat ${idx + 1}`}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        requestCloseTab(tab.id)
                      }}
                      className="ml-0.5 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/[0.08]"
                      aria-label={`Close Chat ${idx + 1}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {tabs.length < MAX_TABS && (
                  <button
                    type="button"
                    onClick={createNewTab}
                    className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs text-frsc-text-300 transition-all hover:bg-white/[0.04] hover:text-frsc-text-100"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Chat body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-[320px] max-h-[480px] lg:max-h-[540px]">
                {activeTab.messages.length === 0 && !loading ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-700/30 mb-4">
                      <MessageCircle className="h-7 w-7 text-frsc-crimson-400" />
                    </div>
                    <h3 className="text-base font-semibold text-frsc-white-bright">
                      {c.emptyTitle}
                    </h3>
                    <p className="mt-1 max-w-md text-sm text-frsc-text-200">
                      {c.emptyDesc}
                    </p>

                    {showSuggestions && (
                      <div className="mt-6 grid w-full max-w-md gap-2">
                        {c.suggestedPrompts.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => handlePromptClick(prompt)}
                            disabled={loading}
                            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-left text-sm text-frsc-text-200 transition-all hover:border-frsc-crimson-500/30 hover:bg-white/[0.04] hover:text-frsc-text-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="flex items-center gap-2">
                              <Sparkles className="h-3.5 w-3.5 shrink-0 text-frsc-crimson-400/60" />
                              {prompt}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {activeTab.messages.map((msg, i) =>
                      msg.role === 'user' ? (
                        <UserBubble key={i} content={msg.content} />
                      ) : (
                        <FiumBubble key={i} content={msg.content} />
                      ),
                    )}

                    {loading && <FiumTyping />}

                    {error && !loading && <ErrorBubble message={error} />}
                  </>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div className="border-t border-white/[0.06] px-5 py-4">
                {!auth.user ? (
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <LogIn className="h-4 w-4 text-frsc-text-300" />
                    <span className="text-sm text-frsc-text-200">
                      {c.loginToUse}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <TextArea
                          ref={inputRef}
                          placeholder={c.inputPlaceholder}
                          value={input}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val.length <= MAX_MESSAGE_LENGTH) {
                              setInput(val)
                            }
                          }}
                          onKeyDown={handleKeyDown}
                          aria-label={c.inputPlaceholder}
                          rows={2}
                          className="min-h-[44px] resize-none"
                        />
                      </div>
                      <Button
                        variant="crimson"
                        size="lg"
                        disabled={inputLength === 0 || loading}
                        onClick={handleSend}
                        className="h-[44px] shrink-0"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      {inputLength > 0 && (
                        <span className="text-[11px] text-frsc-text-300/50">
                          {c.charCount(inputLength)}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px] text-frsc-text-300/30">
                        <span>Farisium</span>
                        <span className="text-frsc-text-300/20">×</span>
                        <img src="/llama.webp" alt="" className="h-3 w-3 rounded-sm" />
                        <span>fine-tuned Chat Assistant</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="self-start h-fit lg:sticky lg:top-24 space-y-4">
              {/* Tool info */}
              <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 p-5 shadow-metallic">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-frsc-text-300">{c.sidebarTool}</span>
                    <span className="font-medium text-frsc-white-bright">
                      Fium
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-frsc-text-300">
                      {c.sidebarLimit}
                    </span>
                    <span className="font-medium text-frsc-white-bright">
                      20
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-frsc-text-300">
                      {c.sidebarStatus}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-green-400">
                      <span className="h-2 w-2 rounded-full bg-green-400" />
                      {c.sidebarOnline}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-frsc-text-300">{c.sidebarCost}</span>
                    <span className="font-medium text-frsc-crimson-400">
                      {c.sidebarFree}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-frsc-text-300/50">
                  {c.sidebarFuturePrice}
                </p>
              </div>

              {/* FRSC Balance & Pricing */}
              <Card variant="crimson" className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10">
                    <Image
                      src="/farisium-coin.png"
                      alt="FRSC"
                      width={24}
                      height={24}
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-frsc-text-300">
                      {c.frscBalance}
                    </p>
                    <p className="text-xl font-bold tabular-nums text-frsc-white-bright">
                      {coins} FRSC
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {tiers.map((tier) => (
                    <div
                      key={tier.amount}
                      className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-sm"
                    >
                      <span className="text-frsc-text-200">
                        {tier.amount} FRSC
                      </span>
                      <span className="font-medium text-frsc-crimson-400">
                        {tier.price}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="crimson-gradient"
                  size="sm"
                  onClick={() => setSupportOpen(true)}
                  className="mt-4 w-full"
                >
                  <Image
                    src="/farisium-coin.png"
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 object-contain"
                  />
                  {c.frscTopUp}
                </Button>

                <p className="mt-2 text-center text-[10px] text-frsc-text-300/50">
                  {c.frscRate}
                </p>
              </Card>
            </aside>
          </div>
        </section>

        {/* Ad slot */}
        <div className="mt-4 flex justify-center px-2">
          <div
            className="mx-auto flex w-full max-w-xl items-center justify-center overflow-hidden rounded-xl border border-dashed border-frsc-surface-600/40 bg-frsc-surface-800/20"
            style={{ minHeight: 90 }}
          >
            <span className="text-[10px] text-frsc-text-300/30">AdSpace</span>
          </div>
        </div>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-8 text-foreground">
            {c.faqTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {c.faqs.map(({ q, a }: { q: string; a: string }) => (
              <div
                key={q}
                className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 p-5 shadow-metallic"
              >
                <h3 className="mb-2 text-sm font-semibold text-frsc-white-bright">
                  {q}
                </h3>
                <p className="text-sm leading-relaxed text-frsc-text-200">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
      <SupportModal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
      />
      <ScrollReveal />

      {/* Close tab confirmation modal */}
      <Modal
        open={confirmCloseTabId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmCloseTabId(null)
        }}
        size="sm"
      >
        <ModalTitle>{c.closeConfirmTitle}</ModalTitle>
        <ModalDescription>{c.closeConfirmDesc}</ModalDescription>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={cancelCloseTab}>
            {c.closeConfirmCancel}
          </Button>
          <Button variant="crimson" size="sm" onClick={confirmCloseTab}>
            {c.closeConfirmConfirm}
          </Button>
        </div>
      </Modal>
      <MaintenanceModal />
    </div>
  )
}
