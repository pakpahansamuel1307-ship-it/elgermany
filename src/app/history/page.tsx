"use client"

import { useEffect, useState } from "react"

type HistoryItem = {
  date:string
  lesen:number
  horen:number
  schreiben:number
  sprechen:number
  overall:number
}

export default function HistoryPage(){

  const [history,setHistory] =
    useState<HistoryItem[]>(
      []
    )

  useEffect(()=>{

    const saved =
      JSON.parse(
        localStorage.getItem(
          "tryoutHistory"
        ) || "[]"
      )

    setHistory(saved)

  },[])

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">

          Riwayat Try Out

        </h1>

        <div className="space-y-6">

          {history.map(
            (item,index)=>(

            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[30px] p-8"
            >

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold">

                  Try Out #{index+1}

                </h2>

                <p className="text-gray-400">

                  {item.date}

                </p>

              </div>

              <div className="grid md:grid-cols-5 gap-4">

                <div>
                  Lesen:
                  {" "}
                  {item.lesen}
                </div>

                <div>
                  Hören:
                  {" "}
                  {item.horen}
                </div>

                <div>
                  Schreiben:
                  {" "}
                  {item.schreiben}
                </div>

                <div>
                  Sprechen:
                  {" "}
                  {item.sprechen}
                </div>

                <div className="font-bold text-yellow-400">

                  Overall:
                  {" "}
                  {item.overall}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  )
}