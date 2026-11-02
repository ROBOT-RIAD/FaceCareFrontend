import { Link } from "react-router"
import heroBg from "@/assets/home/herro/image.png"

export function Hero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section
        className="relative w-full h-[87vh] min-h-[540px] max-h-[760px] sm:min-h-[580px] flex items-center bg-cover bg-no-repeat bg-[position:25%_center] sm:bg-[position:18%_center] md:bg-[position:left_center] lg:bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        {/* Mobile gradient overlay for optimal readability while preserving the facial artwork */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/35 to-transparent md:hidden pointer-events-none" />

        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Left Column: Keeps open space for the portrait */}
          <div className="hidden md:block md:col-span-6 lg:col-span-7" />

          {/* Right Column: Title and Explore Action Button */}
          <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-7 my-0 py-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] font-serif font-normal text-[#2b2e32] tracking-tight leading-[1.25] max-w-md mx-auto m-0">
              The Essence of Timeless Glow
            </h1>

            <Link
              to="/products"
              className="inline-flex items-center justify-center px-10 sm:px-12 py-2.5 sm:py-3 bg-[#36393c] hover:bg-[#222426] text-white text-xs sm:text-sm font-medium tracking-wide rounded-[2px] shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
