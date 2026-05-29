"use client"

import {
  useEffect,
  useState
} from "react"

import { supabase }
from "../../lib/supabase"

type DemoQuestion = {

  id:number

  level:string

  question:string

  option_a:string

  option_b:string

  option_c:string

  correct_answer:string

  explanation:string
}

export default function
DemoPage(){

  const [
    questions,
    setQuestions
  ] =
  useState<
    Record<
      string,
      DemoQuestion
    >
  >({})

  const [
    selectedLevel,
    setSelectedLevel
  ] =
  useState("")

  const [
    selectedAnswer,
    setSelectedAnswer
  ] =
  useState("")

  const [
    submitted,
    setSubmitted
  ] =
  useState(false)

  useEffect(()=>{

    async function
    loadQuestions(){

      const {
        data,
        error
      } =
      await supabase

      .from(
        "demo_questions"
      )

      .select("*")

      .eq(
        "is_active",
        true
      )

      if(error){

        console.log(
          error
        )

        return
      }

      const mapped:
      Record<
        string,
        DemoQuestion
      > = {}

      data?.forEach(
        item=>{

          mapped[
            item.level
          ] = item
        }
      )

      setQuestions(
        mapped
      )
    }

    loadQuestions()

  },[])

  const currentQuestion =

  questions[
    selectedLevel
  ]

  return (

    <main className="min-h-screen bg-[#050816] text-white p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">

          Demo Tryout Gratis

        </h1>

        <p className="text-gray-400 mb-10">

          Coba soal gratis
          sebelum membeli token.

        </p>

        {!selectedLevel && (

          <div className="grid md:grid-cols-4 gap-6">

            {[
              "a1",
              "a2",
              "b1",
              "b2"
            ].map(
              level=>(

                <button
                  key={level}
                  onClick={()=>{

                    setSelectedLevel(
                      level
                    )

                    setSubmitted(
                      false
                    )

                    setSelectedAnswer(
                      ""
                    )
                  }}
                  className="bg-white/10 border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all"
                >

                  <h2 className="text-4xl font-bold text-yellow-400 mb-3 uppercase">

                    {level}

                  </h2>

                  <p className="text-gray-400">

                    Demo level
                    {" "}
                    {
                      level
                      .toUpperCase()
                    }

                  </p>

                </button>

              )
            )}

          </div>

        )}

        {currentQuestion && (

          <div className="bg-white/10 rounded-3xl p-8 border border-white/10 mt-10">

            <button
              onClick={()=>{

                setSelectedLevel(
                  ""
                )

                setSubmitted(
                  false
                )
              }}
              className="mb-6 text-yellow-400"
            >

              ← Kembali

            </button>

            <h2 className="text-2xl font-bold mb-6 uppercase">

              Demo {
                selectedLevel
              }

            </h2>

            <p className="mb-8 text-xl">

              {
                currentQuestion
                .question
              }

            </p>

            <div className="space-y-4">

              {[
                {
                  key:"A",
                  text:
                  currentQuestion
                  .option_a
                },

                {
                  key:"B",
                  text:
                  currentQuestion
                  .option_b
                },

                {
                  key:"C",
                  text:
                  currentQuestion
                  .option_c
                }

              ].map(
                option=>(

                  <button
                    key={
                      option.key
                    }

                    onClick={()=>{

                      if(
                        !submitted
                      ){

                        setSelectedAnswer(
                          option.key
                        )
                      }
                    }}

                    className={`

                    w-full
                    text-left
                    p-5
                    rounded-2xl
                    transition

                    ${
                      selectedAnswer
                      === option.key

                      ? "bg-yellow-400 text-black"

                      : "bg-white/10"
                    }

                    `}
                  >

                    {
                      option.key
                    }.
                    {" "}
                    {
                      option.text
                    }

                  </button>

                )
              )}

            </div>

            {!submitted && (

              <button
                onClick={()=>
                  setSubmitted(
                    true
                  )
                }

                disabled={
                  !selectedAnswer
                }

                className="mt-8 bg-gradient-to-r from-yellow-400 to-red-500 text-black px-8 py-4 rounded-2xl font-bold disabled:opacity-40"
              >

                Submit Jawaban

              </button>

            )}

            {submitted && (

              <div className="mt-8 bg-white/10 rounded-3xl p-6">

                <h3 className="text-2xl font-bold mb-3">

                  {selectedAnswer ===
                  currentQuestion
                  .correct_answer

                  ? "✅ Jawaban Benar"

                  : "❌ Jawaban Salah"}

                </h3>

                <p className="text-gray-300">

                  {
                    currentQuestion
                    .explanation
                  }

                </p>

              </div>

            )}

          </div>

        )}

        <div className="mt-12 text-center">

          <a
            href="/payment"
            className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-bold inline-block"
          >

            Beli Token Full Tryout

          </a>

        </div>

      </div>

    </main>
  )
}