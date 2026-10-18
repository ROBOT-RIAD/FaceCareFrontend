export default function AboutPage() {
  return (
    <div className="py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-foreground">
          About Glowmi
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
          Welcome to Glowmi — where dermatological intelligence meets personalized skincare.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="rounded-2xl border border-border/70 p-6 bg-card">
          <h2 className="text-lg font-semibold mb-2">Our Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To empower everyone with data-backed, dermatologist-formulated skincare tailored to their unique skin biology.
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 p-6 bg-card">
          <h2 className="text-lg font-semibold mb-2">Intelligent Care</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our AI Skin Intelligence decodes your skin concerns and formulates the ideal regimen for lasting radiance.
          </p>
        </div>
      </div>
    </div>
  )
}
