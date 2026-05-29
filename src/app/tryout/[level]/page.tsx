"use client"

import {
  useEffect,
  useState
} from "react"

import {
  useParams
} from "next/navigation"

import { supabase }
from "../../../lib/supabase"

type ExamSet = {

  exam_set:number
}

export default function
LevelTryoutPage(){

  const params =
  useParams()

  const level =
  String(
    params.level
  )

  const [
    sets,
    setSets
  ] =
  useState<number[]>(
    []
  )

  const [
    loading,
    setLoading
  ] =
  useState(true)

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

      .order(
        "exam_set",
        {
          ascending:true
        }
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

            (data || [])
            .map(
              (
                item:
                ExamSet
              )=>

              item.exam_set
            )
          )
        ]

      setSets(
        uniqueSets
      )

      setLoading(
        false
      )
    }

    if(level){

      loadSets()
    }

  },[
    level
  ])

  if(loading){

    return (

      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">

        Loading...

      </main>

    )
  }

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-4 uppercase">

          Tryout {level}

        </h1>

        <p className="text-gray-400 mb-12">

          Pilih Full Tryout
          Goethe{" "}

          {
            level
            .toUpperCase()
          }

        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {sets.map(
            setNumber=>(

              <div
                key={
                  setNumber
                }

                className="bg-white/5 border border-white/10 rounded-[36px] p-8 backdrop-blur-xl hover:scale-105 transition-all duration-300"
              >

                <div className="mb-6">

                  <div className="text-sm text-yellow-400 font-semibold mb-2">

                    FULL MODULE

                  </div>

                  <h2 className="text-3xl font-bold">

                    {

                      level
                      .toUpperCase()

                    }

                    {" "}

                    Set{" "}

                    {
                      setNumber
                    }

                  </h2>

                </div>

                <p className="text-gray-400 mb-8">

                  Full simulasi Goethe
                  {

                    level
                    .toUpperCase()

                  }

                  {" "}
                  set{" "}

                  {
                    setNumber
                  }

                </p>

                <a
                  href={`/exam/full/${level}/${setNumber}`}

                  className="block text-center bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold py-4 rounded-2xl hover:opacity-90 transition"
                >

                  Mulai Tryout

                </a>

              </div>

            )
          )}

        </div>

      </div>

    </main>
  )
}