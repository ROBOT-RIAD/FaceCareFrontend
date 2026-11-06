import { Diamond, LayoutGrid, ShieldCheck, Leaf } from "lucide-react"

const ingredients = [
  {
    icon: Diamond,
    title: "Niacinamide",
    subtitle: "Refines texture and enhances radiance",
    description:
      "A vitamin B3 derivative that minimizes pores and brightens skin tone.",
  },
  {
    icon: LayoutGrid,
    title: "Hyaluronic Complex",
    subtitle: "Deep hydration and skin comfort",
    description:
      "Multi-weight molecules that hydrate at every skin level.",
  },
  {
    icon: ShieldCheck,
    title: "Peptide Blend",
    subtitle: "Supports firmness and resilience",
    description:
      "Advanced peptides that signal skin to produce more collagen.",
  },
  {
    icon: Leaf,
    title: "Botanical Extracts",
    subtitle: "Calm and balance the skin",
    description:
      "Plant-derived actives that soothe and protect sensitive skin.",
  },
]

export function IntelligentIngredients() {
  return (
    <section className="w-full bg-muted/40 py-16 sm:py-20">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl  font-bold text-foreground tracking-tight leading-tight">
          Intelligent Ingredients.
          <br />
          Visuals Results.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Each Glowmi formula is powered by carefully selected ingredients,
          chosen for performance, safety, and skin harmony.
        </p>
      </div>

      {/* Ingredient Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {ingredients.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="bg-card border border-border/60 rounded-2xl p-6 sm:p-7 space-y-3 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Icon */}
              <div className="size-11 rounded-xl bg-muted flex items-center justify-center">
                <Icon className="size-5 text-foreground/70" />
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-semibold text-foreground pt-1">
                {item.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                {item.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Footer Note */}
      <p className="text-center text-xs text-muted-foreground mt-10 sm:mt-14">
        All ingredients are dermatologically tested and ethically sourced.
      </p>
    </section>
  )
}

