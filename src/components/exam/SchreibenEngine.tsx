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

  question_text:string

  text_block:string

  text_block_image:string
}

type Props = {

  level:string

  examSet:number

  onComplete:
  ()=>void
}

export default function
SchreibenEngine({

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

`schreiben_${level}_${examSet}`

const timerKey =

`schreiben_timer_${level}_${examSet}`

const timerMap:{
  [key:string]:
  number
} = {

  a1:20 * 60,
  a2:30 * 60,
  b1:60 * 60,
  b2:75 * 60
}

  const [
    loading,
    setLoading
  ] =
  useState(true)

  const [
    submitting,
    setSubmitting
  ] =
  useState(false)

  const [
  remainingTime,
  setRemainingTime
] =
useState(

  timerMap[
    level
  ] || 1200
)

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
        "schreiben"
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
}

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
    submitting
  ) return

  if(
    remainingTime
    <= 0
  ){

    submitExam()

    return
  }

  const timer =
  setInterval(()=>{

    setRemainingTime(
      prev=>

      Math.max(
        prev - 1,
        0
      )
    )

  },1000)

  return ()=>{

    clearInterval(
      timer
    )
  }

},[
  loading,
  submitting
])

  function
handleChange(

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

  try{

    setSubmitting(
      true
    )

    const answerList =

      questions.map(
        q=>

        answers[
          q.id
        ] || ""
      )

    const questionList =

      questions.map(
        q=>

        q.question_text
      )

    const aiResponse =

      await fetch(

        "/api/ai-grade",

        {

          method:
          "POST",

          headers:{

            "Content-Type":
            "application/json"
          },

          body:
          JSON.stringify({

            level,

            module:
            "schreiben",

            answers:
            answerList,

            questions:
            questionList
          })
        }
      )

    const aiResult =

      await aiResponse
      .json()

    const score =

      aiResult.score
      || 70

    const feedback =

      aiResult.feedback
      || "Feedback belum tersedia."

    localStorage
    .setItem(

      "schreibenScore",

      String(score)
    )

    localStorage
.setItem(

  "moduleScore",

  String(score)
)

    localStorage
    .setItem(

      "schreibenFeedback",

      feedback
    )


    setSubmitting(
      false
    )

    localStorage
.removeItem(
  storageKey
)

localStorage
.removeItem(
  timerKey
)

    onComplete()

  }catch(error){

    console.log(
      error
    )

    alert(
      "AI gagal memproses jawaban."
    )

    setSubmitting(
      false
    )
  }
}

  if(loading){

    return (
      <div>
        Loading...
      </div>
    )
  }

  return (

    <div>

      <h1 className="text-4xl font-bold mb-4">

        Schreiben{" "}

        {
          level
          .toUpperCase()
        }

      </h1>

      <p className="text-gray-400 mb-10">

        Jawab semua pertanyaan
        dengan bahasa Jerman.

      </p>

      <div className="bg-yellow-400 text-black rounded-3xl p-5 mb-8 flex justify-between">

  <p className="font-bold">

    Waktu Tersisa

  </p>

  <p className="font-bold text-2xl">

    {
      Math.floor(
        remainingTime
        / 60
      )
    }

    :

    {
      String(

        remainingTime
        % 60

      ).padStart(
        2,
        "0"
      )
    }

  </p>

</div>

      <div className="space-y-10">

        {questions.map(
          question=>(

            <div
              key={
                question.id
              }

              className="bg-white/5 border border-white/10 rounded-[36px] p-8"
            >

              <h2 className="text-2xl font-bold mb-5">

                Teil{" "}

                {
                  question.teil
                }

              </h2>

              {question
              .text_block_image && (

                <img
                  src={
                    question
                    .text_block_image
                  }

                  alt="stimulus"

                  className="w-full rounded-3xl mb-6 object-contain bg-white/5 p-4"
                />

              )}

              {question
              .text_block && (

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">

                  <p className="whitespace-pre-line text-lg">

                    {
                      question
                      .text_block
                    }

                  </p>

                </div>

              )}

              <p className="mb-6 text-lg">

                {
                  question
                  .question_text
                }

              </p>

              <textarea

                value={

                  answers[
                    question.id
                  ] || ""

                }

                onChange={(
                  e
                )=>

                  handleChange(

                    question.id,

                    e.target
                    .value
                  )
                }

                placeholder="Tulis jawabanmu di sini..."

                className="w-full min-h-[240px] bg-white/10 border border-white/10 rounded-3xl p-6 outline-none resize-none text-white"

              />

              <div className="mt-4 text-sm text-gray-400">

                Jumlah kata:

                {" "}

                {

                  (
                    answers[
                      question.id
                    ] || ""
                  )

                  .trim()

                  .split(" ")

                  .filter(
                    word=>
                    word.length > 0
                  )

                  .length

                }

              </div>

            </div>

          )
        )}

      </div>

      <button

        onClick={
          submitExam
        }

        disabled={
          submitting
        }

        className="mt-10 w-full bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold py-5 rounded-3xl text-xl"

      >

        {

          submitting

          ?

          "Memproses..."

          :

          "Submit Schreiben"

        }

      </button>

    </div>
  )
}