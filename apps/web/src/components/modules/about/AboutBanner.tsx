import aboutBannerImg from "@/assets/anout/image.png"

interface AboutBannerProps {
  className?: string
}

export function AboutBanner({ className = "" }: AboutBannerProps) {
  return (
    <section className={`w-full pt-0 mt-0 pb-4 sm:pb-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden shadow-md">
          <img
            src={aboutBannerImg}
            alt="About Glowmi - Desert landscape"
            className="w-full h-[260px] sm:h-[360px] md:h-[440px] lg:h-[500px] object-cover block"
          />
        </div>
      </div>
    </section>
  )
}

export default AboutBanner
