import Link from "next/link"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">
          German Learning Package
        </h1>

        <p className="text-mist mb-12">
          Choose the package that suits your needs
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              Full Tryout
            </h2>

            <p className="text-mist mb-6">
              Use tokens to unlock the full tryout package.
            </p>

            <Link
href="/tryout"
className="bg-gradient-to-r from-gold to-crimson text-ink px-6 py-3 rounded-xl font-bold inline-block"
>
View Tryout
</Link>
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              Les Privat
            </h2>

            <p className="text-mist mb-6">
              Les privat bahasa Jerman
              online/offline.
            </p>

           <a
href="/course"
className="bg-gradient-to-r from-gold to-crimson text-ink px-6 py-3 rounded-xl font-bold inline-block"
>
View Prices
</a>
          </div>

        </div>

      </div>

    </main>
  )
}