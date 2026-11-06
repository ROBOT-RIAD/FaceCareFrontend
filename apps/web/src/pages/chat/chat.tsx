import React, { useState, useRef, useEffect, useCallback } from "react"
import { Link } from "react-router"
import {
  Send,
  Sparkles,
  ArrowLeft,
  X,
  Bot,
  Check,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Flame,
  Sun,
  Droplets,
  Layers,
  Plus,
  Trash2,
  MessageSquare,
  Menu,
  Square,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/hooke/useAuth"
import { AuthModal } from "@/components/modules/auth/AuthModal"
import { useQueryClient } from "@tanstack/react-query"
import {
  useChats,
  useChatHistory,
  useCreateChat,
  useDeleteChat,
  useSendMessageStream,
  type ChatMessage,
  type ChatConversation,
} from "@/hooke/useChat"

// ==========================================
// Starter Suggestions for New Chats
// ==========================================
const STARTER_PROMPTS = [
  {
    icon: Flame,
    title: "Acne & Breakouts",
    prompt: "What is the best routine and active ingredients for hormonal acne?",
  },
  {
    icon: Sun,
    title: "Sunscreen Guide",
    prompt: "Recommend mineral sunscreens that leave zero white cast on brown skin.",
  },
  {
    icon: Droplets,
    title: "Barrier Repair",
    prompt: "How can I repair a damaged skin barrier from over-exfoliation?",
  },
  {
    icon: Layers,
    title: "Layering Ingredients",
    prompt: "Can I use Vitamin C and Niacinamide together in the morning?",
  },
]

// ==========================================
// Time Formatter for Sidebar Chats
// ==========================================
function formatChatTime(dateStr?: string): string {
  if (!dateStr) return ""
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`
    if (diffHours < 48) return "Yesterday"
    return d.toLocaleDateString([], { month: "short", day: "numeric" })
  } catch {
    return ""
  }
}

// ==========================================
// Rich Markdown Formatter for AI Responses
// ==========================================
function parseInline(text: string): React.ReactNode[] {
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g)
  return tokens.map((tok, i) => {
    if (tok.startsWith("**") && tok.endsWith("**") && tok.length >= 4) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>
      )
    }
    if (tok.startsWith("*") && tok.endsWith("*") && tok.length >= 2) {
      return (
        <em key={i} className="italic text-muted-foreground">
          {tok.slice(1, -1)}
        </em>
      )
    }
    if (tok.startsWith("`") && tok.endsWith("`") && tok.length >= 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono text-primary font-medium"
        >
          {tok.slice(1, -1)}
        </code>
      )
    }
    return tok
  })
}

function FormattedMessage({ text }: { text: string }) {
  const paragraphs = text.split("\n\n")

  return (
    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-foreground font-normal">
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim()
        if (!trimmed) return null

        const lines = trimmed.split("\n")
        const isBulletList =
          lines.length > 0 &&
          lines.every((l) => l.trim().startsWith("* ") || l.trim().startsWith("- "))
        const isNumberedList =
          lines.length > 0 && lines.every((l) => /^\d+\.\s/.test(l.trim()))

        if (isBulletList) {
          return (
            <ul key={pIdx} className="space-y-1.5 pl-1 my-1.5">
              {lines.map((line, lIdx) => {
                const content = line.trim().replace(/^[\*\-]\s+/, "")
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    <span className="flex-1">{parseInline(content)}</span>
                  </li>
                )
              })}
            </ul>
          )
        }

        if (isNumberedList) {
          return (
            <ol key={pIdx} className="space-y-1.5 pl-1 my-1.5">
              {lines.map((line, lIdx) => {
                const match = line.trim().match(/^(\d+)\.\s+(.*)/)
                const num = match ? match[1] : `${lIdx + 1}`
                const content = match ? match[2] : line
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-md px-1.5 py-0.5 shrink-0 mt-0.5">
                      {num}
                    </span>
                    <span className="flex-1">{parseInline(content)}</span>
                  </li>
                )
              })}
            </ol>
          )
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={pIdx} className="font-semibold text-sm pt-1 text-primary">
              {parseInline(trimmed.replace("### ", ""))}
            </h4>
          )
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={pIdx} className="font-serif font-medium text-base pt-1 text-foreground">
              {parseInline(trimmed.replace("## ", ""))}
            </h3>
          )
        }

        return (
          <p key={pIdx} className="whitespace-pre-line">
            {parseInline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

// ==========================================
// Main Chat Page Component
// ==========================================
export default function ChatPage() {
  const { user, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()

  // State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [inputText, setInputText] = useState("")
  const [activeChatId, setActiveChatId] = useState<number | null>(null)
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])
  const [copiedId, setCopiedId] = useState<number | string | null>(null)
  const [toastNotification, setToastNotification] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [deletingChatId, setDeletingChatId] = useState<number | null>(null)

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const currentLoadedChatIdRef = useRef<number | null>(null)

  // Typewriter queue for character-by-character smooth chatbot streaming
  const typewriterQueueRef = useRef<string[]>([])
  const typewriterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypewriterRunningRef = useRef(false)
  const isStreamDoneRef = useRef(false)
  const onDoneFinalizeRef = useRef<(() => void) | null>(null)

  // TanStack Query Hooks for Chat
  const { chats, isLoading: isChatsLoading } = useChats()
  const { messages: historyMessages, isLoading: isHistoryLoading } =
    useChatHistory(activeChatId)
  const createChatMutation = useCreateChat()
  const deleteChatMutation = useDeleteChat()
  const { sendMessage, isStreaming, stopStream } = useSendMessageStream()

  // Toast Helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastNotification({ message, type })
    setTimeout(() => setToastNotification(null), 3200)
  }

  // 0. Clear all chat data ONLY when user actually logs out (not during initial auth loading)
  useEffect(() => {
    if (!authLoading && !user) {
      queryClient.removeQueries({ queryKey: ["userChats"] })
      queryClient.removeQueries({ queryKey: ["chatHistory"] })
      setActiveChatId(null)
      currentLoadedChatIdRef.current = null
      setLocalMessages([])
    }
  }, [authLoading, user, queryClient])

  // 1. Initial Selection: Auto-select latest chat on load if not set
  useEffect(() => {
    if (chats.length > 0 && activeChatId === null) {
      setActiveChatId(chats[0].id)
    }
  }, [chats, activeChatId])

  // 2. Sync local messages ONLY when switching to a different chat or on initial load
  useEffect(() => {
    if (!activeChatId) {
      // Only clear if there are messages to clear (avoids re-render loop)
      if (currentLoadedChatIdRef.current !== null) {
        setLocalMessages([])
        currentLoadedChatIdRef.current = null
      }
      return
    }

    // Prevent overwriting local optimistic messages while streaming or when a placeholder exists
    const isPlaceholderPresent =
      localMessages.length > 0 &&
      localMessages[localMessages.length - 1].role === 'assistant' &&
      localMessages[localMessages.length - 1].content === ''

    if (currentLoadedChatIdRef.current !== activeChatId && !isHistoryLoading && !isStreaming && !isPlaceholderPresent) {
      if (Array.isArray(historyMessages)) {
        setLocalMessages(historyMessages)
        currentLoadedChatIdRef.current = activeChatId
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId, isHistoryLoading, isStreaming, localMessages])

  // 3. Scroll to bottom — uses scrollTop on container without shaking page
  const scrollToBottom = useCallback(() => {
    const el = scrollContainerRef.current
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight
      })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [localMessages, isStreaming, scrollToBottom])

  // 4. Smooth Typewriter: drips characters one-by-one so it prints like an authentic chatbot
  const processTypewriterQueue = useCallback(() => {
    if (isTypewriterRunningRef.current) return
    isTypewriterRunningRef.current = true

    const pump = () => {
      const queue = typewriterQueueRef.current
      if (queue.length === 0) {
        if (isStreamDoneRef.current) {
          isTypewriterRunningRef.current = false
          onDoneFinalizeRef.current?.()
          onDoneFinalizeRef.current = null
          return
        }
        isTypewriterRunningRef.current = false
        return
      }

      // Dynamic pacing: pull 1 char normally, or 3-5 if buffer gets large
      const batchCount = queue.length > 50 ? 5 : queue.length > 20 ? 3 : 1
      const chars = queue.splice(0, batchCount).join("")

      setLocalMessages((prev) => {
        const next = [...prev]
        const lastIdx = next.length - 1
        if (lastIdx >= 0 && next[lastIdx].role === "assistant") {
          next[lastIdx] = {
            ...next[lastIdx],
            content: next[lastIdx].content + chars,
          }
        }
        return next
      })

      scrollToBottom()

      // 14ms gives ~70 chars/sec typing speed (natural AI stream feel)
      typewriterTimerRef.current = setTimeout(pump, 14)
    }

    pump()
  }, [scrollToBottom])

  // Cleanup typewriter timer on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimerRef.current) {
        clearTimeout(typewriterTimerRef.current)
      }
    }
  }, [])

  // Copy Message Helper
  const handleCopyText = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Handle Create New Chat
  const handleCreateNewChat = async () => {
    if (!user) {
      showToast("Please sign in to start a new chat.", "error")
      setIsAuthModalOpen(true)
      return
    }

    try {
      const newChat = await createChatMutation.mutateAsync()
      if (newChat?.id) {
        currentLoadedChatIdRef.current = newChat.id
        setActiveChatId(newChat.id)
        setLocalMessages([])
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false)
        }
        showToast("New chat started")
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to create new chat", "error")
    }
  }

  // Handle Delete Chat
  const handleDeleteChat = async (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation()
    if (deletingChatId === chatId) return

    setDeletingChatId(chatId)
    try {
      await deleteChatMutation.mutateAsync(chatId)
      showToast("Chat conversation deleted")

      if (activeChatId === chatId) {
        const remaining = chats.filter((c) => c.id !== chatId)
        if (remaining.length > 0) {
          currentLoadedChatIdRef.current = null
          setActiveChatId(remaining[0].id)
        } else {
          setActiveChatId(null)
          currentLoadedChatIdRef.current = null
          setLocalMessages([])
        }
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to delete chat", "error")
    } finally {
      setDeletingChatId(null)
    }
  }

  // Handle Stop Generating
  const handleStop = () => {
    stopStream()
    isStreamDoneRef.current = true
    if (typewriterTimerRef.current) {
      clearTimeout(typewriterTimerRef.current)
      typewriterTimerRef.current = null
    }
    isTypewriterRunningRef.current = false
    if (typewriterQueueRef.current.length > 0) {
      const remaining = typewriterQueueRef.current.splice(0).join("")
      setLocalMessages((prev) => {
        const next = [...prev]
        const lastIdx = next.length - 1
        if (lastIdx >= 0 && next[lastIdx].role === "assistant") {
          next[lastIdx] = {
            ...next[lastIdx],
            content: next[lastIdx].content + remaining,
          }
        }
        return next
      })
    }
    scrollToBottom()
  }

  // Handle Send Message (With SSE Streaming & Character-by-character effect)
  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || inputText).trim()
    if (!text || isStreaming) return

    // Login requirement check
    if (!user) {
      showToast("Please sign in to chat with AI Dermatologist", "error")
      setIsAuthModalOpen(true)
      return
    }

    setInputText("")
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }

    // Ensure we have an active chat ID
    let currentChatId = activeChatId
    if (!currentChatId) {
      try {
        const created = await createChatMutation.mutateAsync()
        currentChatId = created.id
        currentLoadedChatIdRef.current = created.id
        setActiveChatId(created.id)
      } catch (err: any) {
        showToast(err?.message || "Failed to initialize chat session", "error")
        return
      }
    } else {
      currentLoadedChatIdRef.current = currentChatId
    }

    // Append optimistic user message & empty assistant placeholder for streaming
    const userMsgId = `temp-user-${Date.now()}`
    const aiMsgId = `temp-ai-${Date.now()}`

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    }

    const aiMessagePlaceholder: ChatMessage = {
      id: aiMsgId,
      role: "assistant",
      content: "",
      created_at: new Date().toISOString(),
    }

    setLocalMessages((prev) => [...prev, userMessage, aiMessagePlaceholder])
    scrollToBottom()

    // Reset typewriter queue
    typewriterQueueRef.current = []
    isStreamDoneRef.current = false
    if (typewriterTimerRef.current) {
      clearTimeout(typewriterTimerRef.current)
      typewriterTimerRef.current = null
    }
    isTypewriterRunningRef.current = false

    // Stream SSE Response
    await sendMessage({
      chatId: currentChatId,
      message: text,
      onToken: (token) => {
        // Enqueue characters to type smoothly
        for (let i = 0; i < token.length; i++) {
          typewriterQueueRef.current.push(token[i])
        }
        processTypewriterQueue()
      },
      onDone: (data) => {
        isStreamDoneRef.current = true
        onDoneFinalizeRef.current = () => {
          if (data?.message_id) {
            setLocalMessages((prev) => {
              const next = [...prev]
              const lastIdx = next.length - 1
              if (lastIdx >= 0 && next[lastIdx].role === "assistant") {
                next[lastIdx] = {
                  ...next[lastIdx],
                  id: data.message_id,
                  content: data.content || next[lastIdx].content,
                }
              }
              return next
            })
          }
          scrollToBottom()
        }
        processTypewriterQueue()
      },
      onError: (errorMessage) => {
        isStreamDoneRef.current = true
        showToast(errorMessage, "error")
        setLocalMessages((prev) => {
          const next = [...prev]
          const lastIdx = next.length - 1
          if (lastIdx >= 0 && next[lastIdx].role === "assistant" && !next[lastIdx].content) {
            next[lastIdx] = {
              ...next[lastIdx],
              content: `⚠️ ${errorMessage || "Unable to get response. Please try again."}`,
            }
          }
          return next
        })
      },
    })
  }

  // Active chat metadata
  const currentChatObj = chats.find((c) => c.id === activeChatId)

  return (
    <>
      {/* Hide the App Footer when chat page is active */}
      <style>{`
        body > #root > div > footer,
        body > #root > .min-h-screen > footer { display: none !important; }
        body > #root > div > main,
        body > #root > .min-h-screen > main { flex: 1 1 0%; min-height: 0; display: flex; flex-direction: column; }
        body > #root > div,
        body > #root > .min-h-screen { height: 100dvh; max-height: 100dvh; overflow: hidden; }
      `}</style>

      {/* Main Container - matches Navbar width exactly */}
      <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex flex-col min-h-0">
        <div className="w-full flex-1 flex bg-background text-foreground border border-border/80 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden min-h-0">
      {/* Toast Notification */}
      {toastNotification && (
        <div
          className={`fixed top-20 right-6 z-[130] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-4 ${
            toastNotification.type === "error"
              ? "bg-[#2b1e22] text-rose-200 border-rose-800"
              : "bg-[#2b2e32] text-white border-stone-700"
          }`}
        >
          {toastNotification.type === "error" ? (
            <AlertCircle className="size-4 text-rose-400 shrink-0" />
          ) : (
            <Check className="size-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastNotification.message}</span>
        </div>
      )}

      {/* =========================================================================
          LEFT SIDEBAR: CHAT SESSIONS & CONVERSATION HISTORY
          ========================================================================= */}
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-72 sm:w-80 h-full bg-card border-r border-border/80 flex flex-col transition-transform duration-300 ease-in-out shrink-0 min-h-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"
        }`}
      >
        {/* Sidebar Header: New Chat Button & Close on Mobile */}
        <div className="p-3.5 border-b border-border/70 flex items-center justify-between gap-2 bg-muted/30">
          <button
            type="button"
            onClick={handleCreateNewChat}
            disabled={createChatMutation.isPending}
            className="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            {createChatMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            <span>New Skincare Chat</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors md:hidden"
            title="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2.5 py-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Conversations</span>
            {chats.length > 0 && <span>{chats.length}</span>}
          </div>

          {isChatsLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-muted/60 animate-pulse"
                />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-2 text-muted-foreground">
              <MessageSquare className="size-8 mx-auto opacity-40" />
              <p className="text-xs font-medium">No previous chats yet</p>
              <p className="text-[11px] opacity-80">
                Start a consultation below to get personalized skincare advice.
              </p>
            </div>
          ) : (
            chats.map((chat: ChatConversation) => {
              const isActive = chat.id === activeChatId
              const isDeleting = deletingChatId === chat.id

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id)
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false)
                    }
                  }}
                  className={`group relative w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    isActive
                      ? "bg-primary/10 border border-primary/30 text-foreground shadow-2xs font-medium"
                      : "hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <MessageSquare className="size-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold truncate leading-tight">
                        {chat.title || "New Chat"}
                      </h4>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatChatTime(chat.updated_at || chat.created_at)}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground truncate mt-0.5 line-clamp-1">
                      {chat.last_message || "No messages yet"}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    disabled={isDeleting}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0 cursor-pointer"
                    title="Delete conversation"
                  >
                    {isDeleting ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Trash2 className="size-3" />
                    )}
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-border/70 text-[11px] text-muted-foreground flex items-center justify-between bg-muted/20">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="size-2 rounded-full bg-emerald-500 inline-block" />
            <span>AI Online</span>
          </span>
          <span className="text-[10px] opacity-75">v2.4 Dermatologist</span>
        </div>
      </aside>

      {/* =========================================================================
          RIGHT MAIN AREA: CHAT VIEW & STREAMING
          ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 h-full bg-background relative">
        {/* Header Bar */}
        <header className="px-4 sm:px-6 py-3 border-b border-border/80 bg-card/60 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Toggle Sidebar Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-xl border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="size-4 hidden md:block" />
              ) : (
                <PanelLeftOpen className="size-4 hidden md:block" />
              )}
              <Menu className="size-4 md:hidden" />
            </button>

            <Link
              to="/"
              className="size-8 rounded-full border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              title="Back to home"
            >
              <ArrowLeft className="size-4" />
            </Link>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                <Sparkles className="size-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xs sm:text-sm font-semibold truncate leading-none">
                    {currentChatObj?.title || "Glowmi SkinGPT"}
                  </h1>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary shrink-0 hidden sm:inline-block">
                    AI Assistant
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate mt-0.5">
                  Dermatological & Cosmetic Ingredient Assistant
                </p>
              </div>
            </div>
          </div>

          {/* Quick New Chat Button in Header */}
          <button
            type="button"
            onClick={handleCreateNewChat}
            disabled={createChatMutation.isPending}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl border border-border/80 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Start new chat"
          >
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </header>

        {/* Message Scroll Area */}
        <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Loading Indicator when switching chat */}
          {isHistoryLoading && localMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-xs">Loading conversation history...</span>
            </div>
          ) : localMessages.length === 0 ? (
            /* Starter Prompts & Empty Welcome Screen */
            <div className="text-center py-6 sm:py-10 max-w-lg mx-auto space-y-3 animate-in fade-in duration-200">
              <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-2xs">
                <Bot className="size-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-medium text-foreground">
                What can I decode for your skin today?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Ask about ingredient compatibility, active breakouts, personalized morning/night regimens, or barrier repair.
              </p>

              {/* Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 text-left">
                {STARTER_PROMPTS.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => handleSend(item.prompt)}
                      className="p-3.5 rounded-xl border border-border/80 bg-card hover:bg-muted/60 transition-all text-left flex items-start gap-3 cursor-pointer group hover:border-primary/50 shadow-2xs"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                          {item.prompt}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Active Messages List */
            localMessages.map((msg, idx) => {
              const isUser = msg.role === "user"

              if (isUser) {
                return (
                  <div
                    key={msg.id || idx}
                    className="flex justify-end gap-2.5 max-w-2xl ml-auto animate-in fade-in"
                  >
                    <div className="flex flex-col items-end">
                      <div className="bg-[#6355d8] text-white px-4 sm:px-5 py-3 rounded-2xl rounded-tr-xs shadow-xs max-w-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                      {msg.created_at && (
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="size-7 rounded-full bg-[#6355d8]/20 text-[#6355d8] flex items-center justify-center font-bold text-xs shrink-0 mt-1 uppercase">
                      {user?.fullName?.[0] || user?.name?.[0] || user?.email?.[0] || "U"}
                    </div>
                  </div>
                )
              }

               const isLastMsg = idx === localMessages.length - 1
               const isCurrentlyTyping = isLastMsg && isStreaming

              // Assistant Message
              return (
                <div
                  key={msg.id || idx}
                  className="flex items-start gap-3 max-w-3xl animate-in fade-in"
                >
                  <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="size-4" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="bg-muted/40 dark:bg-stone-900 border border-border/70 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-2xs">
                      {msg.content ? (
                        <div>
                          <FormattedMessage text={msg.content} />
                          {isCurrentlyTyping && (
                            <span className="inline-block w-[2px] h-4 bg-primary ml-0.5 animate-pulse align-text-bottom" />
                          )}
                        </div>
                      ) : (
                        /* Typing Indicator inside stream placeholder */
                        <div className="flex items-center gap-1.5 py-1">
                          <span className="size-2 rounded-full bg-primary animate-bounce" />
                          <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                          <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                          <span className="text-xs text-muted-foreground ml-2">
                            Formulating dermatological analysis...
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Message Actions */}
                    {msg.content && (
                      <div className="flex items-center gap-3 px-1 text-muted-foreground text-xs">
                        {msg.created_at && (
                          <span className="text-[10px]">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.content, msg.id)}
                          className="hover:text-foreground p-1 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="size-3 text-emerald-500" />
                              <span className="text-emerald-500 text-[10px]">Copied</span>
                            </>
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                        <button
                          type="button"
                          className="hover:text-foreground p-1 cursor-pointer transition-colors"
                          title="Helpful response"
                        >
                          <ThumbsUp className="size-3" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-foreground p-1 cursor-pointer transition-colors"
                          title="Not helpful"
                        >
                          <ThumbsDown className="size-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}

        </div>

        {/* Bottom Floating Prompt Dock */}
        <footer className="p-3 sm:p-4 border-t border-border/60 bg-card/40 backdrop-blur-md shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            {/* Quick Suggestions Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                "Acne breakout steps",
                "Mineral vs Chemical SPF",
                "Niacinamide routine",
                "Repair skin barrier",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  disabled={isStreaming}
                  className="shrink-0 px-3 py-1 rounded-full border border-border/70 bg-card hover:border-primary/50 text-[11px] text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Capsule Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2 rounded-2xl border-2 border-border/80 focus-within:border-[#6355d8] bg-background p-2 transition-all shadow-xs"
            >
              {/* Textarea */}
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  // Auto-resize textarea height
                  const ta = e.target
                  ta.style.height = "auto"
                  ta.style.height = Math.min(ta.scrollHeight, 112) + "px"
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                    // Reset textarea height after send
                    if (inputRef.current) {
                      inputRef.current.style.height = "auto"
                    }
                  }
                }}
                rows={1}
                placeholder="Ask about skin targets, ingredients, compatibilities, or regimens..."
                className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none py-1.5 px-2 max-h-28 overflow-y-auto"
              />

              {/* Stop Generation or Send Button */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="size-9 sm:size-10 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
                  title="Stop generating"
                >
                  <Square className="size-4 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="size-9 sm:size-10 rounded-xl bg-[#6355d8] hover:bg-[#5244c9] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
                  title="Send message"
                >
                  <Send className="size-4" />
                </button>
              )}
            </form>

            {/* Disclaimer Note */}
            <p className="text-[10px] text-center text-muted-foreground/80">
              Glowmi AI uses your skin profile, active routine & dermatologist research. Always patch test new ingredients.
            </p>
          </div>
        </footer>
      </main>

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
        </div>
      </div>
    </>
  )
}
