import { Hero } from "@/components/modules/home/Hero"
import { ProductSection } from "@/components/modules/home/ProductSection"
import { AnalyzeComponent } from "@/components/modules/home/AnalyzeComponent"
import { Banner } from "@/components/modules/home/Banner"
import { IntelligentIngredients } from "@/components/modules/home/IntelligentIngredients"
import { Transformation } from "@/components/modules/home/Transformation"
import { Banner2 } from "@/components/modules/home/Banner2"

export default function Homepage() {
  return (
    <div className="w-full m-0 p-0">
      <Hero />
      <ProductSection />
      <Banner />
      <AnalyzeComponent />
      <Transformation />
      <IntelligentIngredients />
      <Banner2 />
    </div>
  )
}
