import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import serumImg from "@/assets/home/product_serum.jpg"
import maskImg from "@/assets/home/product_sleeping_mask.jpg"
import lipOilImg from "@/assets/home/product_lip_oil.jpg"

interface Product {
  id: number
  badge: string
  image: string
  name: string
  description: string
  skinType: string
}

const products: Product[] = [
  {
    id: 1,
    badge: "Lip Oil",
    image: lipOilImg,
    name: "Radiant Satin Lip Oil",
    description: "Nourishing, smoothing, natural shine",
    skinType: "All skin types",
  },
  {
    id: 2,
    badge: "Serum",
    image: serumImg,
    name: "Celestial Glow Brightening Serum",
    description: "Brightening, barrier strengthening, hydration, texture improvement",
    skinType: "All skin types, including sensitive",
  },
  {
    id: 3,
    badge: "Sleeping Mask",
    image: maskImg,
    name: "Lunar Restore Sleeping Mask",
    description: "Deep hydration, overnight repair, Rejuvenating, glow restoration",
    skinType: "All skin types, including sensitive",
  },
  {
    id: 4,
    badge: "Serum",
    image: serumImg,
    name: "Luminous Veil Serum",
    description: "Pore-refining, even tone, antioxidant protection",
    skinType: "Normal to oily skin",
  },
]

export function BestProducts() {
  const [current, setCurrent] = React.useState(0)
  const visible = 3
  const maxIndex = products.length - visible

  const prev = () => setCurrent((c) => Math.max(c - 1, 0))
  const next = () => setCurrent((c) => Math.min(c + 1, maxIndex))

  return (
    <section
      style={{
        width: "100%",
        padding: "64px 0 72px",
        background: "#fff",
      }}
    >
      {/* Heading */}
      <h2
        style={{
          textAlign: "center",
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: "clamp(26px, 3.2vw, 40px)",
          fontWeight: 500,
          color: "#1a1a1a",
          letterSpacing: "0.01em",
          margin: "0 0 48px",
        }}
      >
        Best Products
      </h2>

      {/* Carousel wrapper */}
      <div style={{ position: "relative", maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        {/* Left Arrow */}
        <button
          onClick={prev}
          disabled={current === 0}
          aria-label="Previous"
          style={{
            position: "absolute",
            left: 10,
            top: 170,
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "1px solid #e0deda",
            background: "#fff",
            cursor: current === 0 ? "default" : "pointer",
            opacity: current === 0 ? 0.35 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s, opacity 0.15s, transform 0.12s",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            if (current !== 0) {
              const el = e.currentTarget as HTMLElement
              el.style.background = "#f7f7f7"
              el.style.transform = "translateY(-50%) scale(1.05)"
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = "#fff"
            el.style.transform = "translateY(-50%) scale(1)"
          }}
        >
          <ArrowLeft size={18} strokeWidth={2} color="#111" />
        </button>

        {/* Cards track */}
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              gap: 24,
              transform: `translateX(calc(-${current} * (100% / ${visible} + 8px)))`,
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  flex: `0 0 calc((100% - ${(visible - 1) * 24}px) / ${visible})`,
                  background: "transparent",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Product Image Box with soft background and floating badge */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1/1",
                    background: "#f7f7f6",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  {/* Badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      zIndex: 2,
                      display: "inline-block",
                      background: "#2d3134",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                      padding: "5px 16px",
                      borderRadius: 20,
                      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    }}
                  >
                    {product.badge}
                  </span>

                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                      transition: "transform 0.35s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.transform = "scale(1.03)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
                    }
                  />
                </div>

                {/* Description & Skin Type */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginBottom: 20,
                    minHeight: 68,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#1a1a1a",
                      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                      lineHeight: 1.45,
                    }}
                  >
                    {product.description}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#666666",
                      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    }}
                  >
                    {product.skinType}
                  </p>
                </div>

                {/* View Details */}
                <div>
                  <a
                    href={`/products/${product.id}`}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "center",
                      padding: "11px 0",
                      border: "1px solid #1a1a1a",
                      background: "#fff",
                      color: "#1a1a1a",
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                      textDecoration: "none",
                      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                      transition: "background 0.15s, color 0.15s",
                      boxSizing: "border-box",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = "#1a1a1a"
                      el.style.color = "#fff"
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = "#fff"
                      el.style.color = "#1a1a1a"
                    }}
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={next}
          disabled={current === maxIndex}
          aria-label="Next"
          style={{
            position: "absolute",
            right: 10,
            top: 170,
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "1px solid #e0deda",
            background: "#fff",
            cursor: current === maxIndex ? "default" : "pointer",
            opacity: current === maxIndex ? 0.35 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s, opacity 0.15s, transform 0.12s",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            if (current !== maxIndex) {
              const el = e.currentTarget as HTMLElement
              el.style.background = "#f7f7f7"
              el.style.transform = "translateY(-50%) scale(1.05)"
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = "#fff"
            el.style.transform = "translateY(-50%) scale(1)"
          }}
        >
          <ArrowRight size={18} strokeWidth={2} color="#111" />
        </button>
      </div>
    </section>
  )
}
