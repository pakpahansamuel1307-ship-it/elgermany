const plans = [
  {
    name: "Starter",
    tagline: "Perfect for beginners",
    sub: "Start from scratch",
    price: "\u20AC1",
    features: ["Seperate Module", "File Explanation", "Automatic Scoring", "Strengthen Weak Areas"],
    href: "/modules",
    cta: "Choose Package",
    variant: "outline",
  },
  {
    name: "Pro",
    tagline: "The most popular package",
    price: "\u20AC13",
    features: ["5 Try Out", "Full Module", "AI Correction", "Speaking Simulation", "File Explanation", "Ready to Face the Exam"],
    href: "/payment",
    cta: "Choose Package",
    variant: "featured",
    badge: "POPULER",
  },
  {
    name: "Ultimate",
    tagline: "Full preparation",
    price: "\u20AC28",
    features: ["10 Try Out", "Full Module", "File Explanation", "AI Correction", "Ready to Face the Exam"],
    href: "/payment",
    cta: "Choose Package",
    variant: "outline-red",
  },
]

export default function Pricing(){

  return (

    <section className="px-6 md:px-16 py-20 md:py-28">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14 md:mb-16">

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Paket
            <span className="text-crimson">{" "}Full Try Out</span>
          </h2>

          <p className="text-mist mt-5 text-base md:text-lg">
            Choose the tryout package that suits your needs.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">

          {plans.map((plan) => {
            const isFeatured = plan.variant === "featured"

            return (
              <div
                key={plan.name}
                className={
                  isFeatured
                    ? "relative overflow-hidden bg-gradient-to-b from-gold to-crimson text-ink rounded-2xl p-8 md:scale-105 shadow-2xl hover:shadow-gold/30 transition-shadow duration-500"
                    : "bg-surface border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
                }
              >

                {plan.badge && (
                  <div className="bg-ink text-paper px-4 py-1.5 rounded-full inline-block text-xs font-bold tracking-wide mb-5">
                    {plan.badge}
                  </div>
                )}

                <h3 className="text-2xl font-bold">
                  {plan.name}
                </h3>

                <p className={`mt-3 ${isFeatured ? "text-ink/80" : "text-mist"}`}>
                  {plan.tagline}
                </p>

                {plan.sub && (
                  <p className={`mt-1 ${isFeatured ? "text-ink/80" : "text-mist"}`}>
                    {plan.sub}
                  </p>
                )}

                <div className="mt-8">
                  <span className="text-5xl font-bold">
                    {plan.price}
                  </span>
                </div>

                <ul className={`mt-8 space-y-3.5 ${isFeatured ? "" : "text-mist"}`}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm md:text-base">
                      <span className={isFeatured ? "text-ink" : "text-crimson"}>&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.href}
                  className={
                    isFeatured
                      ? "mt-10 w-full bg-ink text-paper hover:opacity-90 transition-opacity duration-300 py-4 rounded-xl font-bold inline-flex items-center justify-center"
                      : plan.variant === "outline-red"
                      ? "mt-10 w-full bg-crimson hover:bg-crimson/90 transition-colors duration-300 text-paper font-bold py-4 rounded-xl inline-flex items-center justify-center"
                      : "mt-10 w-full bg-gold hover:bg-gold-soft transition-colors duration-300 text-ink font-bold py-4 rounded-xl inline-flex items-center justify-center"
                  }
                >
                  {plan.cta}
                </a>

              </div>
            )
          })}

        </div>

      </div>

    </section>
  )
}
