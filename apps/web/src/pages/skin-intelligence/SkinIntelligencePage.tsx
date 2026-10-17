import * as React from "react"

// Dummy Image URLs - easily replaceable by user
const DUMMY_DESERT_HERO =
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80"
const DUMMY_GLASS_BLOCK =
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
const DUMMY_MOLECULE_DROPLET =
  "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
const DUMMY_JAR_SHADOW =
  "https://images.unsplash.com/photo-1608248597359-231a54b38bfd?auto=format&fit=crop&w=800&q=80"

export default function SkinIntelligencePage() {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [emailInput, setEmailInput] = React.useState("")
  const [joined, setJoined] = React.useState(false)

  const handleJoinCircle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) return
    setJoined(true)
    setTimeout(() => {
      setJoined(false)
      setModalOpen(false)
      setEmailInput("")
    }, 2500)
  }

  return (
    <div style={{ width: "100%", overflowX: "hidden", background: "#ffffff" }}>
      {/* 1. Desert Sunset Landscape Hero Banner */}
      <section
        style={{
          width: "100%",
          height: "clamp(340px, 48vh, 520px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={DUMMY_DESERT_HERO}
          alt="Born beneath the Arabian sun - Desert sand dunes at sunset"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 60%",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.02) 60%, rgba(255,255,255,0.15) 100%)",
          }}
        />
      </section>

      {/* 2. OUR LEGACY Intro */}
      <section
        style={{
          padding: "72px 24px 56px",
          textAlign: "center",
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            fontSize: 12,
            letterSpacing: "0.22em",
            fontWeight: 600,
            color: "#888888",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          OUR LEGACY
        </div>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "clamp(32px, 4.4vw, 54px)",
            fontWeight: 400,
            lineHeight: 1.25,
            color: "#1a1a1a",
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          Some things cannot be rushed.
          <br />
          True radiance is cultivated over time.
        </h1>
      </section>

      {/* 3. Story Block 1: Glass Cube Image Left | Text Right */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "48px 24px 72px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            gap: 64,
            alignItems: "center",
          }}
          className="legacy-grid"
        >
          {/* Left: Glass Block / Logo Emblem Image */}
          <div
            style={{
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 14px 38px rgba(0, 0, 0, 0.06)",
              background: "#f4f1ea",
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={DUMMY_GLASS_BLOCK}
              alt="Glowmi embossed glass emblem casting warm amber sunlight"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Right: Narrative Text */}
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 14.5,
              lineHeight: 1.75,
              color: "#3a3a3a",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <p style={{ margin: 0 }}>
              Glowmi was born from a simple realization: the skin we live in
              deserves more than generic solutions. In a world where skin
              constantly adapts to changing environments, stress, and modern
              lifestyles, maintaining its natural balance has become more
              challenging than ever.
            </p>

            <p style={{ margin: 0 }}>
              Born beneath the Arabian sun, Glowmi began with a vision to unite
              advanced skin science with a deep respect for the skin&apos;s
              natural intelligence. What started as a pursuit of better skincare
              evolved into the foundation of a science-backed skincare house.
              At Glowmi, we believe true luxury lies in precision. Every formula
              is developed through meticulous research, combining clinical
              actives with botanical hydration to support the skin&apos;s
              resilience and long-term health.
            </p>

            <div style={{ paddingTop: 6 }}>
              <p
                style={{
                  margin: "0 0 6px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                }}
              >
                For Glowmi is more than formulation.
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 22,
                  fontStyle: "italic",
                  color: "#1a1a1a",
                }}
              >
                It is a ritual.
              </p>
            </div>

            <p style={{ margin: 0 }}>
              A quiet moment of calm in the middle of a busy life. A daily
              commitment to nurturing the skin rather than overwhelming it. A
              belief that true beauty is not created overnight — it is
              cultivated patiently.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Story Block 2: Text Left | Macro Molecular Droplet Image Right */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "56px 24px 72px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
          className="legacy-grid"
        >
          {/* Left: Science Narrative */}
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 14.5,
              lineHeight: 1.75,
              color: "#3a3a3a",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: "clamp(30px, 3.6vw, 44px)",
                  fontWeight: 500,
                  color: "#1a1a1a",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Science with
                <br />
                Intelligence.
              </h2>
            </div>

            <p style={{ margin: 0 }}>
              We do not believe in marketing mysteries or hype-accelerated
              claims. We believe in meticulous consistency.
            </p>

            <p style={{ margin: 0 }}>
              Our formulas are developed through months of careful research,
              balancing clinical actives with biomimetic hydration designed to
              support the skin&apos;s natural resilience. The result is skincare
              that feels refined and luxurious, yet performs with clinical
              precision.
            </p>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <li style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 18, color: "#1a1a1a" }}>•</span>
                <span>
                  <strong style={{ color: "#1a1a1a" }}>Clinical Actives:</strong>{" "}
                  Only the ingredients that matter, at the exact concentrations
                  that deliver real results.
                </span>
              </li>

              <li style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 18, color: "#1a1a1a" }}>•</span>
                <span>
                  <strong style={{ color: "#1a1a1a" }}>
                    Climate-Adaptive Hydration:
                  </strong>{" "}
                  Weightless hydration designed to support the skin in
                  constantly changing environments.
                </span>
              </li>

              <li style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 18, color: "#1a1a1a" }}>•</span>
                <span>
                  <strong style={{ color: "#1a1a1a" }}>
                    Melanin-Aware Formulations:
                  </strong>{" "}
                  Created to respect and support the natural depth and diversity
                  of skin tones.
                </span>
              </li>
            </ul>
          </div>

          {/* Right: Macro Droplet Image */}
          <div
            style={{
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 14px 38px rgba(0, 0, 0, 0.06)",
              background: "#fdf8ee",
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={DUMMY_MOLECULE_DROPLET}
              alt="Macro active serum droplet with suspended molecular bond structure"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>
      </section>

      {/* 5. Story Block 3: Image Left | Text Right */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "56px 24px 84px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            gap: 64,
            alignItems: "center",
          }}
          className="legacy-grid"
        >
          {/* Left: Skincare Jar on Stone Table with Sunlight Blinds */}
          <div
            style={{
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 14px 38px rgba(0, 0, 0, 0.06)",
              background: "#eae7df",
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={DUMMY_JAR_SHADOW}
              alt="Crafted glass jar on marble table with window blinds sunlight shadows"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Right: Made for the conscious */}
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 14.5,
              lineHeight: 1.75,
              color: "#3a3a3a",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(30px, 3.6vw, 44px)",
                fontWeight: 500,
                color: "#1a1a1a",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Made for the conscious.
            </h2>

            <p style={{ margin: 0 }}>
              You expect a certain standard from the things you bring into your
              life, and your daily skincare ritual should be no different.
            </p>

            <p style={{ margin: 0 }}>
              Glowmi is for those who read the label, who appreciate the weight
              of a beautifully crafted glass bottle, and who demand results they
              can genuinely trust.
            </p>

            <p style={{ margin: 0 }}>
              We are not here to offer quick fixes or fleeting trends.
            </p>

            {/* Blockquote callout */}
            <blockquote
              style={{
                margin: "12px 0 0",
                paddingLeft: 18,
                borderLeft: "2px solid #1a1a1a",
                fontStyle: "italic",
                color: "#222",
                fontSize: 15.5,
                lineHeight: 1.6,
              }}
            >
              &ldquo;We provide a calm, grounding ritual that honors your
              skin&apos;s natural architecture.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* 6. Dark Philosophy & Invitation Banner */}
      <section
        style={{
          width: "100%",
          background: "#232528",
          color: "#ffffff",
          padding: "84px 24px 76px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          {/* Tagline */}
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 11.5,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: 20,
            }}
          >
            A SCIENTIFIC STANDARD
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(28px, 3.8vw, 46px)",
              fontWeight: 400,
              lineHeight: 1.3,
              margin: "0 0 20px",
              letterSpacing: "0.01em",
            }}
          >
            Real science.
            <br />
            Deep heritage.
            <br />
            And a profound respect for the skin you&apos;re in.
          </h2>

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 13.5,
              lineHeight: 1.7,
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: 620,
              margin: "0 auto 36px",
            }}
          >
            We invite you to experience skincare formulated with clinical
            precision and deep heritage. Explore our collections and find the
            formulas designed to support your skin&apos;s journey.
          </p>

          {/* Join inside circle button */}
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: "inline-block",
              padding: "12px 34px",
              background: "transparent",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.85)",
              borderRadius: 24,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.06em",
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = "#ffffff"
              el.style.color = "#232528"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = "transparent"
              el.style.color = "#ffffff"
            }}
          >
            Join the inside circle
          </button>

          {/* Divider Line */}
          <div
            style={{
              width: 160,
              height: 1,
              background: "rgba(255, 255, 255, 0.2)",
              margin: "54px auto 36px",
            }}
          />

          {/* Bottom Credo */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              OUR PROMISE: INTEGRITY IN EVERY DROP.
            </div>

            <div
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: 17,
                fontStyle: "italic",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              Science. Heritage. and an enduring respect for the skin you live in.
            </div>

            <div
              style={{
                fontSize: 12.5,
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Born beneath the Arabian sun.
              <br />
              Perfected by science.
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.22em",
                color: "#ffffff",
                marginTop: 10,
              }}
            >
              WELCOME TO GLOWMI
            </div>
          </div>
        </div>
      </section>

      {/* Inside Circle Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: "36px 32px",
              maxWidth: 440,
              width: "100%",
              boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: 28,
                fontWeight: 500,
                margin: "0 0 10px",
                color: "#1a1a1a",
              }}
            >
              Join The Inside Circle
            </h3>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                fontSize: 13.5,
                color: "#666",
                margin: "0 0 24px",
                lineHeight: 1.5,
              }}
            >
              Receive early access to formulations, clinical notes, and private
              skincare rituals.
            </p>

            {joined ? (
              <div
                style={{
                  background: "#edf7f0",
                  color: "#1b6334",
                  padding: "16px",
                  borderRadius: 6,
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 13.5,
                }}
              >
                Welcome to the inside circle.
              </div>
            ) : (
              <form
                onSubmit={handleJoinCircle}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "12px",
                    background: "#222",
                    color: "#fff",
                    borderRadius: 6,
                    border: "none",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 13,
                  }}
                >
                  Join Now
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .legacy-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </div>
  )
}
