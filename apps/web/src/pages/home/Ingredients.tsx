import * as React from "react"
import { Droplets, Sparkles, Flower2, Leaf, ArrowRight } from "lucide-react"

interface IngredientItem {
  icon: React.ReactNode
  name: string
  description: string
}

const ingredients: IngredientItem[] = [
  {
    icon: <Droplets size={22} strokeWidth={1.6} color="#2b2b2b" />,
    name: "Niacinamide",
    description:
      "Minimizes pore appearance, evens skin tone, and fortifies the delicate lipid barrier.",
  },
  {
    icon: <Sparkles size={22} strokeWidth={1.6} color="#2b2b2b" />,
    name: "Hyaluronic Complex",
    description:
      "Multi-depth molecular weights ensure deep 72-hour sustained moisture retention.",
  },
  {
    icon: <Flower2 size={22} strokeWidth={1.6} color="#2b2b2b" />,
    name: "Peptide Blend",
    description:
      "Stimulates collagen synthesis and cellular rejuvenation for bounce and firmness.",
  },
  {
    icon: <Leaf size={22} strokeWidth={1.6} color="#2b2b2b" />,
    name: "Botanical Extracts",
    description:
      "Potent bio-active botanical antioxidants shield against oxidative daily stressors.",
  },
]

export function Ingredients() {
  return (
    <section
      style={{
        width: "100%",
        padding: "85px 24px 90px",
        background: "#ffffff",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", textAlign: "center" }}>
        {/* Section Heading */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "clamp(26px, 3.2vw, 40px)",
            fontWeight: 500,
            color: "#1a1a1a",
            letterSpacing: "0.01em",
            margin: "0 0 14px",
          }}
        >
          Intelligent Ingredients, Proven Results
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            fontSize: 14,
            color: "#777777",
            maxWidth: 600,
            margin: "0 auto 52px",
            lineHeight: 1.6,
          }}
        >
          Pure botanical actives backed by clinical dermatology and modern science
        </p>

        {/* 4 Ingredient Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
            marginBottom: 44,
          }}
        >
          {ingredients.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                border: "1px solid #ebe7df",
                borderRadius: 14,
                padding: "36px 24px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = "translateY(-4px)"
                el.style.boxShadow = "0 10px 28px rgba(0,0,0,0.05)"
                el.style.borderColor = "#ded7cb"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = "translateY(0)"
                el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.02)"
                el.style.borderColor = "#ebe7df"
              }}
            >
              {/* Icon Container */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#f6f4f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#222222",
                  margin: "0 0 10px",
                }}
              >
                {item.name}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#6e6e6e",
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Link / CTA */}
        <a
          href="/ingredients"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: "#333333",
            textDecoration: "none",
            letterSpacing: "0.02em",
            borderBottom: "1px solid #999",
            paddingBottom: 2,
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.color = "#000"
            el.style.borderColor = "#000"
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.color = "#333333"
            el.style.borderColor = "#999"
          }}
        >
          Explore all our scientifically vetted formulas
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  )
}

export default Ingredients
