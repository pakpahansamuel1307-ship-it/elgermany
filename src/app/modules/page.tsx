"use client"

import Link from "next/link"

const levels = [
  "a1",
  "a2",
  "b1",
  "b2"
]

export default function
ModulesPage(){

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">

          Modul Goethe

        </h1>

        <p className="text-gray-400 mb-12">

          Pilih level modul
          yang ingin dipelajari.

        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {levels.map(
            level=>(

              <Link
                key={level}

                href={`/modules/${level}`}
              >

                <div className="bg-white/5 border border-white/10 rounded-[36px] p-10 text-center hover:scale-105 transition">

                  <h2 className="text-4xl font-bold uppercase">

                    {level}

                  </h2>

                </div>

              </Link>

            )
          )}

        </div>

      </div>

    </main>
  )
}