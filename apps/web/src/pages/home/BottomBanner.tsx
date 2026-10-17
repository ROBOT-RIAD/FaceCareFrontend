import { Link } from "react-router"

// Dummy background image URL for smiling woman with citrus - user can update later
const DUMMY_ORANGE_BANNER_BG =
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1920&q=80"

export function BottomBanner() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: 380,
        height: "52vh",
        maxHeight: 520,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background Image: Smiling woman with citrus slice */}
      <img
        src={DUMMY_ORANGE_BANNER_BG}
        alt="Pure Skin Intelligent Wellness with radiant glow"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
          display: "block",
        }}
      />

      {/* Ambient Overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.45))",
        }}
      />

      {/* Centered Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 24px",
          maxWidth: 700,
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "clamp(30px, 4.2vw, 54px)",
            fontWeight: 500,
            color: "#ffffff",
            margin: "0 0 16px",
            letterSpacing: "0.02em",
            textShadow: "0 2px 14px rgba(0,0,0,0.5)",
          }}
        >
          Pure Skin. Intelligent Wellness.
        </h2>

        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            fontSize: 14.5,
            color: "rgba(255, 255, 255, 0.9)",
            margin: "0 auto 30px",
            maxWidth: 500,
            lineHeight: 1.6,
            textShadow: "0 1px 8px rgba(0,0,0,0.4)",
          }}
        >
          Discover transformative formulations engineered to awaken your skin&apos;s
          natural cellular vitality.
        </p>

        <Link
          to="/products"
          style={{
            display: "inline-block",
            padding: "13px 42px",
            background: "#222222",
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textDecoration: "none",
            borderRadius: 4,
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            transition: "background 0.18s, transform 0.15s, box-shadow 0.18s",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = "#3d3d3d"
            el.style.transform = "translateY(-2px)"
            el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)"
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = "#222222"
            el.style.transform = "translateY(0)"
            el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)"
          }}
        >
          Shop All
        </Link>
      </div>
    </section>
  )
}

export default BottomBanner
