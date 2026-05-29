"use client"

import { useEffect, useState } from "react"

export default function VideosPage(){

  const [unlocked,setUnlocked] =
    useState<string[]>([])

  useEffect(()=>{

    const saved =
      JSON.parse(
        localStorage.getItem(
          "unlockedVideos"
        ) || "[]"
      )

    setUnlocked(saved)

  },[])

  const hasAccess =
    unlocked.includes(
      "goethe-b1-full"
    )

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">

          Video Pembahasan

        </h1>

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">

          <h2 className="text-3xl font-bold mb-5">

            Goethe B1 Full Tryout

          </h2>

          {hasAccess ? (

            <div>

              <p className="text-green-400 mb-5">

                ✅ Video unlocked

              </p>

              <button
                className="bg-gradient-to-r from-yellow-400 to-red-500 text-black px-8 py-4 rounded-2xl font-bold"
              >

                Tonton Video

              </button>

            </div>

          ) : (

            <div>

              <p className="text-red-400">

                🔒 Selesaikan full tryout
                untuk membuka video.

              </p>

            </div>

          )}

        </div>

      </div>

    </main>
  )
}