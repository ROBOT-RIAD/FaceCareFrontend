import scienceImg from "@/assets/anout/image copy 2.png"
import consciousImg from "@/assets/anout/image copy 3.png"

export function AboutPhilosophy() {
  return (
    <section className="w-full py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28 lg:space-y-36">
        
        {/* Row 1: Science with Intelligence */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 items-center">
          {/* Text Left */}
          <div className="md:col-span-6 lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-foreground tracking-tight leading-tight">
              Science with
              <br />
              Intelligence.
            </h2>

            <div className="space-y-2 text-sm sm:text-base text-foreground/90 font-light">
              <p>We do not believe in ten-step routines or over-complicated claims.</p>
              <p>We believe in meticulous, quiet science.</p>
            </div>

            <p className="text-xs sm:text-sm md:text-[15px] text-muted-foreground/90 leading-relaxed font-light">
              Our formulas are developed through months of careful research,
              balancing clinical actives with biomimetic hydration designed to
              support the skin's natural resilience. The result is skincare that
              feels refined and luxurious, yet performs with clinical precision.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground/90 font-light pt-2">
              <li className="leading-relaxed">
                <strong className="font-semibold text-foreground">
                  • Clinical Actives:
                </strong>{" "}
                Only the ingredients that matter, at the exact concentrations
                that deliver real results.
              </li>
              <li className="leading-relaxed">
                <strong className="font-semibold text-foreground">
                  • Climate-Adaptive Hydration:
                </strong>{" "}
                Weightless hydration designed to support the skin in constantly
                changing environments.
              </li>
              <li className="leading-relaxed">
                <strong className="font-semibold text-foreground">
                  • Melanin-aware Formulations:
                </strong>{" "}
                Created to respect and support the natural depth and diversity of
                skin tones.
              </li>
            </ul>
          </div>

          {/* Image Right */}
          <div className="md:col-span-6 lg:col-span-6 flex justify-center md:justify-end">
            <div className="w-full max-w-[460px] aspect-square overflow-hidden rounded-xs sm:rounded-sm shadow-sm bg-muted">
              <img
                src={scienceImg}
                alt="Molecular droplet science"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Made for the conscious */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 items-center">
          {/* Image Left */}
          <div className="md:col-span-6 lg:col-span-6 flex justify-center md:justify-start order-2 md:order-1">
            <div className="w-full max-w-[460px] aspect-square overflow-hidden rounded-xs sm:rounded-sm shadow-sm bg-muted">
              <img
                src={consciousImg}
                alt="Mindful skincare jar in sunlight"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>

          {/* Text Right */}
          <div className="md:col-span-6 lg:col-span-6 space-y-6 order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-foreground tracking-tight leading-tight">
              Made for the conscious.
            </h2>

            <p className="text-xs sm:text-sm md:text-[15px] text-muted-foreground/90 leading-relaxed font-light">
              You expect a certain standard from the things you bring into your
              life, and your daily skincare ritual should be no different.
            </p>

            <p className="text-xs sm:text-sm md:text-[15px] text-muted-foreground/90 leading-relaxed font-light">
              Glowmi is for those who read the label, who appreciate the weight of
              a beautifully crafted glass bottle, and who demand results they
              can genuinely see.
            </p>

            <p className="text-xs sm:text-sm md:text-[15px] text-muted-foreground/90 leading-relaxed font-light">
              We are not here to offer quick fixes or fleeting trends.
            </p>

            {/* Quote with left border */}
            <div className="border-l-2 border-foreground/60 pl-4 py-1">
              <p className="text-xs sm:text-sm text-foreground/90 italic font-serif leading-relaxed">
                "We provide a daily, grounding ritual that honors your skin's
                natural architecture."
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AboutPhilosophy

