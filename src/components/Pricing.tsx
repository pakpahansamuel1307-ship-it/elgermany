export default function Pricing(){

  return (

    <section className="px-6 md:px-16 py-24">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">

            Paket
            <span className="text-yellow-400">
              {" "}Full Try Out
            </span>

          </h2>

          <p className="text-gray-400 mt-5 text-lg">

            Choose the tryout package that suits your needs.

          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* STARTER */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h3 className="text-2xl font-bold">

              Starter

            </h3>

            <p className="text-gray-400 mt-3">

              Perfect for beginners

            </p>

            <p className="text-gray-400 mt-3">

              Start from scratch

            </p>

            <div className="mt-8">

              <span className="text-5xl font-bold">

                €1

              </span>

            </div>

            <ul className="mt-8 space-y-4 text-gray-300">

              <li>✓ Seperate Module</li>
              <li>✓ File Explanation</li>
              <li>✓ Automatic Scoring</li>
              <li>✓ Strengthen Weak Areas</li>

            </ul>

            <a
              href="/modules"
              className="mt-10 w-full bg-yellow-400 hover:bg-yellow-300 hover:scale-105 transition-all duration-300 text-black font-bold py-4 rounded-2xl inline-flex items-center justify-center"
            >

              Choose Package

            </a>

          </div>

          {/* PRO */}

          <div className="relative overflow-hidden bg-gradient-to-b from-yellow-400 to-red-500 text-black rounded-3xl p-8 scale-105 shadow-2xl hover:shadow-yellow-500/30 transition-all duration-500">

            <div className="bg-black text-white px-4 py-2 rounded-full inline-block text-sm mb-5">

              POPULER

            </div>

            <h3 className="text-2xl font-bold">

              Pro

            </h3>

            <p className="mt-3">

              The most popular package

            </p>

            <div className="mt-8">

              <span className="text-5xl font-bold">

                €13

              </span>

            </div>

            <ul className="mt-8 space-y-4">

              <li>✓ 5 Try Out</li>
              <li>✓ Full Module</li>
              <li>✓ AI Correction</li>
              <li>✓ Speaking Simulation</li>
              <li>✓ File Explanation</li>
              <li>✓ Ready to Face the Exam</li>

            </ul>

            <a
              href="/payment"
              className="mt-10 w-full bg-black text-white hover:scale-105 transition-all duration-300 py-4 rounded-2xl font-bold hover:bg-gray-900 inline-flex items-center justify-center"
            >

              Choose Package

            </a>

          </div>

          {/* ULTIMATE */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h3 className="text-2xl font-bold">

              Ultimate

            </h3>

            <p className="text-gray-400 mt-3">

              Full preparation

            </p>

            <div className="mt-8">

              <span className="text-5xl font-bold">

                €28

              </span>

            </div>

            <ul className="mt-8 space-y-4 text-gray-300">

              <li>✓ 10 Try Out</li>
              <li>✓ Full Module</li>
              <li>✓ File Explanation</li>
              <li>✓ AI Correction</li>
              <li>✓ Ready to Face the Exam</li>

            </ul>

            <a
              href="/payment"
              className="mt-10 w-full bg-red-500 hover:bg-red-400 hover:scale-105 transition-all duration-300 text-white font-bold py-4 rounded-2xl inline-flex items-center justify-center"
            >

              Choose Package

            </a>

          </div>

        </div>

      </div>

    </section>
  )
}