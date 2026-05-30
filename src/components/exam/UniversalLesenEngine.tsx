"use client"

import {
  useEffect,
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

  text_block:string

  text_block_image:string

  option_a:string
  option_b:string
  option_c:string
  option_d:string
  option_e:string
  option_f:string
  option_g:string
  option_h:string
  option_i:string
  option_j:string
  option_0:string

  option_a_image:string
  option_b_image:string
  option_c_image:string
  option_d_image:string
  option_e_image:string
  option_f_image:string
  option_g_image:string
  option_h_image:string
  option_i_image:string
  option_j_image:string
  option_0_image:string

  correct_answer:string
}

type Props = {

  level:string

  examSet:number

  onComplete:
  ()=>void
}

export default function
UniversalLesenEngine({

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

`lesen_${level}_${examSet}`

const timerKey =

`lesen_timer_${level}_${examSet}`

const timerMap:{
  [key:string]:
  number
} = {

  a1:20 * 60,
  a2:30 * 60,
  b1:65 * 60,
  b2:65 * 60
}

const [
  remainingTime,
  setRemainingTime
] =
useState(

  0
)

  const [
    loading,
    setLoading
  ] =
  useState(true)

  const [
  timerReady,
  setTimerReady
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
        "exam_questions"
      )

      .select("*")

      .eq(
        "level",
        level
      )

      .eq(
        "module",
        "lesen"
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

   /* RESTORE TIMER */

const savedTimer =

localStorage
.getItem(
  timerKey
)

if(savedTimer){

  setRemainingTime(

    Number(
      savedTimer
    )
  )

}else{

  setRemainingTime ( 
    timerMap[
      level
    ] || 1200
  )
}

setTimerReady(
  true
)

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



  },[
    level,
    examSet
  ])

  useEffect(()=>{

  localStorage
  .setItem(

    timerKey,

    String(
      remainingTime
    )
  )

},[
  remainingTime
])


useEffect(()=>{

  if(
    loading
  ) return

  if(
    !timerReady
  ) return

  if(
    remainingTime
    <= 0
  ) return

  const timer =
  setInterval(()=>{

    setRemainingTime(
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
  loading,
  timerReady
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



  function
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

      "lesenScore",

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
        "lesen",

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

saveAnswers()

localStorage
.removeItem(
  storageKey
)

localStorage
.removeItem(
  timerKey
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

  const grouped =

  questions.reduce(

    (
      acc,
      q
    )=>{

      if(
        !acc[q.teil]
      ){

        acc[q.teil]
        = []
      }

      acc[
        q.teil
      ].push(q)

      return acc

    },

    {} as Record<
      number,
      Question[]
    >

  )

  return (

    <div>

      <h1 className="text-4xl font-bold mb-10">

        Lesen{" "}

        {
          level
          .toUpperCase()
        }

      </h1>

      <div className="bg-yellow-400 text-black rounded-3xl p-5 mb-8 flex justify-between">

  <p className="font-bold">

    Waktu Tersisa

  </p>

  <p className="font-bold text-2xl">

   {
  Math.floor(
    (
      remainingTime
      ?? 0
    ) / 60
  )
}

:

{
  String(

    (
      remainingTime
      ?? 0
    ) % 60

  ).padStart(
    2,
    "0"
  )
}

  </p>

</div>

      {Object.entries(
        grouped
      ).map(

        (
          [
            teil,
            teilQuestions
          ]
        )=>(

          <div
            key={teil}
            className="mb-14"
          >

            <h2 className="text-2xl font-bold mb-6">

              Teil {teil}

            </h2>

            {teilQuestions[
              0
            ]?.text_block_image && (

              <img
                src={
                  teilQuestions[
                    0
                  ]
                  .text_block_image
                }

                alt="text block"

                className="w-full rounded-[32px] mb-6 object-contain bg-white/5 p-4"
              />

            )}

            {teilQuestions[
              0
            ]?.text_block && (

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 mb-8">

                <p className="whitespace-pre-line text-lg">

                  {
                    teilQuestions[
                      0
                    ]
                    .text_block
                  }

                </p>

              </div>

            )}

            <div className="space-y-8">

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
                    },

                    {
                      key:"D",
                      text:q.option_d,
                      image:
                      q.option_d_image
                    },

                    {
                      key:"E",
                      text:q.option_e,
                      image:
                      q.option_e_image
                    },

                    {
                      key:"F",
                      text:q.option_f,
                      image:
                      q.option_f_image
                    },

                    {
                      key:"G",
                      text:q.option_g,
                      image:
                      q.option_g_image
                    },

                    {
                      key:"H",
                      text:q.option_h,
                      image:
                      q.option_h_image
                    },

                    {
  key:"I",
  text:q.option_i,
  image:
  q.option_i_image
},

{
  key:"J",
  text:q.option_j,
  image:
  q.option_j_image
},

                    {
                      key:"0",
                      text:q.option_0,
                      image:
                      q.option_0_image
                    }

                  ].filter(
                    option=>

                    option.text ||

                    option.image
                  )

                  return (

                    <div
                      key={q.id}
                      className="bg-white/5 border border-white/10 rounded-[32px] p-6"
                    >

                      <p className="text-lg mb-5">

                        {
                          q.question_order
                        }.

                        {" "}

                        {
                          q.question_text
                        }

                      </p>

                      {q.question_type ===
                      "multiple_choice" && (

                        <div className="space-y-3">

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

                                w-full
                                text-left
                                p-4
                                rounded-3xl

                                ${
                                  answers[
                                    q.id
                                  ]
                                  ===
                                  option.key

                                  ?

                                  "bg-yellow-400 text-black"

                                  :

                                  "bg-white/10"
                                }

                                `}
                              >

                                {option.image && (

                                  <img
                                    src={
                                      option.image
                                    }

                                    alt="option"

                                    className="w-full max-h-[250px] object-contain rounded-2xl bg-white/5 mb-4"
                                  />

                                )}

                                <span className="font-bold">

                                  {
                                    option.key
                                  }.

                                </span>

                                {" "}

                                {
                                  option.text
                                }

                              </button>

                            )
                          )}

                        </div>

                      )}

                      {q.question_type ===
                      "matching_ads" && (

                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">

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

                                p-4
                                rounded-2xl
                                font-bold

                                ${
                                  answers[
                                    q.id
                                  ]
                                  ===
                                  option.key

                                  ?

                                  "bg-yellow-400 text-black"

                                  :

                                  "bg-white/10"
                                }

                                `}
                              >

                                {
                                  option.key
                                }

                              </button>

                            )
                          )}

                        </div>

                      )}

                    </div>

                  )
                }
              )}

            </div>

          </div>

        )

      )}

      <button

        onClick={
          submitExam
        }

        className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold py-5 rounded-3xl text-xl"

      >

        Submit Lesen

      </button>

    </div>
  )
}