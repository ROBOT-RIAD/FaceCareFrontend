import bannerImg from "@/assets/home/banar/image.png"

export function Banner() {
  return (
    <section className="w-full py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden shadow-md w-full">
          {/* Banner Image */}
          <img
            src={bannerImg}
            alt="Skincare banner"
            className="w-full h-[280px] sm:h-[360px] md:h-[420px] object-cover block"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />

          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center px-8 sm:px-12 md:px-16">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-medium leading-snug max-w-xs sm:max-w-sm md:max-w-md drop-shadow-lg">
              Cultivate your glow every day with skincare crafted for timeless
              radiance
            </h2>
          </div>
        </div>
      </div>
    </section>
  )
}
