"use client"

import {
  useEffect,
  useState
} from "react"

import { supabase }
from "../lib/supabase"

type Attempt = {

  id:number

  module_type:string

  tryout_title:string

  score:number

  ai_feedback:string

  created_at:string

  level:string

  exam_set:number
}

export default function
TryoutSection(){

  const [
    grouped,
    setGrouped
  ] =
  useState<any[]>([])

  const [
answers,
setAnswers
] =
useState<any[]>(
  []
)

const [
explanations,
setExplanations
] =
useState<any[]>(
  []
)

  useEffect(()=>{

    async function
    loadAttempts(){

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

      const {

  data:
  userAnswers

} =

await supabase

.from(
  "user_answers"
)

.select("*")

.eq(
  "user_id",
  user.id
)

.order(
  "created_at",
  {
    ascending:false
  }
)

setAnswers(
  userAnswers
  || []
)

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
        "user_id",
        user.id
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      )

      if(error){

        console.log(
          error
        )

        return
      }

     const attempts =

data || []

     const {

  data:
  explanationData

} =

await supabase

.from(
  "tryout_explanations"
)

.select("*")

setExplanations(
  explanationData
  || []
)

const groupedData =

attempts.map(
  item=>{

    const matchedExplanation =

      explanations?.find(
        exp=>

        exp.level ===
        item.level

        &&

        exp.exam_set ===
        item.exam_set
      )

    return {

      ...item,

      explanation:
      matchedExplanation
    }
  }
)

      setGrouped(
        groupedData
      )
    }

    loadAttempts()

  },[])

  return (

    <section>

      <h1 className="text-4xl font-bold mb-3">

        Riwayat Tryout

      </h1>

      <p className="text-gray-400 mb-10">

        Review hasil tryout
        dan pembahasanmu

      </p>

      <div className="space-y-6">

        {grouped.map(
          (
            item,
            index
          )=>(

            <details
              key={index}
              className="bg-white/5 border border-white/10 rounded-[36px] p-8"
            >

              <summary className="cursor-pointer list-none">

                <div className="flex justify-between items-center gap-6">

  <div>

    <h2 className="text-2xl font-bold">

      {
        item
        .tryout_title
      }

    </h2>

    <p className="text-gray-400 mt-2">

      {
        new Date(
          item.created_at
        )

        .toLocaleDateString()
      }

    </p>

  </div>

  <div className="flex items-center gap-6">

    <div className="text-right">

      <p className="text-gray-400">

        Nilai Akhir

      </p>

      <h2 className="text-4xl font-bold text-yellow-400">

        {
          item
          .score
        }

      </h2>

    </div>

   {item.explanation ? (

  <a
    href={
      item
      .explanation
      .video_url
    }

    target="_blank"

    className="bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold px-5 py-3 rounded-2xl whitespace-nowrap"
  >

    Lihat Pembahasan ▶

  </a>

) : (

  <div className="bg-white/10 text-gray-400 font-bold px-5 py-3 rounded-2xl whitespace-nowrap">

    Belum Ada Pembahasan

  </div>

)}

  </div>

</div>

              </summary>

              <div className="mt-8 space-y-5">

                <div
  className="bg-white/5 rounded-3xl p-6 border border-white/10"
>

  <div className="flex justify-between items-start">

    <div>

      <h3 className="text-xl font-bold capitalize">

        {
          item.module_type
        }

      </h3>

      <p className="text-gray-400 mt-2">

        Score:
        {" "}
        {
          item.score
        }

      </p>

    </div>

  </div>

 {item.ai_feedback && (

  <div className="mt-5 bg-white/5 rounded-2xl p-5">

    <h4 className="font-bold mb-5 text-xl">

      Feedback AI

    </h4>

    <div className="space-y-4">

     {item.ai_feedback && (()=>{

  let parsed

  try{

    parsed =
    JSON.parse(
      item.ai_feedback
    )

  }catch{

    return (

      <div className="mt-5 bg-white/5 rounded-2xl p-5">

        <h4 className="font-bold mb-3">

          Feedback AI
        </h4>

        <p className="text-gray-300 whitespace-pre-wrap">

          {
            item.ai_feedback
          }

        </p>

      </div>

    )
  }

  return (

    <div className="mt-5 bg-white/5 rounded-2xl p-6">

      <h4 className="font-bold text-xl mb-5">

        Feedback AI
      </h4>

      {parsed.feedback && (

        <div className="mb-6">

          <h5 className="font-bold text-yellow-400 mb-3">

            Feedback
          </h5>

          <p className="text-gray-300 leading-8 whitespace-pre-line">

            {
              parsed.feedback
            }

          </p>

        </div>

      )}

      {parsed.strengths
      ?.length > 0 && (

        <div className="mb-6">

          <h5 className="font-bold text-green-400 mb-3">

            Strengths
          </h5>

          <ul className="space-y-2">

            {parsed
            .strengths
            .map(
              (
                item:string,
                index:number
              )=>(

                <li
                  key={index}
                >

                  • {item}

                </li>

            ))}

          </ul>

        </div>

      )}

      {parsed.improvements
      ?.length > 0 && (

        <div className="mb-6">

          <h5 className="font-bold text-yellow-400 mb-3">

            Improvements
          </h5>

          <ul className="space-y-2">

            {parsed
            .improvements
            .map(
              (
                item:string,
                index:number
              )=>(

                <li
                  key={index}
                >

                  • {item}

                </li>

            ))}

          </ul>

        </div>

      )}

      {parsed.grammarMistakes
      ?.length > 0 && (

        <div>

          <h5 className="font-bold text-red-400 mb-3">

            Grammar Mistakes
          </h5>

          <ul className="space-y-2">

            {parsed
            .grammarMistakes
            .map(
              (
                item:string,
                index:number
              )=>(

                <li
                  key={index}
                >

                  • {item}

                </li>

            ))}

          </ul>

        </div>

      )}

    </div>
  )

})()}

    </div>

  </div>

)}

  <div className="mt-6">

  <h4 className="font-bold text-xl mb-5">

    Review Soal

  </h4>

  <div className="space-y-4">

    {answers

      .filter(
        answer=>

        answer.level
        ===
        item.level

        &&

        answer.exam_set
        ===
        item.exam_set

        &&

        (
          item.module_type
          === "full"

          ||

          answer.module
          ===
          item.module_type
        )
      )

      .map(
        (
          answer,
          idx
        )=>(

          <div
            key={idx}

            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >

            <p className="font-semibold mb-4">

              {
                idx + 1
              }.

              {" "}

              {
                answer
                .question_text
              }

            </p>

            <p className="text-gray-400">

              Jawaban kamu:
            </p>

            <p className="mb-4">

              {
                answer
                .user_answer
              }

            </p>

            <p className="text-gray-400">

              Jawaban benar:
            </p>

            <p
              className={`

              font-bold

              ${
                answer
                .is_correct

                ?

                "text-green-400"

                :

                "text-red-400"
              }

              `}
            >

              

              {
                answer
                .correct_answer
              }

            </p>

{(() => {

  const matchedExplanation =

    explanations.find(
      exp=>

      exp.level
      ===
      answer.level

      &&

      exp.exam_set
      ===
      answer.exam_set

      &&

      exp.module
      ===
      answer.module

      &&

      exp.question_order
      ===

      idx + 1
    )

  return matchedExplanation ? (

    <div className="mt-5 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl p-5">

      <h4 className="font-bold mb-3 text-yellow-300">

        Pembahasan

      </h4>

      <p className="text-gray-300 whitespace-pre-wrap">

        {
          matchedExplanation
          .explanation_text
        }

      </p>

    </div>

  ) : null
})()}

          </div>

        )
      )}

  </div>

</div>

</div>

              </div>

            </details>

          )
        )}

      </div>

    </section>
  )
}