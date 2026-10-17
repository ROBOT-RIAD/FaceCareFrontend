
interface StepItem {
  step: string
  title: string
  description: string
}

const steps: StepItem[] = [
  {
    step: "01",
    title: "Deep Cellular Cleanse",
    description:
      "Gently removes impurities and environmental micro-pollutants while balancing natural pH, priming skin for optimum nutrient absorption.",
  },
  {
    step: "02",
    title: "Intensive Nutrient Infusion",
    description:
      "Delivers highly concentrated active peptides, hyaluronic acid, and botanical vitamins deep into dermal layers for cellular rejuvenation.",
  },
  {
    step: "03",
    title: "Lock & Protect Barrier",
    description:
      "Seals vital hydration with a lipid-nourishing micro-film, shielding against environmental stressors and locking in all-day radiance.",
  },
]

export function HowItWorks() {
  return (
    <section
      style={{
        width: "100%",
        padding: "80px 24px 90px",
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
          How Glowmi Transforms Your Skin
        </h2>

        {/* Section Subtitle */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            fontSize: 14,
            color: "#777777",
            maxWidth: 640,
            margin: "0 auto 52px",
            lineHeight: 1.6,
          }}
        >
          A scientifically formulated 3-step ritual engineered for cellular
          rejuvenation and lasting radiance
        </p>

        {/* 3 Step Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          {steps.map((item) => (
            <div
              key={item.step}
              style={{
                background: "#ffffff",
                border: "1px solid #ebe8e2",
                borderRadius: 16,
                padding: "44px 32px 40px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = "translateY(-4px)"
                el.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.05)"
                el.style.borderColor = "#ded8cf"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = "translateY(0)"
                el.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.02)"
                el.style.borderColor = "#ebe8e2"
              }}
            >
              {/* Step Number */}
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 42,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  lineHeight: 1,
                  marginBottom: 18,
                  letterSpacing: "0.04em",
                }}
              >
                {item.step}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#222222",
                  margin: "0 0 12px",
                  letterSpacing: "0.01em",
                }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: "#6b6b6b",
                  margin: 0,
                  maxWidth: 300,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
