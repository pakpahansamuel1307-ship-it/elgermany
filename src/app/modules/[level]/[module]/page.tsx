"use client"

import {
  useEffect,
  useState
} from "react"

import Link from "next/link"

import {
  useParams
} from "next/navigation"

import { supabase }
from "../../../../lib/supabase"

export default function
ModuleSetsPage(){

  const params =
  useParams()

  const level =
  String(
    params.level
  )

  const module =
  String(
    params.module
  )

  const [
    sets,
    setSets
  ] =
  useState<number[]>(
    []
  )

  useEffect(()=>{

    async function
    loadSets(){

      const {
        data,
        error
      } =
      await supabase

      .from(
        "exam_questions"
      )

      .select(
        "exam_set"
      )

      .eq(
        "level",
        level
      )

      .eq(
        "module",
        module
      )

      if(error){

        console.log(
          error
        )

        return
      }

      const uniqueSets =

        [
          ...new Set(

            data.map(
              item=>
              item.exam_set
            )
          )
        ]

      setSets(
        uniqueSets
      )
    }

    loadSets()

  },[
    level,
    module
  ])

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">

          {

            module
            .toUpperCase()

          }

          {" "}

          {

            level
            .toUpperCase()

          }

        </h1>

        <p className="text-gray-400 mb-12">

          Pilih set modul
          yang tersedia.

        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {sets.map(
            set=>(

              <Link
                key={set}

                href={`/modules/${level}/${module}/${set}`}
              >

                <div className="bg-white/5 border border-white/10 rounded-[36px] p-10 hover:scale-105 transition">

                  <h2 className="text-2xl font-bold mb-4">

                    Goethe
                    {" "}
                    {
                      level
                      .toUpperCase()
                    }

                    {" "}

                    {
                      module
                    }

                    {" "}
                    #{set}

                  </h2>

                  <p className="text-gray-400">

                    Modul terpisah

                  </p>

                </div>

              </Link>

            )
          )}

        </div>

      </div>

    </main>
  )
}