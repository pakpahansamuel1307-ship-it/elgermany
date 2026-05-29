"use client"

import Link from "next/link"

import {
  useParams
} from "next/navigation"

const modules = [

  {
    name:"lesen",
    title:"Lesen"
  },

  {
    name:"horen",
    title:"Hören"
  },

  {
    name:"schreiben",
    title:"Schreiben"
  },

  {
    name:"sprechen",
    title:"Sprechen"
  }
]

export default function
LevelModulesPage(){

  const params =
  useParams()

  const level =
  String(
    params.level
  )

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-4 uppercase">

          Modul {level}

        </h1>

        <p className="text-gray-400 mb-12">

          Pilih modul
          untuk level
          {level.toUpperCase()}

        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {modules.map(
            item=>(

              <Link
                key={item.name}

                href={`/modules/${level}/${item.name}`}
              >

                <div className="bg-white/5 border border-white/10 rounded-[36px] p-10 text-center hover:scale-105 transition">

                  <h2 className="text-3xl font-bold">

                    {
                      item.title
                    }

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