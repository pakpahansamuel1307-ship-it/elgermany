"use client"

import {
  useState,
  useEffect
} from "react"

import {
  useRouter,
  useParams
} from "next/navigation"

import { supabase }
from "../../../../../lib/supabase"

import UniversalLesenEngine
from "../../../../../components/exam/UniversalLesenEngine"

import HorenEngine
from "../../../../../components/exam/HorenEngine"

import SchreibenEngine
from "../../../../../components/exam/SchreibenEngine"

import SprechenEngine
from "../../../../../components/exam/SprechenEngine"

const modules = [
  "lesen",
  "horen",
  "schreiben",
  "sprechen"
]

export default function
FullExamPage(){

  const router =
  useRouter()

  const params =
  useParams()

  const level =
  typeof
  params.level
  === "string"

  ?

  params.level

  :

  "a1"

  const examSet =
  typeof
  params.set
  === "string"

  ?

  Number(
    params.set
  )

  :

  1

  const [
    checkingAccess,
    setCheckingAccess
  ] =
  useState(true)

  const [
    currentModule,
    setCurrentModule
  ] =
  useState(0)

  const [
  remainingTryouts,
  setRemainingTryouts
] =
useState(0)

  useEffect(()=>{

    async function
    checkAccess(){

      const {
        data:userData
      } =
      await supabase
      .auth
      .getUser()

      const user =
      userData.user

      if(!user){

        router.push(
          "/login"
        )

        return
      }

      

      const {
        data:profile
      } =
      await supabase

      .from(
        "profiles"
      )

      .select(
        "remaining_tryouts"
      )

      .eq(
        "id",
        user.id
      )

      .single()

      

      if(!profile){

        router.push(
          "/tryout"
        )

        return
      }

      const {
  data:session
} =
await supabase

.from(
  "exam_attempt_sessions"
)

.select("*")

.eq(
  "user_id",
  user.id
)

.eq(
  "module",
  "full"
)

.eq(
  "level",
  String(level)
)

.eq(
  "exam_set",
  examSet
)

.maybeSingle()

// sudah selesai

if(
  session
  ?.is_completed
){

  if(
    profile
    .remaining_tryouts
    <= 0
  ){

    alert(
      "Token habis"
    )

    router.push(
      "/payment"
    )

    return
  }

  // reset session lama
  await supabase

  .from(
    "exam_attempt_sessions"
  )

  .delete()

  .eq(
    "user_id",
    user.id
  )

  .eq(
    "module",
    "full"
  )

  .eq(
    "level",
    String(level)
  )

  .eq(
    "exam_set",
    examSet
  )
}

// pertama kali buka
if(!session){

  await supabase

  .from(
    "exam_attempt_sessions"
  )

  .insert({

    user_id:
    user.id,

    module:
    "full",

    level:
    String(level),

    exam_set:
    examSet,

    is_started:
    true,

    is_completed:
    false
  })
}

      setRemainingTryouts(

  profile
  .remaining_tryouts
)

      if (
        profile
        .remaining_tryouts
        <= 0
      ){

        alert(
          "Token habis"
        )

        router.push(
          "/payment"
        )

        return
      }

      setCheckingAccess(
        false
      )
    }

    checkAccess()

  },[
    router
  ])

  const current =
  modules[
    currentModule
  ]

  const nextModule =
  ()=>{

    if(
      currentModule <
      modules.length - 1
    ){

      setCurrentModule(
        prev=>prev+1
      )
    }
  }

  if(
    checkingAccess
  ){

    return (

      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">

        Loading...

      </main>

    )
  }

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold">

            Full Try Out Goethe{" "}

            {
              String(level)
              .toUpperCase()
            }

            {" "}

            Set {examSet}

          </h1>

          <p className="text-gray-400 mt-3">

            Kerjakan semua modul
            secara berurutan.

          </p>

        </div>

        {/* STEP */}

        <div className="grid grid-cols-4 gap-4 mb-10">

          {modules.map(
            (
              item,
              index
            )=>(

              <div
                key={item}

                className={`

                rounded-2xl
                p-5
                text-center
                border

                ${
                  currentModule
                  === index

                  ?

                  "bg-gradient-to-r from-yellow-400 to-red-500 text-black border-transparent"

                  :

                  "bg-white/5 border-white/10"
                }

                `}
              >

                {
                  item
                  .toUpperCase()
                }

              </div>

            )
          )}

        </div>

        {/* MODULE */}

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">

          {/* LESEN */}

          {current ===
          "lesen" && (

            <UniversalLesenEngine

              level={
                String(level)
              }

              examSet={
                examSet
              }

              onComplete={
                nextModule
              }

            />

          )}

          {/* HOREN */}

          {current ===
          "horen" && (

            <HorenEngine

              level={
                String(level)
              }

              examSet={
                examSet
              }

              onComplete={
                nextModule
              }

            />

          )}

          {/* SCHREIBEN */}

          {current ===
          "schreiben" && (

           <SchreibenEngine

  level={
    String(level)
  }

  examSet={
    examSet
  }

  onComplete={
    nextModule
  }

/>

          )}

          {/* SPRECHEN */}

          {current ===
          "sprechen" && (
<SprechenEngine

  level={
    String(level)
  }

  examSet={
    examSet
  }

  onComplete={async ()=>{

                const {
                  data:userData
                } =
                await supabase
                .auth
                .getUser()

                const user =
                userData.user

                if(!user){

                  router.push(
                    "/login"
                  )

                  return
                }

                const {
  data:session
} =
await supabase

.from(
  "exam_attempt_sessions"
)

.select("*")

.eq(
  "user_id",
  user.id
)

.eq(
  "module",
  "full"
)

.eq(
  "level",
  String(level)
)

.eq(
  "exam_set",
  examSet
)

.maybeSingle()

if(
  session
  ?.is_completed
){

  alert(
    "Full tryout ini sudah pernah digunakan."
  )

  router.push(
    "/dashboard"
  )

  return
}

                const lesen =
                Number(
                  localStorage
                  .getItem(
                    "lesenScore"
                  ) || 0
                )

                const horen =
                Number(
                  localStorage
                  .getItem(
                    "horenScore"
                  ) || 0
                )

                const schreiben =
                Number(
                  localStorage
                  .getItem(
                    "schreibenScore"
                  ) || 0
                )

                const sprechen =
                Number(
                  localStorage
                  .getItem(
                    "sprechenScore"
                  ) || 0
                )

                const finalScore =
                Math.round(

                  (
                    lesen +
                    horen +
                    schreiben +
                    sprechen
                  ) / 4

                )

                await supabase

.from(
  "profiles"
)

.update({

  remaining_tryouts:

  remainingTryouts - 1

})

.eq(
  "id",
  user.id
)

                await supabase

                .from(
                  "results"
                )

                .insert({

                  user_id:
                  user.id,

                  score:
                  finalScore

                })

await supabase

.from(
  "exam_attempt_sessions"
)

.upsert({

  user_id:
  user.id,

  module:
  "full",

  level:
  String(level),

  exam_set:
  examSet,

  purchase_type:
  "full",

  is_started:
  true,

  is_completed:
  true
})

                await supabase

                .from(
                  "tryout_attempts"
                )

                .insert({

                  user_id:
                  user.id,

                  tryout_title:
                  `Goethe ${String(level).toUpperCase()} Set ${examSet}`,

                  module_type:
                  "full",

                  level:
                  String(level),

                  score:
                  finalScore
                })

                await supabase

.from(
  "exam_attempt_sessions"
)

.update({

  is_completed:
  true,

  completed_at:
  new Date()
  .toISOString()

})

.eq(
  "user_id",
  user.id
)

.eq(
  "module",
  "full"
)

.eq(
  "level",
  String(level)
)

.eq(
  "exam_set",
  examSet
)

localStorage
.setItem(

  "examType",

  "full"
)

                router.push(
                  "/result"
                )

              }}
            />

          )}

        </div>

      </div>

    </main>
  )
}