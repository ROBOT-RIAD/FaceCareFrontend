import * as React from "react"
import serumImg from "@/assets/home/product_serum.jpg"
import { Mail, Clock, Send, CheckCircle2 } from "lucide-react"

export function ContactSection() {
  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.email) return
    setSubmitted(true)
    setTimeout(() => {
      setFormState({ name: "", email: "", message: "" })
      setSubmitted(false)
    }, 4000)
  }

  return (
    <section
      style={{
        width: "100%",
        padding: "85px 24px 95px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="contact-grid"
      >
        {/* Left Column: Product Spotlight Display */}
        <div
          style={{
            background: "#f8f6f2",
            borderRadius: 16,
            padding: "48px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ebe6dc",
            minHeight: 460,
          }}
        >
          <img
            src={serumImg}
            alt="Celestial Glow Brightening Serum and box packaging"
            style={{
              maxHeight: 380,
              maxWidth: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.06))",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.transform = "scale(1.03)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.transform = "scale(1)"
            }}
          />
        </div>

        {/* Right Column: Contact Us Details & Consultation Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(28px, 3.2vw, 42px)",
                fontWeight: 500,
                color: "#1a1a1a",
                margin: "0 0 12px",
                letterSpacing: "0.01em",
              }}
            >
              Contact Us
            </h2>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                fontSize: 14,
                color: "#6b6b6b",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Have questions about your skincare routine or interested in personalized
              regimen guidance? Our dermatological experts are here for you.
            </p>
          </div>

          {/* Quick Contact Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              paddingBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#f5f3ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mail size={16} color="#333" />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 11,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Direct Email
                </div>
                <a
                  href="mailto:info@glowmi.net"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 13.5,
                    color: "#1a1a1a",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  info@glowmi.net
                </a>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#f5f3ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock size={16} color="#333" />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 11,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Support Hours
                </div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 13.5,
                    color: "#1a1a1a",
                  }}
                >
                  Monday – Friday, 9:00 AM – 6:00 PM EST
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Form */}
          {submitted ? (
            <div
              style={{
                background: "#f5f9f6",
                border: "1px solid #c7e5d2",
                borderRadius: 10,
                padding: "24px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#1e5c36",
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                fontSize: 14,
              }}
            >
              <CheckCircle2 size={20} color="#2b8a4f" />
              <span>Thank you! Your message has been sent. We will reply shortly.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
                className="form-inputs"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  style={{
                    padding: "12px 14px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 13,
                    outline: "none",
                    background: "#fff",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#222")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  style={{
                    padding: "12px 14px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 13,
                    outline: "none",
                    background: "#fff",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#222")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                />
              </div>

              <textarea
                placeholder="How can we assist your skin routine?"
                rows={3}
                required
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                style={{
                  padding: "12px 14px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 13,
                  outline: "none",
                  background: "#fff",
                  resize: "vertical",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#222")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />

              <button
                type="submit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "#222222",
                  color: "#ffffff",
                  padding: "13px 28px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  alignSelf: "flex-start",
                  transition: "background 0.15s, transform 0.12s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "#444"
                  el.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "#222222"
                  el.style.transform = "translateY(0)"
                }}
              >
                Send Message
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .form-inputs {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

export default ContactSection
