import heroFace from "@/assets/home/hero_face.jpg"
import { BestProducts } from "./BestProducts"
import { HowItWorks } from "./HowItWorks"
import { ProductLineup } from "./ProductLineup"
import { LifestyleBanner } from "./LifestyleBanner"
import { Ingredients } from "./Ingredients"
import { SciencePerformance } from "./SciencePerformance"
import { PeaceOfMind } from "./PeaceOfMind"
import { ContactSection } from "./ContactSection"
import { BottomBanner } from "./BottomBanner"

export default function Homepage() {
  return (
    <div style={{ width: "100%", overflowX: "hidden", background: "#ffffff" }}>
      {/* 1. Hero Section */}
      <section
        style={{
          width: "100%",
          minHeight: "72vh",
          maxHeight: 760,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          background: "#f7f5f2",
        }}
        className="hero-section"
      >
        {/* Full-width editorial hero image with woman's face on left */}
        <img
          src={heroFace}
          alt="Glowmi – The Essence of Timeless Glow"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "left center",
            display: "block",
          }}
        />

        {/* Soft gradient wash ensuring right-side text clarity */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(255,255,255,0) 25%, rgba(247, 245, 242, 0.4) 50%, rgba(247, 245, 242, 0.88) 75%, rgba(247, 245, 242, 0.95) 100%)",
          }}
          className="hero-overlay"
        />

        {/* Content container — positioned on right */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              maxWidth: 480,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 24,
            }}
            className="hero-content"
          >
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(34px, 4.4vw, 56px)",
                fontWeight: 500,
                color: "#1a1a1a",
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: "0.01em",
              }}
            >
              The Essence of Timeless Glow
            </h1>

            <a
              href="/products"
              style={{
                display: "inline-block",
                padding: "13px 44px",
                background: "#222222",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textDecoration: "none",
                borderRadius: 4,
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                cursor: "pointer",
                transition: "background 0.18s, transform 0.12s, box-shadow 0.18s",
                boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = "#444444"
                el.style.transform = "translateY(-1px)"
                el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.16)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = "#222222"
                el.style.transform = "translateY(0)"
                el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.12)"
              }}
            >
              Explore
            </a>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-section {
              min-height: 520px !important;
            }
            .hero-overlay {
              background: rgba(255, 255, 255, 0.75) !important;
            }
            .hero-content {
              margin: 0 auto !important;
              max-width: 100% !important;
            }
          }
        `}</style>
      </section>

      {/* 2. Best Products Carousel */}
      <BestProducts />

      {/* 3. How Glowmi Transforms Your Skin */}
      <HowItWorks />

      {/* 4. Glowmi Product Lineup Showcase */}
      <ProductLineup />

      {/* 5. Lifestyle Routine Full-Width Banner */}
      <LifestyleBanner />

      {/* 6. Intelligent Ingredients, Proven Results */}
      <Ingredients />

      {/* 7. Our Science and Performance (Clinical Studies) */}
      <SciencePerformance />

      {/* 8. Skincare Peace of Mind (4 Brand Values) */}
      <PeaceOfMind />

      {/* 9. Product Spotlight & Contact Us */}
      <ContactSection />

      {/* 10. Pure Skin. Intelligent Wellness. Wide CTA Banner */}
      <BottomBanner />
    </div>
  )
}