import * as React from "react"
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
      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "0 64px" }}>
        {/* Left Arrow */}
        <button
          onClick={prev}
          disabled={current === 0}
          aria-label="Previous"
          style={{
            position: "absolute",
            left: 8,
            top: "40%",
            transform: "translateY(-50%)",
            zIndex: 2,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: current === 0 ? "default" : "pointer",
            opacity: current === 0 ? 0.35 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s, opacity 0.15s",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            if (current !== 0) (e.currentTarget as HTMLElement).style.background = "#f5f5f5"
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#fff"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
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
                  background: "#f9f8f6",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #ececec",
                }}
              >
                {/* Badge */}
                <div style={{ padding: "14px 14px 0" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#222",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {product.badge}
                  </span>
                </div>

                {/* Product Image */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    overflow: "hidden",
                    background: "#f0eeeb",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.transform = "scale(1.04)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
                    }
                  />
                </div>

                {/* Info */}
                <div
                  style={{
                    padding: "16px 16px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 400,
                      color: "#333",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {product.description}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11,
                      color: "#888",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {product.skinType}
                  </p>
                </div>

                {/* View Details */}
                <div style={{ padding: "16px" }}>
                  <a
                    href={`/products/${product.id}`}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "center",
                      padding: "11px 0",
                      border: "1px solid #ccc",
                      background: "#fff",
                      color: "#222",
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      textDecoration: "none",
                      fontFamily: "'Inter', sans-serif",
                      transition: "background 0.15s, color 0.15s, border-color 0.15s",
                      boxSizing: "border-box",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = "#222"
                      el.style.color = "#fff"
                      el.style.borderColor = "#222"
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = "#fff"
                      el.style.color = "#222"
                      el.style.borderColor = "#ccc"
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
            right: 8,
            top: "40%",
            transform: "translateY(-50%)",
            zIndex: 2,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: current === maxIndex ? "default" : "pointer",
            opacity: current === maxIndex ? 0.35 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s, opacity 0.15s",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            if (current !== maxIndex) (e.currentTarget as HTMLElement).style.background = "#f5f5f5"
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#fff"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
