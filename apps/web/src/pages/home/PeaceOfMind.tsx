import * as React from "react"
import { Sparkles, Heart, ShieldCheck, Box } from "lucide-react"

interface ValueItem {
  icon: React.ReactNode
  title: string
  subtitle: string
}

const values: ValueItem[] = [
  {
    icon: <Sparkles size={24} strokeWidth={1.5} color="#222" />,
    title: "100% Organic & Clean",
    subtitle: "Ethically sourced organic botanicals",
  },
  {
    icon: <Heart size={24} strokeWidth={1.5} color="#222" />,
    title: "Cruelty-Free & Vegan",
    subtitle: "Never tested on animals, 100% vegan",
  },
  {
    icon: <ShieldCheck size={24} strokeWidth={1.5} color="#222" />,
    title: "Dermatologist Tested",
    subtitle: "Clinically verified for sensitive skin",
  },
  {
    icon: <Box size={24} strokeWidth={1.5} color="#222" />,
    title: "Sustainable Packaging",
    subtitle: "Recyclable glass & eco-friendly materials",
  },
]

export function PeaceOfMind() {
  return (
    <section
      style={{
        width: "100%",
        padding: "70px 24px 75px",
        background: "#ffffff",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", textAlign: "center" }}>
        {/* Section Heading */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 500,
            color: "#1a1a1a",
            letterSpacing: "0.01em",
            margin: "0 0 12px",
          }}
        >
          Skincare Peace of Mind
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            fontSize: 13.5,
            color: "#777777",
            maxWidth: 580,
            margin: "0 auto 52px",
            lineHeight: 1.5,
          }}
        >
          Formulated without compromise, engineered for your skin&apos;s ultimate well-being
        </p>

        {/* 4 Pillars Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
            paddingTop: 8,
          }}
        >
          {values.map((v, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "16px 12px",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  border: "1px solid #e5e2da",
                  background: "#f9f8f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.transform = "scale(1.08)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.transform = "scale(1)"
                }}
              >
                {v.icon}
              </div>

              <h4
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#222",
                  margin: "0 0 6px",
                  letterSpacing: "0.01em",
                }}
              >
                {v.title}
              </h4>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 12,
                  color: "#777",
                  margin: 0,
                  maxWidth: 200,
                  lineHeight: 1.5,
                }}
              >
                {v.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PeaceOfMind
