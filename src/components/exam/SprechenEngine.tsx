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
    remainingTeilTime,
    setRemainingTeilTime
  ] =
  useState(5 * 60)


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
  dialogStarted,
  setDialogStarted
] =
useState(false)

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

  const aiAudioRef =
useRef<
  HTMLAudioElement
  | null
>(null)

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
    phase !==
    "exam"
  ) return

  const timer =
  setInterval(()=>{

    setRemainingTeilTime(
      prev=>{

        if(prev <= 1){

         if(
  currentTeil < 3
){

  stopAiAudio()

  setCurrentTeil(
    prev => prev + 1
  )

  setRemainingTeilTime(
    5 * 60
  )

  return 5 * 60
}

          finishExam()

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
  phase,
  currentTeil
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

        setAllTranscript(
  prev =>
  prev +
  `\nTEIL ${currentTeil} MONOLOG`
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

        
if(isMonolog){

  setCompletedTeil(
    prev=>({

      ...prev,

      [currentTeil]:
      true
    })
  )

}

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

  async function startDialog(){

    if(!isDialog){
  return
}

  try{

    setAiThinking(true)

    const formData =
    new FormData()

    formData.append(
      "level",
      level
    )

    formData.append(
      "teil",
      String(currentTeil)
    )

    formData.append(
      "questionType",
      "dialog"
    )

    formData.append(
      "theme",
      currentQuestion?.question_text || ""
    )

    formData.append(
      "task",
      currentQuestion?.text_block || ""
    )

    

    formData.append(
      "history",
      JSON.stringify([])
    )

    formData.append( 
      "round",
      "0"
    
    )

    const response =
    await fetch(
      "/api/speaking-ai",
      {
        method:"POST",
        body:formData
      }
    )

    const data =
    await response.json()

    setAiThinking(false)

    setAiMessage(
      data.aiReply
    )

    const audio =
new Audio(
  data.audio
)

aiAudioRef.current =
audio

    setAiSpeaking(true)

    audio.play()

    audio.onended =
    async ()=>{

      setAiSpeaking(false)

      await startRecording()
    }

  }catch(error){

    console.log(error)
  }
}


  async function
stopRecording(){

  mediaRecorder
  .current
  ?.stop()

 if(isMonolog){

  setAiThinking (false)
  setAiSpeaking (false)

  const blob =
  new Blob(
    chunks.current,
    {
      type:"audio/webm"
    }
  )

  const formData =
  new FormData()

  formData.append(
    "audio",
    blob,
    "voice.webm"
  )

  const response =
  await fetch(
    "/api/transcribe",
    {
      method:"POST",
      body:formData
    }
  )

  const data =
  await response.json()

  setAllTranscript(
    prev=>

    prev +

    `\nTEIL ${currentTeil}:\n${data.transcript}\n`
  )

  setCompletedTeil(
    prev=>({
      ...prev,
      [currentTeil]:true
    })
  )

  return
}



  {

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
          String(currentTeil)
        )

       formData.append(
  "questionType",
  currentQuestion
  ?.question_type
  || "dialog"
)

       formData.append(

  "theme",

  currentQuestion
  ?.question_text

  || ""

)

formData.append(
  "task",
  currentQuestion?.text_block || ""
)

        formData.append(

          "history",

          JSON.stringify(
            conversationHistory
          )
        )

        formData.append(
          "round",
          String(dialogRound)
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

aiAudioRef.current =
audio

        setAiSpeaking(
          true
        )


      audio.play()

audio.onended =
async ()=>{

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
      role:"user",
      content:data.transcript
    },

    {
      role:"assistant",
      content:data.aiReply
    }
  ]
)

  await startRecording()
}

      }catch(error){

        console.log(
          error
        )

      }

    },500)
  }
}

function stopAiAudio(){

  if(
    aiAudioRef.current
  ){

    aiAudioRef.current.pause()

    aiAudioRef.current.currentTime = 0

    aiAudioRef.current.onended = null

    aiAudioRef.current = null
  }

  setAiSpeaking(false)

  setAiThinking(false)

  setAiMessage("")
}

  function nextTeil(){

    stopAiAudio()

  const maxTeil =
  Math.max(
    ...questions.map(
      q => q.teil
    )
  )

  if(
    currentTeil < maxTeil
  ){

    setCurrentTeil(
      prev => prev + 1
    )

    setRemainingTeilTime(
      5 * 60
    )

    return
  }

  finishExam()
}

  async function
finishExam(){

  stopAiAudio()

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

  questions:

  questions.map(
    q=>({

      teil:q.teil,

      question:q.question_text,

      info:q.text_block
    })
  ),

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

  console.log(error)

  localStorage.setItem(
    "sprechenScore",
    "0"
  )

  localStorage.setItem(
    "sprechenFeedback",
    JSON.stringify({
      feedback:
      "Terjadi kesalahan saat menilai speaking."
    })
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

    const currentQuestion =
teilQuestions?.[0]



useEffect(()=>{

  setDialogRound(
    0
  )

  setConversationHistory(
    []
  )

  setAiMessage(
    ""
  )

  setAiThinking(
    false
  )

  setAiSpeaking(
    false
  )

  setDialogStarted(false)

},[
  currentTeil
])

const questionType =

String(
  currentQuestion
  ?.question_type
  || ""
)
.toLowerCase()
.trim()

const isDialog =
questionType === "dialog"

const isMonolog =
questionType === "monolog"
  

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
                remainingTeilTime
              )
            }

          </div>

        )}

      </div>

      

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

        <p className="mb-6 text-lg whitespace-pre-line">

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

{phase === "preparation" && (

  <button

    onClick={()=>{
      setPhase("exam")
    }}

    className="mt-8 w-full bg-green-500 text-white py-5 rounded-3xl font-bold text-xl"

  >

    Akhiri Persiapan

  </button>

)}

      {/* RECORD */}

      {phase ===
"exam" &&

!completedTeil[
  currentTeil
] && (

<>

{aiThinking && isDialog && (

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

       onClick={()=>{

  if(recording){

    stopRecording()

    return
  }

  if(
    isDialog &&
    dialogRound === 0 &&
    !aiMessage
  ){

    startDialog()

    return
  }

  startRecording()
}}

          className="mt-8 w-full bg-yellow-400 text-black rounded-3xl py-5 font-bold text-xl"
        >

          {
  aiSpeaking

  ?

  "🎧 AI Sedang Berbicara..."

  :

 recording

?

(
  isDialog

  ?

  "Akhiri Dialog"

  :

  "Akhiri Monolog"
)

:
(
  isDialog
  ?
  (
    dialogRound === 0
    ?
    "Start Dialog"
    :
    "🎤 Sedang Mendengarkan..."
  )
  :
  "Start Monolog"
)
}

        </button>

      </> )}

      {/* PREVIEW */}

      {recordings[
  currentTeil
] &&

isMonolog && (

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

{phase === "exam" && (

  <div className="mt-8">

    <button

      onClick={()=>{

        if(
          confirm(
            "Yakin ingin lanjut ke Teil berikutnya?"
          )
        ){

          nextTeil()
        }
      }}

      className="w-full bg-green-500 text-white py-4 rounded-3xl font-bold"

    >

      Lanjut Teil Berikutnya →

    </button>

  </div>

)}

    </div>
  )
}