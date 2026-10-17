
// Dummy background image URL - user can update later
const DUMMY_LIFESTYLE_BG =
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"

export function LifestyleBanner() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: 380,
        height: "50vh",
        maxHeight: 520,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background Lifestyle Image */}
      <img
        src={DUMMY_LIFESTYLE_BG}
        alt="Skincare routine and mindful relaxation"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
          display: "block",
        }}
      />

      {/* Dark & Warm Ambient Overlay for optimal contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.35) 100%)",
        }}
      />

      {/* Content Overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1140,
          margin: "0 auto",
          padding: "0 32px",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(28px, 3.8vw, 48px)",
              fontWeight: 400,
              lineHeight: 1.25,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "0.01em",
              textShadow: "0 2px 16px rgba(0,0,0,0.4)",
            }}
          >
            Tailor your skincare day with a delicate routine for timeless radiance
          </h2>
        </div>
      </div>
    </section>
  )
}

export default LifestyleBanner
