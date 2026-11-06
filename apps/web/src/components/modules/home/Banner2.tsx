import { Link } from "react-router"
import bannerTwoImg from "@/assets/home/banar/image copy.png"

export function Banner2() {
  return (
    <section className="w-full py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden shadow-md w-full">
          {/* Background Image */}
          <img
            src={bannerTwoImg}
            alt="Your Glow, Intelligently Defined"
            className="w-full h-[260px] sm:h-[320px] md:h-[380px] object-cover block"
          />

          {/* Subtle Dark Gradient Overlay for Contrast */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Centered Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 space-y-3 sm:space-y-4">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-normal tracking-tight drop-shadow-md">
              Your Glow, Intelligently Defined.
            </h2>

            <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light drop-shadow-sm leading-relaxed">
              Begin a personalized journey guided by science and tailored for your skin.
            </p>

            <div className="pt-2">
              <Link
                to="/ai-skin-intelligence"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-2.5 bg-[#2b2e32]/90 hover:bg-[#1a1c1e] text-white text-xs sm:text-sm font-medium rounded-full border border-white/20 shadow-md backdrop-blur-xs transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Skin Intelligence
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner2

