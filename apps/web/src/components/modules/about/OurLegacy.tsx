import legacyImg from "@/assets/anout/image copy.png"

export function OurLegacy() {
  return (
    <section className="w-full py-14 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-muted-foreground font-medium">
            Our Legacy
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-foreground tracking-tight leading-snug">
            Some things cannot be rushed.
            <br />
            True radiance is cultivated over time.
          </h2>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column: Image */}
          <div className="md:col-span-5 lg:col-span-5">
            <div className="relative overflow-hidden rounded-xs sm:rounded-sm shadow-sm bg-muted">
              <img
                src={legacyImg}
                alt="Glowmi Legacy - Luxury formulation"
                className="w-full h-auto object-cover aspect-square block"
              />
            </div>
          </div>

          {/* Right Column: Narrative Text */}
          <div className="md:col-span-7 lg:col-span-7 space-y-5 sm:space-y-6 text-xs sm:text-sm md:text-[15px] leading-relaxed text-muted-foreground/90 font-light">
            <p>
              Glowmi was born from a simple realization: the skin we live in
              deserves more than generic solutions. In a world where skin
              constantly adapts to changing environments, stress, and modern
              lifestyles, maintaining its natural balance has become more
              challenging than ever.
            </p>

            <p>
              Born beneath the Arabian sun, Glowmi began with a vision to
              unite advanced skin science with a deep respect for the skin's
              natural intelligence. What started as a pursuit of better skincare
              evolved into the foundation of a science-backed skincare house.
              At Glowmi, we believe true luxury lies in precision. Every formula
              is developed through meticulous research, combining clinical
              actives with biomimetic hydration to support the skin's resilience
              and long-term health.
            </p>

            <div className="space-y-1 text-foreground font-normal">
              <p>But Glowmi is more than formulation.</p>
              <p>It is a ritual.</p>
            </div>

            <p>
              A quiet moment of care in the middle of a busy life. A daily
              commitment to nurturing the skin rather than overwhelming it. A
              belief that true beauty is not created overnight — it is cultivated
              patiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurLegacy

