import { AboutBanner } from "@/components/modules/about/AboutBanner"
import { OurLegacy } from "@/components/modules/about/OurLegacy"
import { AboutPhilosophy } from "@/components/modules/about/AboutPhilosophy"

export default function AboutPage() {
  return (
    <div className="w-full m-0 p-0">
      <AboutBanner />
      <OurLegacy />
      <AboutPhilosophy />
    </div>
  )
}
