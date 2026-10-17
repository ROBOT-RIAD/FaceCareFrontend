import { Link, NavLink } from "react-router"
import {
  Languages,
  MapPin,
  Mail,
  Info,
  ShoppingBag,
} from "lucide-react"

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Skin Intelligence", href: "/skin-intelligence" },
]

export function Navbar() {

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "#fff",
        borderBottom: "1px solid #e8e8e8",
      }}
    >
      {/* Top row: Logo centered, SIGN IN right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1140,
          margin: "0 auto",
          padding: "16px 24px 8px",
        }}
      >
        {/* Empty spacer left */}
        <div style={{ flex: 1 }} />

        {/* Logo center */}
        <Link
          to="/"
          style={{
            flex: "0 0 auto",
            textDecoration: "none",
            color: "#1a1a1a",
            letterSpacing: "0.26em",
            fontSize: 24,
            fontWeight: 600,
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          }}
        >
          GLOWMI
        </Link>

        {/* Sign In right */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 20px",
              background: "#222",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textDecoration: "none",
              borderRadius: 6,
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              transition: "background 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = "#444"
              el.style.transform = "translateY(-1px)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = "#222"
              el.style.transform = "translateY(0)"
            }}
          >
            SIGN IN
          </Link>
        </div>
      </div>

      {/* Bottom row: Nav links left, Icons right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1140,
          margin: "0 auto",
          padding: "2px 24px 12px",
        }}
      >
        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#111" : "#555",
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                letterSpacing: "0.01em",
                paddingBottom: 2,
                borderBottom: isActive ? "1.5px solid #111" : "1.5px solid transparent",
                transition: "color 0.15s, border-color 0.15s",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Action icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            type="button"
            aria-label="Toggle Language"
            style={{
              ...iconLinkStyle,
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <Languages size={18} strokeWidth={1.5} />
          </button>
          <Link to="/skin-intelligence" aria-label="Skin Intelligence Info" style={iconLinkStyle}>
            <Info size={18} strokeWidth={1.5} />
          </Link>
          <Link to="/contact" aria-label="Mail" style={iconLinkStyle}>
            <Mail size={18} strokeWidth={1.5} />
          </Link>
          <Link to="/store" aria-label="Location" style={iconLinkStyle}>
            <MapPin size={18} strokeWidth={1.5} />
          </Link>
          <Link to="/cart" aria-label="Cart" style={iconLinkStyle}>
            <ShoppingBag size={18} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  )
}

const iconLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#444",
  textDecoration: "none",
  transition: "color 0.15s",
}

export default Navbar
