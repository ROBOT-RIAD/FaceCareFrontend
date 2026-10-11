import serumImg from "@/assets/home/product_serum.jpg"
import maskImg from "@/assets/home/product_sleeping_mask.jpg"

interface ProductItem {
  id: number
  title: string
  subtitle: string
  imageUrl: string
}

const productLine: ProductItem[] = [
  {
    id: 1,
    title: "Signature Packaging Box",
    subtitle: "Eco-certified luxury emerald carton",
    // Dummy image URL - easily replaceable by user
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    title: "Cellular Mist Toner",
    subtitle: "Ultra-fine hydrating essence",
    // Dummy image URL
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    title: "Restorative Cream Pack",
    subtitle: "Barrier rebuilding night formula",
    imageUrl: maskImg,
  },
  {
    id: 4,
    title: "Celestial Glow Serum",
    subtitle: "Active botanical concentrated elixir",
    imageUrl: serumImg,
  },
]

export function ProductLineup() {
  return (
    <section
      style={{
        width: "100%",
        padding: "70px 24px 80px",
        background: "#ffffff",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", textAlign: "center" }}>
        {/* Section Heading */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "clamp(26px, 3.2vw, 38px)",
            fontWeight: 500,
            color: "#1a1a1a",
            letterSpacing: "0.08em",
            margin: "0 0 44px",
            textTransform: "uppercase",
          }}
        >
          Glowmi
        </h2>

        {/* 4 Items Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          {productLine.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#f9f8f6",
                borderRadius: 8,
                border: "1px solid #ebe7df",
                padding: "24px 16px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 280,
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = "translateY(-4px)"
                el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = "translateY(0)"
                el.style.boxShadow = "none"
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    ; (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"
                  }}
                  onMouseLeave={(e) => {
                    ; (e.currentTarget as HTMLElement).style.transform = "scale(1)"
                  }}
                />
              </div>

              <div style={{ marginTop: 14, textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#222",
                    marginBottom: 3,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 11,
                    color: "#777",
                  }}
                >
                  {item.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductLineup
