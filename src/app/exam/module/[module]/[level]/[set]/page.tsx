"use client"

import {
  useParams,
  useRouter
} from "next/navigation"

import {
  useEffect,
  useState
} from "react"

import UniversalLesenEngine
from "../../../../../../components/exam/UniversalLesenEngine"

import HorenEngine
from "../../../../../../components/exam/HorenEngine"

import SchreibenEngine
from "../../../../../../components/exam/SchreibenEngine"

import SprechenEngine
from "../../../../../../components/exam/SprechenEngine"

import { supabase }
from "../../../../../../lib/supabase"

export default function
ModuleExamPage(){

  const router =
  useRouter()

  const params =
  useParams()

  const moduleType =

  typeof
  params.module
  === "string"

  ?

  params.module

  :

  "lesen"

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

useEffect(()=>{

  async function
  checkAttempt(){

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
      moduleType
    )

    .eq(
      "level",
      level
    )

    .eq(
      "exam_set",
      examSet
    )

    .maybeSingle()

    // sudah pernah selesai
    if(
      session
      ?.is_completed
    ){

      alert(
        "Tryout ini sudah pernah dikerjakan."
      )

      router.push(
        "/dashboard"
      )

      return
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
  moduleType,

  level,

  exam_set:
  examSet,

  purchase_type:
  "module",

  is_started:
  true,

  is_completed:
  false
})
    }

    setCheckingAccess(
      false
    )
  }

  checkAttempt()

},[
  moduleType,
  level,
  examSet,
  router
])


  async function
finishModule(){

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

  let score = 0

  let aiFeedback = ""

  if(
    moduleType
    === "lesen"
  ){

    score =
    Number(

      localStorage
      .getItem(
        "lesenScore"
      ) || 0
    )
  }

  if(
    moduleType
    === "horen"
  ){

    score =
    Number(

      localStorage
      .getItem(
        "horenScore"
      ) || 0
    )
  }

  if(
    moduleType
    === "schreiben"
  ){

    score =
    Number(

      localStorage
      .getItem(
        "schreibenScore"
      ) || 0
    )

    aiFeedback =

    localStorage
    .getItem(
      "schreibenFeedback"
    ) || ""
  }

  if(
    moduleType
    === "sprechen"
  ){

    score =
    Number(

      localStorage
      .getItem(
        "sprechenScore"
      ) || 0
    )

    aiFeedback =

    localStorage
    .getItem(
      "sprechenFeedback"
    ) || ""
  }

  await supabase

.from(
  "exam_attempt_sessions"
)

.update({

  is_completed:
  true

})

.eq(
  "user_id",
  user.id
)

.eq(
  "module",
  moduleType
)

.eq(
  "level",
  level
)

.eq(
  "exam_set",
  examSet
)

  await supabase

  .from(
    "tryout_attempts"
  )

  .insert({

    user_id:
    user.id,

    tryout_title:
    `${moduleType.toUpperCase()} ${level.toUpperCase()} Set ${examSet}`,

    module_type:
    moduleType,

    level,

    exam_set:
    examSet,

    score,

    ai_feedback:
    aiFeedback
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
  moduleType
)

.eq(
  "level",
  level
)

.eq(
  "exam_set",
  examSet
)

  localStorage
  .setItem(

    "moduleScore",

    String(
      score
    )
  )

  localStorage
  .setItem(

    "resultType",

    "module"
  )

  localStorage
  .setItem(

    "resultModule",

    String(
      moduleType
    )
  )

  router.push(
    "/result"
  )
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

    <main className="min-h-screen bg-[#050816] text-white">

  <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-5 md:py-10">

    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-10 break-words">

          {

            moduleType
            .toUpperCase()

          }

          {" "}

          {

            level
            .toUpperCase()

          }

          {" "}

          Set

          {" "}

          {
            examSet
          }

        </h1>

        {moduleType ===
        "lesen" && (

          <UniversalLesenEngine

            level={
              level
            }

            examSet={
              examSet
            }

            onComplete={
              finishModule
            }

          />

        )}

        {moduleType ===
        "horen" && (

          <HorenEngine

            level={
              level
            }

            examSet={
              examSet
            }

            onComplete={
              finishModule
            }

          />

        )}

        {moduleType ===
        "schreiben" && (

          <SchreibenEngine

            level={
              level
            }

            examSet={
              examSet
            }

            onComplete={
              finishModule
            }

          />

        )}

        {moduleType ===
        "sprechen" && (

          <SprechenEngine

            level={
              level
            }

            examSet={
              examSet
            }

            onComplete={
              finishModule
            }

          />

        )}

      </div>

    </main>
  )
}