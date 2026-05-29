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

type Attempt = {

  id:number

  tryout_title:string

  module_type:string

  level:string

  score:number

  video_url:string

  ai_feedback:string

  created_at:string
}

export default function
HistoryDetailPage(){

  const params =
  useParams()

  const [
    data,
    setData
  ] =
  useState<
    Attempt
    | null
  >(null)

  const [
    loading,
    setLoading
  ] =
  useState(true)

  useEffect(()=>{

    async function
    loadDetail(){

      const {
        data,
        error
      } =
      await supabase

      .from(
        "tryout_attempts"
      )

      .select("*")

      .eq(
        "id",
        params.id
      )

      .single()

      if(error){

        console.log(
          error
        )

        return
      }

      setData(
        data
      )

      setLoading(
        false
      )
    }

    loadDetail()

  },[
    params.id
  ])

  if(loading){

    return (

      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">

        Loading...

      </main>

    )
  }

  if(!data){

    return (

      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">

        Data tidak ditemukan

      </main>

    )
  }

  let feedback =
  null

  try{

    feedback =
    JSON.parse(
      data.ai_feedback
      || "{}"
    )

  }catch{

    feedback =
    null
  }

  return (

    <main className="min-h-screen bg-[#050816] text-white p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-3">

          Pembahasan

        </h1>

        <p className="text-gray-400 mb-10">

          {
            data.tryout_title
          }

        </p>

        {/* SCORE */}

        <div className="bg-white/5 border border-white/10 rounded-[36px] p-8 mb-8">

          <p className="text-gray-400 mb-3">

            Score

          </p>

          <h2 className="text-5xl font-bold text-yellow-400">

            {
              data.score
            }

          </h2>

        </div>

        {/* VIDEO */}

        {data.video_url && (

          <div className="bg-white/5 border border-white/10 rounded-[36px] p-8 mb-8">

            <h2 className="text-2xl font-bold mb-5">

              Video Pembahasan

            </h2>

            <a

              href={
                data.video_url
              }

              target="_blank"

              className="bg-red-500 px-6 py-4 rounded-2xl font-bold inline-block"

            >

              Tonton Video

            </a>

          </div>

        )}

        {/* AI FEEDBACK */}

        {feedback && (

          <div className="bg-white/5 border border-white/10 rounded-[36px] p-8 mb-8">

            <h2 className="text-2xl font-bold mb-8">

              Feedback AI

            </h2>

            {Object.entries(
              feedback
            ).map(

              (
                [
                  key,
                  value
                ]
              )=>(

                <div
                  key={key}
                  className="mb-6 border-b border-white/10 pb-6"
                >

                  <h3 className="text-xl font-bold capitalize mb-3">

                    {key}

                  </h3>

                  <pre className="whitespace-pre-wrap text-gray-300">

                    {
                      JSON.stringify(
                        value,
                        null,
                        2
                      )
                    }

                  </pre>

                </div>

              )

            )}

          </div>

        )}

        <a

          href="/dashboard"

          className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-bold inline-block"

        >

          Kembali ke Dashboard

        </a>

      </div>

    </main>
  )
}