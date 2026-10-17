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
  volume?: string
}

const allProducts: Product[] = [
  {
    id: 1,
    badge: "Lip Oil",
    image: lipOilImg,
    name: "Radiant Satin Lip Oil",
    description: "Nourishing, smoothing, natural shine",
    skinType: "All skin types",
    volume: "15ml / 0.5 fl.oz",
  },
  {
    id: 2,
    badge: "Serum",
    image: serumImg,
    name: "Celestial Glow Brightening Serum",
    description: "Brightening, barrier strengthening, hydration, texture improvement",
    skinType: "All skin types, including sensitive",
    volume: "30ml / 1.0 fl.oz",
  },
  {
    id: 3,
    badge: "Sleeping Mask",
    image: maskImg,
    name: "Lunar Restore Sleeping Mask",
    description: "Deep hydration, overnight repair, Rejuvenating, glow restoration",
    skinType: "All skin types, including sensitive",
    volume: "50ml / 1.7 fl.oz",
  },
  {
    id: 4,
    badge: "Serum",
    image: serumImg,
    name: "Luminous Veil Cellular Serum",
    description: "Antioxidant protection, pore refining, even skin tone",
    skinType: "Normal to combination skin",
    volume: "30ml / 1.0 fl.oz",
  },
]

export default function ProductsPage() {
  const [current, setCurrent] = React.useState(0)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const visible = 3
  const maxIndex = Math.max(0, allProducts.length - visible)

  const prev = () => setCurrent((c) => Math.max(c - 1, 0))
  const next = () => setCurrent((c) => Math.min(c + 1, maxIndex))

  return (
    <div style={{ width: "100%", background: "#ffffff", minHeight: "80vh" }}>
      <section
        style={{
          width: "100%",
          padding: "60px 0 90px",
          background: "#ffffff",
        }}
      >
        {/* Carousel wrapper */}
        <div
          style={{
            position: "relative",
            maxWidth: 1180,
            margin: "0 auto",
            padding: "0 40px",
          }}
        >
          {/* Left Arrow */}
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous"
            style={{
              position: "absolute",
              left: 10,
              top: 175,
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid #e2e0dc",
              background: "#ffffff",
              cursor: current === 0 ? "default" : "pointer",
              opacity: current === 0 ? 0.35 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, opacity 0.15s, transform 0.12s",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
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
              el.style.background = "#ffffff"
              el.style.transform = "translateY(-50%) scale(1)"
            }}
          >
            <ArrowLeft size={18} strokeWidth={2} color="#111" />
          </button>

          {/* Cards Track Container */}
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                gap: 24,
                transform: `translateX(calc(-${current} * (100% / ${visible} + 8px)))`,
                transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {allProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    flex: `0 0 calc((100% - ${(visible - 1) * 24}px) / ${visible})`,
                    background: "transparent",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Product Image Box */}
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
                        color: "#ffffff",
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

                  {/* View Details Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        padding: "11px 0",
                        border: "1px solid #1a1a1a",
                        background: "#ffffff",
                        color: "#1a1a1a",
                        fontSize: 13,
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                        cursor: "pointer",
                        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                        transition: "background 0.15s, color 0.15s",
                        boxSizing: "border-box",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = "#1a1a1a"
                        el.style.color = "#ffffff"
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = "#ffffff"
                        el.style.color = "#1a1a1a"
                      }}
                    >
                      View Details
                    </button>
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
              top: 175,
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid #e2e0dc",
              background: "#ffffff",
              cursor: current === maxIndex ? "default" : "pointer",
              opacity: current === maxIndex ? 0.35 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, opacity 0.15s, transform 0.12s",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
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
              el.style.background = "#ffffff"
              el.style.transform = "translateY(-50%) scale(1)"
            }}
          >
            <ArrowRight size={18} strokeWidth={2} color="#111" />
          </button>
        </div>
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              maxWidth: 580,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "#f7f7f6",
                height: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: "#2d3134",
                  color: "#fff",
                  fontSize: 12,
                  padding: "4px 14px",
                  borderRadius: 20,
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                }}
              >
                {selectedProduct.badge}
              </span>

              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                style={{
                  maxHeight: "90%",
                  maxWidth: "90%",
                  objectFit: "contain",
                }}
              />
            </div>

            <div style={{ padding: "28px 28px 32px" }}>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: "0 0 8px",
                }}
              >
                {selectedProduct.name}
              </h3>

              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 12.5,
                  color: "#777",
                  marginBottom: 16,
                }}
              >
                {selectedProduct.volume} • {selectedProduct.skinType}
              </div>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#444",
                  margin: "0 0 24px",
                }}
              >
                {selectedProduct.description}
              </p>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#222",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  }}
                  onClick={() => setSelectedProduct(null)}
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  style={{
                    padding: "12px 20px",
                    background: "#f4f4f4",
                    color: "#333",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  }}
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
