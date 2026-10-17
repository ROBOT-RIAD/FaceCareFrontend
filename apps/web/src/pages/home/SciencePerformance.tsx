// Dummy portrait URL for clinical face study - user can update later
const DUMMY_FACE_PORTRAIT =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80"

export function SciencePerformance() {
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
            margin: "0 0 12px",
          }}
        >
          Our Science and Performance
        </h2>

        {/* Subtitle with accent line */}
        <div style={{ display: "inline-block", marginBottom: 56 }}>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: 14,
              color: "#777777",
              margin: "0 0 8px",
            }}
          >
            Clinically tested &amp; dermatologist approved results
          </p>
          <svg
            width="120"
            height="8"
            viewBox="0 0 120 8"
            fill="none"
            style={{ margin: "0 auto", display: "block" }}
          >
            <path
              d="M1 5.5C20 2 40 7 60 4C80 1 100 6 119 3"
              stroke="#222"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Performance Stage Container */}
        <div
          style={{
            background: "#f7f5f0",
            borderRadius: 24,
            padding: "48px 36px",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 32,
            alignItems: "center",
            maxWidth: 1060,
            margin: "0 auto",
          }}
          className="science-grid"
        >
          {/* Left Callouts Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              textAlign: "left",
            }}
          >
            {/* Stat 1 */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: 14,
                padding: "24px 26px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
                border: "1px solid #ebe6dc",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 34,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                98%
              </div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "#555555",
                  margin: 0,
                }}
              >
                Reported softer, more supple skin within 7 days of daily use
              </p>
            </div>

            {/* Stat 2 */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: 14,
                padding: "24px 26px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
                border: "1px solid #ebe6dc",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 34,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                94%
              </div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "#555555",
                  margin: 0,
                }}
              >
                Noticed visible reduction in fine lines and hyperpigmentation
              </p>
            </div>
          </div>

          {/* Center Portrait */}
          <div
            style={{
              position: "relative",
              width: 310,
              height: 400,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(0,0,0,0.08)",
              background: "#e8e4dc",
            }}
          >
            <img
              src={DUMMY_FACE_PORTRAIT}
              alt="Clinical skin study subject"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
                display: "block",
              }}
            />

            {/* Glowing Skin Analysis Oval Patch Indicator */}
            <div
              style={{
                position: "absolute",
                bottom: 34,
                left: "50%",
                transform: "translateX(-50%)",
                width: 60,
                height: 28,
                borderRadius: 20,
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255, 255, 255, 0.9)",
                boxShadow: "0 0 16px rgba(255, 255, 255, 0.8)",
              }}
            />
          </div>

          {/* Right Callouts Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              textAlign: "left",
            }}
          >
            {/* Stat 3 */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: 14,
                padding: "24px 26px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
                border: "1px solid #ebe6dc",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 34,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                96%
              </div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "#555555",
                  margin: 0,
                }}
              >
                Agreed skin felt instantly hydrated, calmed, and refreshed
              </p>
            </div>

            {/* Stat 4 */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: 14,
                padding: "24px 26px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
                border: "1px solid #ebe6dc",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 34,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                92%
              </div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "#555555",
                  margin: 0,
                }}
              >
                Observed stronger skin barrier against environmental irritants
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .science-grid {
            grid-template-columns: 1fr !important;
            justify-items: center;
          }
        }
      `}</style>
    </section>
  )
}

export default SciencePerformance
