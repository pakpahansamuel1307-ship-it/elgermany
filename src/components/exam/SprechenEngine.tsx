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

  text_block:string

  image_url:string

  image_url_2:string
}

type Props = {

  level:string

  examSet:number

  onComplete:
  ()=>void
}

export default function
SprechenEngine({

  level,
  examSet,
  onComplete

}:Props){

  const [
    loading,
    setLoading
  ] =
  useState(true)

  const [
    phase,
    setPhase
  ] =
  useState<
  "preparation" |
  "exam" |
  "finished"
  >(
    "preparation"
  )

  const [
    questions,
    setQuestions
  ] =
  useState<Question[]>(
    []
  )

  const [
    remainingPrep,
    setRemainingPrep
  ] =
  useState(15 * 60)

  const [
    remainingExam,
    setRemainingExam
  ] =
  useState(15 * 60)

  const [
  b2AnswerTimer,
  setB2AnswerTimer
] =
useState(180)

  const [
    currentTeil,
    setCurrentTeil
  ] =
  useState(1)

  const [
    recording,
    setRecording
  ] =
  useState(false)

  const [
    completedTeil,
    setCompletedTeil
  ] =
  useState<
    Record<number,boolean>
  >({})

  const [
    recordings,
    setRecordings
  ] =
  useState<
    Record<number,string>
  >({})
  
  const [
  aiThinking,
  setAiThinking
] =
useState(false)

const [
  examFinished,
  setExamFinished
] =
useState(false)

const [
  aiSpeaking,
  setAiSpeaking
] =
useState(false)

const [
  aiMessage,
  setAiMessage
] =
useState("")

const [
  dialogRound,
  setDialogRound
] =
useState(0)

const [
  teilRoundLimit,
  setTeilRoundLimit
] =
useState(3)

const [
  conversationHistory,
  setConversationHistory
] =
useState<any[]>([])

const [
  allTranscript,
  setAllTranscript
] =
useState("")

  const mediaRecorder =
  useRef<
    MediaRecorder |
    null
  >(null)

  const chunks =
  useRef<Blob[]>([])

  // ==================
  // LOAD QUESTIONS
  // ==================

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
        "module",
        "sprechen"
      )

      .eq(
        "level",
        level
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

        console.log(error)

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

  },[
    level,
    examSet
  ])

  // ==================
  // PREP TIMER
  // ==================

  useEffect(()=>{

    if(
      phase !==
      "preparation"
    ) return

    const timer =
    setInterval(()=>{

      setRemainingPrep(
        prev=>{

          if(prev <= 1){

            setPhase(
              "exam"
            )

            return 0
          }

          return prev - 1
        }
      )

    },1000)

    return ()=>clearInterval(
      timer
    )

  },[
    phase
  ])

  // ==================
  // EXAM TIMER
  // ==================

  useEffect(()=>{

  if(
    level !== "b2"
    ||
    currentTeil !== 1
    ||
    !recording
  ) return

  const timer =
  setInterval(()=>{

    setB2AnswerTimer(
      prev=>{

        if(prev <= 1){

          stopRecording()

          return 0
        }

        return prev - 1
      }
    )

  },1000)

  return ()=>clearInterval(
    timer
  )

},[
  level,
  currentTeil,
  recording
])

  useEffect(()=>{

    if(
      phase !==
      "exam"
    ) return

    const timer =
    setInterval(()=>{

      setRemainingExam(
        prev=>{

          if(prev <= 1){

            finishExam()

            return 0
          }

          return prev - 1
        }
      )

    },1000)

    return ()=>clearInterval(
      timer
    )

  },[
    phase
  ])

  // ==================
  // RECORD
  // ==================

  async function
  startRecording(){

    try{

      const stream =

      await navigator
      .mediaDevices
      .getUserMedia({

        audio:true
      })

      const recorder =

      new MediaRecorder(
        stream
      )

      mediaRecorder
      .current =
      recorder

      chunks.current =
      []

      recorder
      .ondataavailable =
      e=>{

        chunks.current
        .push(
          e.data
        )
      }

      recorder.onstop =
      ()=>{

        const blob =
        new Blob(

          chunks.current,

          {
            type:
            "audio/webm"
          }
        )

        const url =
        URL
        .createObjectURL(
          blob
        )

        setRecordings(
          prev=>({

            ...prev,

            [currentTeil]:
            url
          })
        )

        setCompletedTeil(
          prev=>({

            ...prev,

            [currentTeil]:
            true
          })
        )

        stream
        .getTracks()
        .forEach(
          t=>t.stop()
        )

        setRecording(
          false
        )
      }

      recorder.start()

      setRecording(
        true
      )

    }catch{

      alert(
        "Microphone tidak diizinkan."
      )
    }
  }



  async function
stopRecording(){

  mediaRecorder
  .current
  ?.stop()

  // Teil 2 AI dialog
if(

  // A1
  (
    level === "a1"
    &&
    (
      currentTeil === 2
      ||
      currentTeil === 3
    )
  )

  ||

  // A2
  (
    level === "a2"
    &&
    (
      currentTeil === 1
      ||
      currentTeil === 3
    )
  )

  ||

(
  level === "b1"
  &&
  (
    currentTeil === 1
    ||
    currentTeil === 3
  )
)

||

(
  level === "b2"
)

){

    setTimeout(async ()=>{

      try{

        setAiThinking(
          true
        )

        const blob =
        new Blob(
          chunks.current,
          {
            type:
            "audio/webm"
          }
        )

        const formData =
        new FormData()

        formData.append(
          "audio",
          blob,
          "voice.webm"
        )

        formData.append(
          "level",
          level
        )

        formData.append(
          "teil",
          "2"
        )

        formData.append(

          "theme",

          teilQuestions?.[
  dialogRound
]?.text_block
||
teilQuestions?.[
  0
]?.text_block

          || ""
        )

        formData.append(

          "history",

          JSON.stringify(
            conversationHistory
          )
        )

        const response =
        await fetch(

          "/api/speaking-ai",

          {
            method:"POST",

            body:
            formData
          }
        )

        const data =
        await response
        .json()

        setAllTranscript(
  prev=>

  prev +

  `\nUSER: ${
    data.transcript
  }\nAI: ${
    data.aiReply
  }\n`
)

        setAiThinking(
          false
        )

        if(!data.success){

          alert(
            "AI Error"
          )

          return
        }

        setAiMessage(
          data.aiReply
        )

        const audio =
        new Audio(
          data.audio
        )

        setAiSpeaking(
          true
        )


      audio.play()

audio.onended =
()=>{

  setAiSpeaking(
    false
  )

  const nextRound =
  dialogRound + 1

  setDialogRound(
    nextRound
  )

  setConversationHistory(
    prev=>[

      ...prev,

      {
        role:
        "assistant",

        content:
        data.aiReply
      }
    ]
  )

  // A1/A2
  if(
    level === "a1"
    ||
    level === "a2"
  ){

    if(
      nextRound >=
      teilRoundLimit
    ){

      setTimeout(()=>{

        if(
          currentTeil < 3
        ){

          setCurrentTeil(
            prev =>
            prev + 1
          )

          setDialogRound(
            0
          )

          setAiMessage(
            ""
          )

        }else{

          finishExam()
        }

      },1000)
    }
  }

  // B1
  if(level === "b1"){

    if(
      currentTeil === 3
    ){

      finishExam()
    }
  }

// B1 presentasi
if(
  level === "b1"
  &&
  currentTeil === 2
){

  setTimeout(async ()=>{

    try{

      setAiThinking(
        true
      )

      const formData =
      new FormData()

      formData.append(
        "level",
        "b1"
      )

      formData.append(
        "teil",
        "3"
      )

      formData.append(

        "theme",

        teilQuestions?.[
          0
        ]?.text_block
        || ""
      )

      formData.append(

        "history",

        JSON.stringify([])
      )

      const response =
      await fetch(

        "/api/speaking-ai",

        {

          method:"POST",

          body:
          formData
        }
      )

      const data =
      await response
      .json()

      setAiThinking(
        false
      )

      const audio =
      new Audio(
        data.audio
      )

      setAiSpeaking(
        true
      )

      audio.play()

      audio.onended =
      ()=>{

        setAiSpeaking(
          false
        )

        setCurrentTeil(
          3
        )
      }

    }catch(error){

      console.log(
        error
      )
    }

  },500)

  return
}

  // B2
if(level === "b2"){

  // setelah pertanyaan
  if(
    currentTeil === 1
  ){

    startRecording()

    return
  }

  // diskusi selesai
  if(
    currentTeil === 2
    &&
    nextRound >=
    teilRoundLimit
  ){

    finishExam()
  }
}
}

      }catch(error){

        console.log(
          error
        )

      }

    },500)
  }
}

  function
  nextTeil(){

    if(currentTeil < 3){

      setCurrentTeil(
        prev=>prev+1
      )

      return
    }

    finishExam()
  }

  async function
finishExam(){

  if(
  examFinished
){

  return
}

setExamFinished(
  true
)

  try{

    const transcript =
allTranscript

    const response =
    await fetch(

      "/api/speaking-grade",

      {

        method:"POST",

        headers:{

          "Content-Type":
          "application/json"
        },

        body:
        JSON.stringify({

          level,

          transcript,

          speakingData:{

            currentTeil,

            round:
            dialogRound
          }
        })
      }
    )

    const data =
    await response
    .json()

    localStorage
    .setItem(

      "sprechenScore",

      String(
        data.score
      )
    )

    localStorage
    .setItem(

      "sprechenFeedback",

      JSON.stringify({

        feedback:
        data.feedback,

        strengths:
        data.strengths,

        improvements:
        data.improvements,

        grammarMistakes:
        data.grammarMistakes
      })
    )

    onComplete()

  }catch(error){

    console.log(
      error
    )

    localStorage
    .setItem(

      "sprechenScore",

      "75"
    )

    onComplete()
  }
}

  function
  formatTime(
    seconds:number
  ){

    const min =
    Math.floor(
      seconds / 60
    )

    const sec =
    seconds % 60

    return `${min}:${
      sec
      .toString()
      .padStart(
        2,
        "0"
      )
    }`
  }

  const teilQuestions =

    questions.filter(
      q=>
      q.teil ===
      currentTeil
    )

    useEffect(()=>{

  // A1
  if(level === "a1"){

    if(currentTeil === 2){

      setTeilRoundLimit(
        3
      )
    }

    if(currentTeil === 3){

      setTeilRoundLimit(
        3
      )
    }
  }

  // A2
  if(level === "a2"){

    if(currentTeil === 1){

      setTeilRoundLimit(
        4
      )
    }

    if(currentTeil === 3){

      setTeilRoundLimit(
        4
      )
    }
  }

 // B1
if(level === "b1"){

  if(currentTeil === 1){

    setTeilRoundLimit(
      999
    )
  }

  if(currentTeil === 2){

    setTeilRoundLimit(
      1
    )
  }

  if(currentTeil === 3){

    setTeilRoundLimit(
      1
    )
  }
}

  // B2
if(level === "b2"){

  // Presentasi
  if(currentTeil === 1){

    setTeilRoundLimit(
      1
    )
  }

  // Diskusi
  if(currentTeil === 2){

    setTeilRoundLimit(
      999
    )
  }
}

},[
  level,
  currentTeil
])

  if(loading){

    return (
      <div>
        Loading...
      </div>
    )
  }

  return (

    <div>

      <h1 className="text-4xl font-bold mb-8">

        Sprechen{" "}

        {
          level
          .toUpperCase()
        }

      </h1>

      {/* TIMER */}

      <div className="mb-8">

        {phase ===
        "preparation" ? (

          <div className="bg-yellow-400 text-black rounded-3xl p-5 text-center font-bold text-2xl">

            Persiapan:

            {" "}

            {
              formatTime(
                remainingPrep
              )
            }

          </div>

        ) : (

          <div className="bg-red-500 text-white rounded-3xl p-5 text-center font-bold text-2xl">

            Prüfung:

            {" "}

            {
              formatTime(
                remainingExam
              )
            }

          </div>

        )}

      </div>

      {level === "b2"
&&
currentTeil === 1
&&
recording && (

  <div className="bg-blue-500 text-white rounded-3xl p-4 text-center font-bold mt-4">

    Antwortzeit:

    {" "}

    {
      formatTime(
        b2AnswerTimer
      )
    }

  </div>

)}

      {/* QUESTIONS */}

      <div className="space-y-8">

  {(phase ===
  "preparation"

    ?

    questions

    :

    teilQuestions

  ).map(
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

        <p className="mb-6 text-lg">

          {
            question
            .question_text
          }

        </p>

        {question
        .text_block && (

          <div className="bg-white/5 p-6 rounded-3xl mb-6 whitespace-pre-line">

            {
              question
              .text_block
            }

          </div>

        )}

        {question
        .image_url && (

          <img
            src={
              question
              .image_url
            }

            className="rounded-3xl mb-6"
          />

        )}

      </div>

    )
  )}

</div>

      {/* RECORD */}

      {phase ===
"exam" &&

!completedTeil[
  currentTeil
] && (

<>

{aiThinking && (

  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6 text-center">

    🤖 Prüfer denkt nach...

  </div>

)}

{aiMessage && (

  <div className="bg-yellow-400 text-black rounded-3xl p-5 mb-6">

    🎧 Prüfer hat gesprochen

  </div>

)}
        
        <button

        disabled={ aiSpeaking }

          onClick={()=>
            recording
            ?

            stopRecording()

            :

            startRecording()
          }

          className="mt-8 w-full bg-yellow-400 text-black rounded-3xl py-5 font-bold text-xl"
        >

          {
  aiSpeaking

  ?

  "🎧 AI Sedang Berbicara..."

  :

  recording

  ?

  "Stop & Submit"

  :

  "🎤 Mulai Rekaman"
}

        </button>

      </> )}

      {/* PREVIEW */}

      {recordings[
        currentTeil
      ] && (

        <div className="mt-8">

          <audio
            controls
            src={
              recordings[
                currentTeil
              ]
            }

            className="w-full"
          />

          <button

            onClick={
              nextTeil
            }

            className="mt-5 w-full bg-green-500 text-white py-4 rounded-3xl font-bold"
          >

            Lanjut Teil
          </button>

        </div>

      )}

    </div>
  )
}