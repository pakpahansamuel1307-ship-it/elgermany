import Link from "next/link"

export default function StartPage() {

  return (

    <main className="min-h-screen bg-paper text-ink flex items-center justify-center p-8">

      <div className="max-w-4xl w-full">

        <h1 className="text-5xl font-bold text-center mb-4">

          Choose Learning Method

        </h1>

        <p className="text-center text-mist mb-12">

          Choose the learning method that suits your needs

        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* FULL TRYOUT */}

          <div className="bg-surface border border-border rounded-3xl p-10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            <h2 className="text-3xl font-bold mb-4">

              Full Tryout

            </h2>

            <p className="text-mist mb-8">

              Use tokens to access the full tryout package.
            </p>

            <Link
              href="/tryout"
              className="bg-gradient-to-r from-gold to-crimson text-ink px-6 py-3 rounded-xl font-bold inline-block"
            >

              Start Tryout

            </Link>

          </div>

          {/* COURSE */}

          <div className="bg-surface border border-border rounded-3xl p-10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            <h2 className="text-3xl font-bold mb-4">

              Course

            </h2>

            <p className="text-mist mb-8">

              Belajar privat bahasa Jerman,
              mentoring intensif Goethe,
              latihan speaking, dan persiapan ujian.

            </p>

            <Link
              href="/course/choose"
              className="bg-gradient-to-r from-gold to-crimson text-ink px-6 py-3 rounded-xl font-bold inline-block"
            >

              Start Learning

            </Link>

          </div>

        </div>

      </div>

    </main>
  )
}