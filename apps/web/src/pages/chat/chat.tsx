import { useState, useRef, useEffect } from "react"
import { Link } from "react-router"
import {
  Send,
  Camera,
  Sparkles,
  ArrowLeft,
  X,
  ShoppingBag,
  Heart,
  Bot,
  Check,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Flame,
  Sun,
  Droplets,
  Layers,
} from "lucide-react"
import { useAuth } from "@/hooke/useAuth"
import { useShop } from "@/hooke/ShopContext"
import type { Product } from "@/hooke/ShopContext"
import { AuthModal } from "@/components/modules/auth/AuthModal"

interface ChatProduct {
  id: number
  title: string
  subtitle: string
  price: string
  image: string
  category: string
}

interface Message {
  id: string
  sender: "ai" | "user"
  text: string
  product?: ChatProduct
  timestamp: string
}

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

export default function ChatPage() {
  const { user } = useAuth()
  const { addToCart, isFavorite, toggleFavorite } = useShop()

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ChatProduct | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Start with clean initial greeting
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-1",
      sender: "ai",
      text: "Hello! I am your **Glowmi AI Skincare Dermatologist**. I can decode skin biology, recommend ingredient synergies, analyze routines, and suggest curated formulations.\n\nHow can I help your skin thrive today?",
      timestamp: "Just now",
    },
  ])

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Handle Send with Login Check
  const handleSend = (customPrompt?: string) => {
    const text = (customPrompt || inputText).trim()
    if (!text) return

    // Requirement: Check if user is logged in
    if (!user) {
      showToast("Please join us or sign in to chat with AI")
      setIsAuthModalOpen(true)
      return
    }

    const userMessage: Message = {
      id: "usr-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const lower = text.toLowerCase()
      let aiText = ""
      let recProduct: ChatProduct | undefined = undefined

      if (lower.includes("acne") || lower.includes("breakout") || lower.includes("pimple")) {
        aiText = `For acne-prone skin, dermatologists recommend a focused 3-step strategy:\n\n1. **Gentle Cleanser:** Use a 2% Salicylic Acid (BHA) cleanser to clear sebum inside pores without stripping moisture.\n2. **Targeted Treatment:** Combine Niacinamide (reduces inflammation & regulates oil) with Azelaic Acid.\n3. **Moisture Barrier:** Never skip moisturizer—opt for an oil-free, non-comedogenic ceramide gel.\n\n⚠️ *Avoid harsh physical scrubs as they spread bacteria and compromise your barrier.*`
        recProduct = {
          id: 201,
          title: "BHA Clarifying Acne Serum",
          subtitle: "2% Salicylic Acid + Zinc PCA",
          price: "26.00",
          category: "Serums & Oils",
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
        }
      } else if (lower.includes("sunscreen") || lower.includes("spf") || lower.includes("sun")) {
        aiText = `Sun protection is the #1 anti-aging and pigment prevention step in any routine!\n\n• **Spectrum:** Minimum Broad Spectrum SPF 50 with PA++++\n• **Rule:** 2 finger-lengths for face & neck every morning\n• **Reapplication:** Every 2 hours when exposed to direct daylight\n\nHere is our top dermatologist-tested formula:`
        recProduct = {
          id: 101,
          title: "SPF 50 Mineral Sheer Sunscreen",
          subtitle: "Invisible Zinc Oxide Shield",
          price: "32.99",
          category: "Sun Protection",
          image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
        }
      } else if (lower.includes("barrier") || lower.includes("dry") || lower.includes("redness") || lower.includes("irritat")) {
        aiText = `When your skin barrier is compromised, immediately pause all active acids and retinoids.\n\n**Recovery Protocol (7-14 Days):**\n• Wash face only with lukewarm water or a milky ceramide wash\n• Layer Centella Asiatica (Cica) and Panthenol\n• Seal skin with Squalane & Ceramide Complex cream\n• Skin will begin restoring its natural lipid layer within 5-7 days.`
        recProduct = {
          id: 202,
          title: "Ceramide Barrier Lipid Cream",
          subtitle: "Multi-Ceramides NP/AP + Squalane",
          price: "34.00",
          category: "Moisturizers",
          image: "https://images.unsplash.com/photo-1608248597359-074464019a79?auto=format&fit=crop&w=600&q=80",
        }
      } else if (lower.includes("routine") || lower.includes("order") || lower.includes("layer")) {
        aiText = `The golden rule of skincare layering is **thinnest consistency to thickest**:\n\n**Morning (AM):**\n1. Cleanser → 2. Hydrating Toner → 3. Antioxidant Serum (Vitamin C) → 4. Lightweight Moisturizer → 5. SPF 50+\n\n**Evening (PM):**\n1. Double Cleanse (Oil balm + water wash) → 2. Exfoliant / Retinoid → 3. Barrier Hydrating Serum → 4. Rich Night Cream.`
      } else {
        aiText = `Based on dermatological skin biology, your skin is unique. Could you share your skin type (Oily, Dry, Combination, Sensitive) and specific targets (e.g. anti-aging, texture, hydration)? I will generate a custom regimen for you!`
      }

      const botMessage: Message = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: aiText,
        product: recProduct,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, botMessage])
    }, 1100)
  }

  return (
    <div className="w-full h-[calc(100vh-5rem)] max-w-5xl mx-auto flex flex-col bg-background text-foreground transition-colors overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[120] flex items-center gap-2.5 px-4 py-3 bg-[#2b2e32] text-white rounded-xl shadow-2xl border border-stone-700 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-4">
          <Check className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top AI Chatbot Header Bar */}
      <header className="px-4 sm:px-6 py-3 border-b border-border/80 bg-card/60 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="size-8 rounded-full border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Back to home"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Sparkles className="size-4.5" />
              </div>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-semibold leading-none">
                  Glowmi SkinGPT
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                  AI v2.4
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Dermatology & Cosmetic Chemistry Assistant
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Welcome Banner when only initial message exists */}
        {messages.length === 1 && (
          <div className="text-center py-6 sm:py-8 max-w-lg mx-auto space-y-3">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-2xs">
              <Bot className="size-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-medium">
              What can I decode for your skin today?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ask about product compatibilities, anti-aging solutions, acne routines, or sunscreen choices.
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
        )}

        {/* Message Stream */}
        {messages.map((msg) => {
          const isUser = msg.sender === "user"

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end gap-2.5 max-w-2xl ml-auto">
                <div className="flex flex-col items-end">
                  <div className="bg-[#6355d8] text-white px-4 sm:px-5 py-3 rounded-2xl rounded-tr-xs shadow-xs max-w-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
                <div className="size-7 rounded-full bg-[#6355d8]/20 text-[#6355d8] flex items-center justify-center font-bold text-xs shrink-0 mt-1 uppercase">
                  {user?.fullName?.[0] || user?.name?.[0] || user?.email?.[0] || "U"}
                </div>
              </div>
            )
          }

          // AI Message
          return (
            <div key={msg.id} className="flex items-start gap-3 max-w-3xl">
              <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Sparkles className="size-4" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="bg-muted/50 dark:bg-stone-900 border border-border/70 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-2xs">
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-light text-foreground">
                    {msg.text}
                  </p>

                  {/* Product Recommendation Card embedded */}
                  {msg.product && (
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-3 p-3 rounded-xl bg-card border border-border/80 shadow-xs max-w-md">
                        <img
                          src={msg.product.image}
                          alt={msg.product.title}
                          className="size-20 sm:size-24 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between text-center sm:text-left min-w-0">
                          <div>
                            <span className="text-[10px] font-semibold text-primary uppercase">
                              {msg.product.category}
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold truncate text-foreground">
                              {msg.product.title}
                            </h4>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {msg.product.subtitle}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <span className="text-sm font-bold text-foreground">
                              ${msg.product.price}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedProduct(msg.product || null)}
                              className="px-3 py-1 bg-[#2b2e32] hover:bg-[#1b1c1e] text-white rounded-lg text-xs font-medium cursor-pointer transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Bottom Action Bar */}
                <div className="flex items-center gap-3 px-1 text-muted-foreground text-xs">
                  <span className="text-[10px]">{msg.timestamp}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(msg.text, msg.id)}
                    className="hover:text-foreground p-1 transition-colors flex items-center gap-1 text-[11px]"
                    title="Copy text"
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
                  <button type="button" className="hover:text-foreground p-1" title="Helpful">
                    <ThumbsUp className="size-3" />
                  </button>
                  <button type="button" className="hover:text-foreground p-1" title="Not helpful">
                    <ThumbsDown className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing Animation Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 max-w-lg">
            <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <Sparkles className="size-4 animate-spin" />
            </div>
            <div className="bg-muted/50 border border-border/70 rounded-2xl rounded-tl-xs py-3.5 px-5 flex items-center gap-1.5 shadow-2xs">
              <span className="size-2 rounded-full bg-primary animate-bounce" />
              <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
              <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-muted-foreground ml-2">Consulting skin database...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Floating Prompt Dock */}
      <footer className="p-4 border-t border-border/60 bg-card/40 backdrop-blur-md shrink-0">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Quick Prompts Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["Acne breakout steps", "Mineral vs Chemical SPF", "Niacinamide routine", "Repair skin barrier"].map(
              (q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="shrink-0 px-3 py-1 rounded-full border border-border/70 bg-card hover:border-primary/50 text-[11px] text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
                >
                  {q}
                </button>
              )
            )}
          </div>

          {/* Input Capsule Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2 rounded-2xl border-2 border-border/80 focus-within:border-[#6355d8] bg-background p-2 transition-all shadow-xs"
          >
            {/* File Attachment Camera */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  showToast("Photo attached for AI analysis")
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="size-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
              title="Attach skin photo"
            >
              <Camera className="size-5" />
            </button>

            {/* Input textarea/field */}
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              rows={1}
              placeholder="Ask anything about your skin concerns, ingredients, or routines..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none py-1.5 px-2 max-h-28"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="size-9 sm:size-10 rounded-xl bg-[#6355d8] hover:bg-[#5244c9] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
              title="Send prompt"
            >
              <Send className="size-4" />
            </button>
          </form>

          {/* Disclaimer Note */}
          <p className="text-[10px] text-center text-muted-foreground/80">
            Glowmi AI provides cosmetic skincare intelligence based on dermatological research. Always patch test new products.
          </p>
        </div>
      </footer>

      {/* Product Details Modal (When user clicks View Details) */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl bg-card p-5 shadow-2xl border border-border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 size-7 rounded-full bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-100">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {selectedProduct.category}
              </span>
              <h3 className="text-base font-serif font-medium text-foreground mt-0.5">
                {selectedProduct.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedProduct.subtitle}</p>
              <div className="text-lg font-semibold text-foreground mt-2">
                ${selectedProduct.price}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  addToCart(
                    {
                      id: selectedProduct.id,
                      title: selectedProduct.title,
                      price: selectedProduct.price,
                      image: selectedProduct.image,
                      stock: 10,
                      is_available: true,
                    } as Product,
                    1
                  )
                  showToast(`"${selectedProduct.title}" added to cart!`)
                  setSelectedProduct(null)
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#2b2e32] hover:bg-[#1a1c1e] text-white text-xs font-medium flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <ShoppingBag className="size-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleFavorite({
                    id: selectedProduct.id,
                    title: selectedProduct.title,
                    price: selectedProduct.price,
                    image: selectedProduct.image,
                    stock: 10,
                    is_available: true,
                  } as Product)
                  showToast(
                    isFavorite(selectedProduct.id)
                      ? "Removed from favorites"
                      : "Saved to favorites!"
                  )
                }}
                className="size-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-rose-500 cursor-pointer"
                title="Favorite"
              >
                <Heart
                  className={`size-4 ${
                    isFavorite(selectedProduct.id) ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  )
}
