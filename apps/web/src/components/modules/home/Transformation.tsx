import React from "react"
import { Droplet, Wind, Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import transformationImg from "@/assets/home/transformation/image.png"

export function Transformation() {
  return (
    <section className="w-full py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center space-y-2 max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
            Real Skin. Real Transformation
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Keep visuals minimal and authentic to build trust
          </p>
          {/* Subtle curved underline accent */}
          <div className="flex justify-center pt-1">
            <svg
              className="w-28 sm:w-36 h-2.5 text-foreground/70"
              viewBox="0 0 140 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 7C45 2 95 2 137 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Gray Background Container */}
        <div className="bg-[#f7f7f8] dark:bg-card/60 border border-border/50 rounded-3xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-6">
            
            {/* Left Cards */}
            <div className="lg:col-span-3 flex flex-col gap-5 sm:gap-6 justify-center">
              {/* Card 1 */}
              <div className="bg-card dark:bg-stone-900 border border-border/60 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-2">
                <div className="size-9 rounded-lg flex items-center justify-center text-foreground/80">
                  <Droplet className="size-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Skin Roughness
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Infused with natural oils for a luminous complexion.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-card dark:bg-stone-900 border border-border/60 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-2">
                <div className="size-9 rounded-lg flex items-center justify-center text-foreground/80">
                  <Wind className="size-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Dead Skin
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every product is carefully crafted to meet the highest quality standards.
                </p>
              </div>
            </div>

            {/* Center Image Container */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-[32px] sm:rounded-[38px] overflow-hidden border-[4px] border-[#363539] shadow-xl bg-muted">
                {/* Before / After Split Image */}
                <img
                  src={transformationImg}
                  alt="Real skin transformation before and after"
                  className="w-full h-full object-cover select-none"
                />

                {/* Subtle Center Divider Line */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-white/70 shadow-sm pointer-events-none" />

                {/* Slider Handle Pill */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/30 backdrop-blur-md border border-white/60 rounded-full px-2.5 py-1 flex items-center justify-center gap-1 shadow-md pointer-events-none">
                  <ChevronLeft className="size-3 text-white" />
                  <ChevronRight className="size-3 text-white" />
                </div>
              </div>
            </div>

            {/* Right Cards */}
            <div className="lg:col-span-3 flex flex-col gap-5 sm:gap-6 justify-center lg:pt-14">
              {/* Card 3 */}
              <div className="bg-card dark:bg-stone-900 border border-border/60 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-2">
                <div className="size-9 rounded-lg flex items-center justify-center text-foreground/80">
                  <Droplet className="size-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Radiant Glow
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Infused with natural oils for a luminous complexion.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-card dark:bg-stone-900 border border-border/60 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-2">
                <div className="size-9 rounded-lg flex items-center justify-center text-foreground/80">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  Proven Effectiveness
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every product is carefully crafted to meet the highest quality standards.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
export default Transformation

