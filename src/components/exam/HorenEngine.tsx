"use client"

import {
  useEffect,
  useRef,
  useState
} from "react"

import { supabase }
from "../../lib/supabase"

type Question = {

  id:number
  teil:number
  question_order:number
  question_type:string
  question_text:string

  option_a:string
  option_b:string
  option_c:string
  option_d:string
  option_e:string
  option_f:string
  option_g:string
  option_h:string
  option_0:string

  option_a_image:string
  option_b_image:string
  option_c_image:string
  option_d_image:string
  option_e_image:string
  option_f_image:string
  option_g_image:string
  option_h_image:string
  option_0_image:string

  correct_answer:string
  audio_url:string
}

type Props = {

  level:string

  examSet:number

  onComplete:
  ()=>void
}

export default function
HorenEngine({

  level,

  examSet,

  onComplete

}:Props){

  const [
    questions,
    setQuestions
  ] =
  useState<Question[]>(
    []
  )

  const [
    answers,
    setAnswers
  ] =
  useState<
    Record<number,string>
  >({})

  const storageKey =

`horen_${level}_${examSet}`

const stageKey =

`horen_stage_${level}_${examSet}`

  const [
    loading,
    setLoading
  ] =
  useState(true)

  const [
  stage,
  setStage
] =
useState<
  "preparation"
  |
  "listening"
  |
  "review"
>(
  "preparation"
)

const [
  prepTime,
  setPrepTime
] =
useState(60)

const [
  reviewTime,
  setReviewTime
] =
useState(300)

const [
  restored,
  setRestored
] =
useState(false)





  const audioRef =
  useRef<
    HTMLAudioElement
    | null
  >(null)

  useEffect(()=>{

    async function
    loadQuestions(){

      const {
        data,
        error
      } =
      await supabase

      .from(
        "exam_questions"
      )

      .select("*")

      .eq(
        "level",
        level
      )

      .eq(
        "module",
        "horen"
      )

      .eq(
        "exam_set",
        examSet
      )

      .order(
        "teil",
        {
          ascending:true
        }
      )

      .order(
        "question_order",
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

      setQuestions(
        data || []
      )

      setLoading(
        false
      )
    }

    loadQuestions()

/* RESTORE ANSWERS */

const saved =

localStorage
.getItem(
  storageKey
)

if(saved){

  setAnswers(
    JSON.parse(
      saved
    )
  )
}

/* RESTORE STAGE */

const savedStage =

localStorage
.getItem(
  stageKey
)

if(savedStage){

  const parsed =
  JSON.parse(
    savedStage
  )

  setStage(
    parsed.stage
    ??
    "preparation"
  )

  setPrepTime(
    parsed.prepTime
    ??
    60
  )

  setReviewTime(
    parsed.reviewTime
    ??
    300
  )
}

setRestored(
  true
)

  
  if(
  !savedStage
){

  setRestored(
    true
  )
}

  },[
    level,
    examSet
  ])



  /* 1 MENIT PERSIAPAN */

useEffect(()=>{
if(

  stage !==
  "preparation"

  ||

  prepTime <= 0

) return

  const timer =
  setInterval(()=>{

    setPrepTime(
  prev=>{

    if(
      prev <= 1
    ){

      clearInterval(
        timer
      )

      setStage(
        "listening"
      )

      return 0
    }

    return Math.max(
      prev - 1,
      0
    )
  }
)

  },1000)

  return ()=>{

    clearInterval(
      timer
    )
  }

},[
  stage
])

/* AUTOPLAY AUDIO */

useEffect(()=>{

  if(

    stage !==
    "listening"

    ||

    !questions.length

  ) return

  const firstAudio =

  questions.find(
    q=>
    q.audio_url
  )

  if(
    !firstAudio
  ) return

  const audio =
  new Audio(
    firstAudio
    .audio_url
  )

  audioRef.current =
  audio

 audio.play()
.catch(()=>{

  console.log(
    "Autoplay blocked"
  )
})

  audio.onended =
  ()=>{

    setStage(
      "review"
    )
  }

},[
  stage,
  questions
])

/* SAVE STAGE */

useEffect(()=>{

  if(
    !restored
  ) return

  localStorage
  .setItem(

    stageKey,

    JSON.stringify({

      stage,

      prepTime,

      reviewTime
    })
  )

},[
  stage,
  prepTime,
  reviewTime,
  restored
])

/* REVIEW 5 MENIT */

useEffect(()=>{

  if(
    stage !==
    "review"
  ) return

  const timer =
  setInterval(()=>{

    setReviewTime(
      prev=>{

        if(
          prev <= 1
        ){

          clearInterval(
            timer
          )

          submitExam()

          return 0
        }

        return prev - 1
      }
    )

  },1000)

  return ()=>{

    clearInterval(
      timer
    )
  }

},[
  stage
])

 

  function
handleAnswer(

  id:number,

  value:string
){

  const updated = {

    ...answers,

    [id]:
    value
  }

  setAnswers(
    updated
  )

  localStorage
  .setItem(

    storageKey,

    JSON.stringify(
      updated
    )
  )
}

  async function
  submitExam(){

    let score = 0

    questions.forEach(
      q=>{

        if(

          answers[
            q.id
          ] ===
          q.correct_answer

        ){

          score++
        }
      }
    )

    const finalScore =
    Math.round(

      (
        score /
        questions.length
      ) * 100

    )

    localStorage
    .setItem(

      "horenScore",

      String(
        finalScore
      )
    )

    localStorage
.setItem(

  "moduleScore",

  String(finalScore)
)

    async function
saveAnswers(){

  const {
    data:userData
  } =

  await supabase
  .auth
  .getUser()

  const user =
  userData.user

  if(!user)
  return

  const rows =

    questions.map(
      q=>({

        user_id:
        user.id,

        level,

        module:
        "horen",

        exam_set:
        examSet,

        question_id:
        q.id,

        question_text:
        q.question_text,

        user_answer:

        answers[
          q.id
        ] || "",

        correct_answer:
        q.correct_answer,

        is_correct:

        answers[
          q.id
        ] ===

        q.correct_answer
      })
    )

  await supabase

  .from(
    "user_answers"
  )

  .insert(
    rows
  )
}

await saveAnswers()

localStorage
.removeItem(
  storageKey
)

localStorage
.removeItem(
  stageKey
)

    onComplete()
  }

  if(loading){

    return (
      <div>
        Loading...
      </div>
    )
  }

  /* WARNING SCREEN */

if(
  stage ===
  "preparation"
){

  return (

    <div className="text-center py-24">

      <h1 className="text-5xl font-bold mb-8">

        Persiapan Hören

      </h1>

      <p className="text-xl text-gray-300 max-w-2xl mx-auto">

        Audio akan langsung
        diputar otomatis.

        <br />

        Audio hanya dapat
        diputar satu kali.

        <br />

        Siapkan headset
        dan fokus mendengar.

      </p>

      <div className="text-7xl font-bold text-yellow-400 mt-12">

        {
          prepTime
        }

      </div>

    </div>
  )
}

  return (

    <div>

      <h1 className="text-4xl font-bold mb-6">

        {stage ===
"listening" && (

  <div className="bg-red-500/20 border border-red-500 rounded-3xl p-5 mb-8">

    Audio sedang diputar.
    Dengarkan baik-baik.

  </div>

)}

        Hören{" "}

        {
          level
          .toUpperCase()
        }

      </h1>

      
{stage ===
"review" && (

  <div className="bg-yellow-400 text-black rounded-3xl p-5 mb-8 flex justify-between">

    <p className="font-bold">

      Waktu memeriksa jawaban

    </p>

    <p className="font-bold text-2xl">

      {
        Math.floor(
          reviewTime / 60
        )
      }

      :

      {
        String(
          reviewTime % 60
        ).padStart(
          2,
          "0"
        )
      }

    </p>

  </div>

)}

      {[1,2,3,4].map(
        teil=>{

          const teilQuestions =
          questions.filter(
            q=>
            q.teil === teil
          )

          if(
            !teilQuestions
            .length
          ) return null

          return (

            <div
              key={teil}
              className="mb-14"
            >

              <h2 className="text-2xl font-bold mb-6">

                Teil {teil}

              </h2>

              <div className="space-y-6">

                {teilQuestions.map(
                  q=>{

                    const options = [

                      {
                        key:"A",
                        text:q.option_a,
                        image:
                        q.option_a_image
                      },

                      {
                        key:"B",
                        text:q.option_b,
                        image:
                        q.option_b_image
                      },

                      {
                        key:"C",
                        text:q.option_c,
                        image:
                        q.option_c_image
                      }

                    ]

                    return (

                      <div
                        key={q.id}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6"
                      >

                        <p className="mb-5 text-lg">

                          {
                            q.question_order
                          }.

                          {" "}

                          {
                            q.question_text
                          }

                        </p>

                        <div className="space-y-3">

                          {q.question_type ===
                          "true_false" && (

                            ["richtig","falsch"]
                            .map(
                              option=>(

                                <button
                                  key={option}

                                  onClick={()=>{

                                    handleAnswer(
                                      q.id,
                                      option
                                    )
                                  }}

                                  className={`

                                  w-full
                                  text-left
                                  p-4
                                  rounded-2xl

                                  ${
                                    answers[
                                      q.id
                                    ]
                                    === option

                                    ?

                                    "bg-yellow-400 text-black"

                                    :

                                    "bg-white/10"
                                  }

                                  `}
                                >

                                  {
                                    option
                                  }

                                </button>

                              )
                            )
                          )}

                          {q.question_type ===
                          "multiple_choice" && (

                            <div className="grid md:grid-cols-3 gap-4">

                              {options.map(
                                option=>(

                                  <button
                                    key={
                                      option.key
                                    }

                                    onClick={()=>{

                                      handleAnswer(
                                        q.id,
                                        option.key
                                      )
                                    }}

                                    className={`

                                    rounded-3xl
                                    overflow-hidden
                                    border
                                    p-4

                                    ${
                                      answers[
                                        q.id
                                      ]
                                      === option.key

                                      ?

                                      "bg-yellow-400 text-black"

                                      :

                                      "bg-white/10 border-white/10"
                                    }

                                    `}
                                  >

                                    {option.image && (

                                      <img
                                        src={
                                          option.image
                                        }

                                        alt="option"

                                        className="w-full h-[220px] object-contain rounded-2xl bg-white/5 mb-4"
                                      />

                                    )}

                                    <p className="font-bold">

                                      {
                                        option.key
                                      }

                                    </p>

                                    {option.text && (

                                      <p className="mt-2 text-sm">

                                        {
                                          option.text
                                        }

                                      </p>

                                    )}

                                  </button>

                                )
                              )}

                            </div>

                          )}

                        </div>

                      </div>

                    )
                  }
                )}

              </div>

            </div>

          )
        }
      )}

      <button

        onClick={
          submitExam
        }

        className="mt-10 w-full bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold py-5 rounded-3xl text-xl"

      >

        Lanjut

      </button>

    </div>
  )
}