"use client"

import {
  useState,
  useEffect
} from "react"

import {
  useRouter,
  useParams
} from "next/navigation"

import {
  CheckCircle2,
  Circle,
  ArrowRight,
  PauseCircle,
  PartyPopper,
  Loader2,
} from "lucide-react"

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

const moduleLabels:{ [key:string]:string } = {
  lesen: "Lesen",
  horen: "H\u00F6ren",
  schreiben: "Schreiben",
  sprechen: "Sprechen",
}

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

  const progressKey =
  `full_progress_${level}_${examSet}`

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

  /* Checkpoint screen shown between modules: which module was just
     completed, and whether the checkpoint is currently showing. This does
     not touch scoring or the Sprechen finalization logic at all - it only
     delays when setCurrentModule(prev+1) actually fires. */
  const [
    showCheckpoint,
    setShowCheckpoint
  ] =
  useState(false)

  const [
  remainingTryouts,
  setRemainingTryouts
] =
useState(0)

  useEffect(()=>{

    /* RESTORE PROGRESS: if the participant paused at a checkpoint earlier
       and comes back, resume at the module they left off at instead of
       restarting from Lesen. */

    const savedProgress =
    localStorage.getItem(progressKey)

    if(savedProgress){
      const parsed = Number(savedProgress)
      if(!Number.isNaN(parsed) && parsed >= 0 && parsed < modules.length){
        setCurrentModule(parsed)
      }
    }

  },[progressKey])

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
      "No tokens remaining"
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
          "No tokens remaining"
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

  const justCompletedModule =
  currentModule > 0
    ? modules[currentModule - 1]
    : null

  const nextModule =
  ()=>{

    if(
      currentModule <
      modules.length - 1
    ){

      setShowCheckpoint(true)
    }
  }

  const continueToNextModule =
  ()=>{

    setShowCheckpoint(false)

    setCurrentModule(
      prev=>{
        const next = prev + 1
        localStorage.setItem(progressKey, String(next))
        return next
      }
    )
  }

  const pauseForLater =
  ()=>{

    router.push("/dashboard")
  }

  if(
    checkingAccess
  ){

    return (

      <main className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <div className="flex items-center gap-3 text-mist">
          <Loader2 className="animate-spin text-gold" size={24} />
          Loading...
        </div>
      </main>

    )
  }

  return (

    <main className="min-h-screen bg-paper text-ink p-6 md:p-10">

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

          <p className="text-mist mt-3">

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
            )=>{

              const isDone = index < currentModule
              const isCurrent = index === currentModule && !showCheckpoint

              return (

              <div
                key={item}

                className={`rounded-2xl p-5 text-center border font-semibold flex items-center justify-center gap-2 ${
                  isCurrent
                    ? "bg-gradient-to-r from-gold to-crimson text-ink border-transparent"
                    : isDone
                    ? "bg-gold/10 border-gold/30 text-ink"
                    : "bg-surface border-border text-mist"
                }`}
              >

                {isDone && <CheckCircle2 size={16} />}

                {
                  item
                  .toUpperCase()
                }

              </div>
              )
            }
          )}

        </div>

        {/* CHECKPOINT */}

        {showCheckpoint ? (

          <div className="bg-surface border border-border rounded-[40px] p-10 md:p-14 text-center shadow-sm">

            <div className="w-16 h-16 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="text-gold" size={28} />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-3">

              {justCompletedModule ? moduleLabels[justCompletedModule] : ""} selesai!

            </h2>

            <p className="text-mist max-w-md mx-auto mb-10">

              Progres kamu sudah tersimpan. Lanjutkan sekarang ke{" "}
              {moduleLabels[current]}, atau lanjutkan lagi nanti dari
              titik ini.

            </p>

            <div className="max-w-sm mx-auto space-y-3 text-left mb-10">

              {modules.map((item, index)=>{
                const isDone = index < currentModule
                const isNext = index === currentModule
                return (
                  <div
                    key={item}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isNext ? "bg-gold/10 border border-gold/30" : "bg-paper border border-border"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-gold shrink-0" />
                    ) : (
                      <Circle size={18} className="text-mist shrink-0 opacity-50" />
                    )}
                    <span className={isDone ? "text-ink" : isNext ? "text-ink font-semibold" : "text-mist"}>
                      {moduleLabels[item]}
                    </span>
                    {isNext && (
                      <span className="ml-auto text-xs font-semibold text-gold uppercase tracking-wide">
                        Berikutnya
                      </span>
                    )}
                  </div>
                )
              })}

            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={continueToNextModule}
                className="bg-gradient-to-r from-gold to-crimson text-ink font-bold px-8 py-4 rounded-2xl inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200"
              >
                Lanjutkan ke {moduleLabels[current]}
                <ArrowRight size={18} />
              </button>

              <button
                onClick={pauseForLater}
                className="bg-surface-deep border border-border text-ink font-semibold px-8 py-4 rounded-2xl inline-flex items-center justify-center gap-2 hover:bg-border transition-colors duration-200"
              >
                <PauseCircle size={18} />
                Lanjutkan Nanti
              </button>

            </div>

          </div>

        ) : (

        /* MODULE */

        <div className="bg-surface border border-border rounded-[40px] p-10 shadow-sm">

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
    "This full tryout has already been used."
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

                const sprechenFeedback =

localStorage.getItem(
  "sprechenFeedback"
) || ""

const schreibenFeedback =

localStorage.getItem(
  "schreibenFeedback"
) || ""

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

  exam_set:
  examSet,

  score:
  finalScore,

  ai_feedback:
  JSON.stringify({

    schreiben:
    schreibenFeedback,

    sprechen:
    sprechenFeedback

  })
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

console.log("LESEN:",
localStorage.getItem("lesenScore"))

console.log("HOREN:",
localStorage.getItem("horenScore"))

console.log("SCHREIBEN:",
localStorage.getItem("schreibenScore"))

console.log("SPRECHEN:",
localStorage.getItem("sprechenScore"))

                /* full tryout truly finished now - clear the checkpoint
                   resume marker so a future attempt starts at Lesen again */
                localStorage.removeItem(progressKey)

                router.push(
                  "/result"
                )

              }}
            />

          )}

        </div>
        )}

      </div>

    </main>
  )
}
