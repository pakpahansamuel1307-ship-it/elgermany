"use client"

import {
  useEffect,
  useState
} from "react"

type ResultData = {
  lesen:number
  horen:number
  schreiben:number
  sprechen:number
}

export default function
ResultPage(){

  const [
    result,
    setResult
  ] =
  useState<
    ResultData | null
  >(null)

  const [
    resultType,
    setResultType
  ] =
  useState("full")

  const [
    resultModule,
    setResultModule
  ] =
  useState("")

  const [
  speakingFeedback,
  setSpeakingFeedback
] =
useState<any>(
  null
)

  useEffect(()=>{

    const type =

      localStorage
      .getItem(
        "resultType"
      )

      || "full"

    const moduleName =

      localStorage
      .getItem(
        "resultModule"
      )

      || ""

    setResultType(
      type
    )

    setResultModule(
      moduleName
    )

    const lesen =
      Number(
        localStorage.getItem(
          "lesenScore"
        ) || 0
      )

    const horen =
      Number(
        localStorage.getItem(
          "horenScore"
        ) || 0
      )

    const schreiben =
      Number(
        localStorage.getItem(
          "schreibenScore"
        ) || 0
      )

    const sprechen =
      Number(
        localStorage.getItem(
          "sprechenScore"
        ) || 0
      )

      const feedback =

localStorage
.getItem(

  "sprechenFeedback"
)

if(feedback){

  try{

    setSpeakingFeedback(

      JSON.parse(
        feedback
      )
    )

  }catch{}
}

    setResult({

      lesen,

      horen,

      schreiben,

      sprechen

    })

  },[])

  if(!result){

    return null
  }

  const moduleScore =

Number(

  localStorage
  .getItem(
    "moduleScore"
  ) || 0
)

const overall =
Math.round(

  (
    result.lesen +

    result.horen +

    result.schreiben +

    result.sprechen
  ) / 4
)

  const finalScore =

    resultType
    === "module"

    ?

    moduleScore

    :

    overall

  const passed =
    finalScore >= 60

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14">

          <h1 className="text-5xl font-bold mb-4">

            Hasil Try Out

          </h1>

          <p className="text-gray-400">

            Berikut hasil simulasi Goethe kamu.

          </p>

        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-red-500 rounded-[40px] p-[1px] mb-10">

          <div className="bg-[#0B1120] rounded-[40px] p-12 text-center">

            <p className="text-gray-400 mb-3">

              {

                resultType
                === "module"

                ?

                `${resultModule.toUpperCase()} Score`

                :

                "Overall Score"

              }

            </p>

            <h2 className="text-7xl font-bold mb-5">

              {finalScore}

            </h2>

            <div
              className={`

              inline-block
              px-6
              py-3
              rounded-full
              font-bold

              ${
                passed
                ? "bg-green-500"
                : "bg-red-500"
              }

              `}
            >

              {
                passed
                ? "BESTANDEN"
                : "NICHT BESTANDEN"
              }

            </div>

            <div className="mt-10 flex justify-center">

              <a
                href="/dashboard"

                className="bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition"
              >

                Kembali ke Dashboard

              </a>

            </div>

          </div>

        </div>

        {

          resultType
          === "full"

          ?

          (

            <div className="grid md:grid-cols-4 gap-6">

              {Object.entries(
                result
              ).map(
                (
                  [key,value]
                )=>(

                <div
                  key={key}

                  className="bg-white/5 border border-white/10 rounded-[30px] p-8 text-center"
                >

                  <p className="text-gray-400 mb-3 capitalize">

                    {key}

                  </p>

                  <h2 className="text-4xl font-bold">

                    {value}

                  </h2>

                </div>

              ))}

            </div>

          )

          :

          (

            <div className="max-w-md mx-auto">

              <div className="bg-white/5 border border-white/10 rounded-[30px] p-8 text-center">

                <p className="text-gray-400 mb-3 capitalize">

                  {
                    resultModule
                  }

                </p>

                <h2 className="text-5xl font-bold">

                  {
                    moduleScore
                  }

                </h2>

              </div>

            </div>

          )

        }

        {resultModule ===
"sprechen"

&&

speakingFeedback && (

  <div className="mt-10 bg-white/5 border border-white/10 rounded-[36px] p-8">

    <h2 className="text-3xl font-bold mb-8">

      AI Feedback
    </h2>

    {speakingFeedback
    .feedback && (

      <div className="mb-8">

        <h3 className="font-bold text-xl mb-3">

          Feedback
        </h3>

        <p className="text-gray-300 whitespace-pre-line">

          {
            speakingFeedback
            .feedback
          }

        </p>

      </div>

    )}

    {speakingFeedback
    .strengths
    ?.length > 0 && (

      <div className="mb-8">

        <h3 className="font-bold text-xl mb-3 text-green-400">

          Strengths
        </h3>

        <ul className="space-y-2">

          {speakingFeedback
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

    {speakingFeedback
    .improvements
    ?.length > 0 && (

      <div className="mb-8">

        <h3 className="font-bold text-xl mb-3 text-yellow-400">

          Improvements
        </h3>

        <ul className="space-y-2">

          {speakingFeedback
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

    {speakingFeedback
    .grammarMistakes
    ?.length > 0 && (

      <div>

        <h3 className="font-bold text-xl mb-3 text-red-400">

          Grammar Mistakes
        </h3>

        <ul className="space-y-2">

          {speakingFeedback
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

)}

      </div>

    </main>
  )
}