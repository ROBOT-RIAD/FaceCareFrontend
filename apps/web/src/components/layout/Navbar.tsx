import * as React from "react"
import { Link, NavLink, useLocation } from "react-router"
import {
  Menu,
  Moon,
  ShoppingBag,
  Sun,
  User,
  X,
  Heart,
  ChevronRight,
  ShieldCheck,
  Percent,
  Sparkles,
  MessageSquare,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { useTheme } from "@/components/theme-provider.tsx"
import companyLogo from "@/assets/home/navbar/company_logo.png"

interface NavItem {
  label: string
  href: string
  badge?: string
  icon?: React.ComponentType<{ className?: string }>
  isHighlight?: boolean
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  {
    label: "AI Skin Intelligence",
    href: "/ai-skin-intelligence",
    badge: "AI",
    icon: Sparkles,
    isHighlight: true,
  },
  {
    label: "Chat Assistant",
    href: "/chat-assistant",
    icon: MessageSquare,
    isHighlight: true,
  },
  { label: "About", href: "/about" },
]

const categories = [
  "Cleansers",
  "Serums & Oils",
  "Moisturizers",
  "Sun Protection",
  "Face Masks",
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [cartCount] = React.useState(2)
  const [wishlistCount] = React.useState(1)

  const { theme, setTheme } = useTheme()
  const location = useLocation()

  // Track scroll position to add elevated style
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when navigating
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Toggle theme helper
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-primary/95 text-primary-foreground px-4 py-1.5 text-xs font-medium tracking-wide">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-primary-foreground/80" />
            <span>100% Certified Organic & Dermatologist Tested</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center gap-1.5">
            <Percent className="size-3.5 text-amber-300" />
            <span>
              Get <strong>15% OFF</strong> your first order with code:{" "}
              <span className="underline decoration-dotted font-semibold">
                GLOW15
              </span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] opacity-90">
            <span>Free Shipping over $45</span>
            <span>•</span>
            <Link to="/track-order" className="hover:underline">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full border-b backdrop-blur-md transition-all duration-200 ${isScrolled
          ? "border-border/60 bg-background/85 shadow-xs"
          : "border-border/30 bg-background/70"
          }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden -ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>

            {/* Brand Logo */}
            <Link
              to="/"
              className="group flex items-center transition-transform hover:opacity-95"
            >
              <img
                src={companyLogo}
                alt="Glowmi"
                className="h-11 sm:h-12 w-auto object-contain dark:brightness-0 dark:invert transition-all duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links & Action Buttons */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              if (item.isHighlight) {
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      `relative inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-150 ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : item.badge === "AI"
                            ? "bg-primary/10 hover:bg-primary/15 text-primary border-primary/30 hover:border-primary/50 shadow-2xs"
                            : "bg-muted/70 hover:bg-muted text-foreground border-border/80 hover:border-border"
                      }`
                    }
                  >
                    {Icon && <Icon className="size-3.5" />}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-primary/20 dark:bg-primary/30 px-1.5 py-0.5 text-[9px] font-bold text-primary dark:text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )
              }

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `relative px-3.5 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
                      isActive
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`
                  }
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>

          {/* Right: Actions (Wishlist, Theme, Cart, User) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Wishlist Button */}
            <Link to="/wishlist" className="hidden sm:inline-flex">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Wishlist"
              >
                <Heart className="size-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Theme Toggle (Sun / Moon) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* User Account / Profile */}
            <Link to="/login">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Account"
              >
                <User className="size-5" />
              </Button>
            </Link>

            {/* Shopping Cart Button */}
            <Link to="/cart">
              <Button
                variant="default"
                size="sm"
                className="relative gap-1.5 rounded-full px-3 shadow-xs transition-transform active:scale-95"
              >
                <ShoppingBag className="size-4" />
                <span className="hidden sm:inline font-medium">Cart</span>
                <span className="flex size-4 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary">
                  {cartCount}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[calc(4rem+33px)] bottom-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl transition-all duration-300 animate-in slide-in-from-top-4 overflow-y-auto">
          <div className="mx-auto flex flex-col p-5 gap-6 max-w-lg">
            {/* Primary Nav Links */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3">
                Navigation
              </span>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-3 py-2.5 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : item.isHighlight
                            ? "bg-muted/50 text-foreground font-medium border border-border/40"
                            : "text-foreground hover:bg-muted"
                      }`
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      {Icon && (
                        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </span>
                      )}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </NavLink>
                )
              })}
            </div>

            {/* Quick Categories */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3">
                Popular Categories
              </span>
              <div className="flex flex-wrap gap-2 px-1">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Bottom User Actions */}
            <div className="mt-2 border-t border-border/70 pt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Theme Appearance
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="gap-2 rounded-full text-xs"
                >
                  {theme === "dark" ? (
                    <>
                      <Moon className="size-3.5" /> Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="size-3.5" /> Light Mode
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full rounded-xl gap-2">
                    <User className="size-4" />
                    Sign In
                  </Button>
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button className="w-full rounded-xl gap-2">
                    <ShoppingBag className="size-4" />
                    Cart ({cartCount})
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

