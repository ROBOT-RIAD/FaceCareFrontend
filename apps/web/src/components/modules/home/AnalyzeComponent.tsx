const steps = [
  {
    number: "01",
    title: "Scan & Analyze",
    description: "Advanced AI evaluates your skin's needs",
  },
  {
    number: "02",
    title: "Personalized Routine",
    description: "Customized recommendations made for you",
  },
  {
    number: "03",
    title: "Visible Results",
    description: "Science-backed formulas that work",
  },
]

export function AnalyzeComponent() {
  return (
    <section className="w-full bg-muted/40 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl  font-bold text-foreground tracking-tight">
          How Glowmi Understands Your Skin
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Our intelligent platform combines cutting-edge AI with dermatological
          expertise to deliver personalized skincare solutions.
        </p>
      </div>

      {/* Step Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 text-center space-y-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="block text-3xl sm:text-4xl  font-bold text-foreground/80 leading-none">
              {step.number}
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-foreground pt-1">
              {step.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
