"use client"

import { useEffect, useRef, useState } from "react"
import {
  Mic,
  Square,
  Volume2,
  Bot,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react"

import { supabase } from "../../lib/supabase"

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
  onComplete:()=>void
}

export default function SprechenEngine({ level, examSet, onComplete }:Props){

  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<"preparation" | "exam" | "finished">("preparation")
  const [questions, setQuestions] = useState<Question[]>([])

  const [remainingPrep, setRemainingPrep] = useState(15 * 60)
  const [remainingTeilTime, setRemainingTeilTime] = useState(5 * 60)

  const [currentTeil, setCurrentTeil] = useState(1)
  const [recording, setRecording] = useState(false)
  const [completedTeil, setCompletedTeil] = useState<Record<number,boolean>>({})
  const [recordings, setRecordings] = useState<Record<number,string>>({})

  const [aiThinking, setAiThinking] = useState(false)
  const [examFinished, setExamFinished] = useState(false)
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [aiMessage, setAiMessage] = useState("")
  const [dialogRound, setDialogRound] = useState(0)
  const [dialogStarted, setDialogStarted] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<any[]>([])
  const [allTranscript, setAllTranscript] = useState("")

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const aiAudioRef = useRef<HTMLAudioElement | null>(null)

  // ==================
  // LOAD QUESTIONS
  // ==================

  useEffect(()=>{

    async function loadQuestions(){

      const { data, error } = await supabase
        .from("exam_questions")
        .select("*")
        .eq("module", "sprechen")
        .eq("level", level)
        .eq("exam_set", examSet)
        .order("teil", { ascending:true })
        .order("question_order", { ascending:true })

      if(error){
        console.log(error)
        return
      }

      setQuestions(data || [])
      setLoading(false)
    }

    loadQuestions()

  },[level, examSet])

  // ==================
  // PREP TIMER
  // ==================

  useEffect(()=>{

    if(phase !== "preparation") return

    const timer = setInterval(()=>{
      setRemainingPrep(prev=>{
        if(prev <= 1){
          setPhase("exam")
          return 0
        }
        return prev - 1
      })
    },1000)

    return ()=>clearInterval(timer)

  },[phase])

  // ==================
  // EXAM TIMER
  // ==================

  useEffect(()=>{

    if(phase !== "exam") return

    const timer = setInterval(()=>{
      setRemainingTeilTime(prev=>{
        if(prev <= 1){
          if(currentTeil < 3){
            stopAiAudio()
            setCurrentTeil(prev => prev + 1)
            setRemainingTeilTime(5 * 60)
            return 5 * 60
          }
          finishExam()
          return 0
        }
        return prev - 1
      })
    },1000)

    return ()=>{ clearInterval(timer) }

  },[phase, currentTeil])

  // ==================
  // RECORD
  // ==================

  async function startRecording(){

    try{

      const stream = await navigator.mediaDevices.getUserMedia({ audio:true })

      const recorder = new MediaRecorder(stream)

      mediaRecorder.current = recorder
      chunks.current = []

      recorder.ondataavailable = e=>{
        chunks.current.push(e.data)
      }

      recorder.onstop = ()=>{

        const blob = new Blob(chunks.current, { type:"audio/webm" })

        setAllTranscript(prev => prev + `\nTEIL ${currentTeil} MONOLOG`)

        const url = URL.createObjectURL(blob)

        setRecordings(prev=>({ ...prev, [currentTeil]:url }))

        if(isMonolog){
          setCompletedTeil(prev=>({ ...prev, [currentTeil]:true }))
        }

        stream.getTracks().forEach(t=>t.stop())

        setRecording(false)
      }

      recorder.start()

      setRecording(true)

    }catch{
      alert("Microphone tidak diizinkan.")
    }
  }

  async function startDialog(){

    if(!isDialog) return

    try{

      setAiThinking(true)

      const formData = new FormData()

      formData.append("level", level)
      formData.append("teil", String(currentTeil))
      formData.append("questionType", "dialog")
      formData.append("theme", currentQuestion?.question_text || "")
      formData.append("task", currentQuestion?.text_block || "")
      formData.append("history", JSON.stringify([]))
      formData.append("round", "0")

      const response = await fetch("/api/speaking-ai", {
        method:"POST",
        body:formData
      })

      const data = await response.json()

      setAiThinking(false)
      setAiMessage(data.aiReply)

      const audio = new Audio(data.audio)

      aiAudioRef.current = audio

      setAiSpeaking(true)

      audio.play()

      audio.onended = async ()=>{
        setAiSpeaking(false)
        await startRecording()
      }

    }catch(error){
      console.log(error)
    }
  }

  async function stopRecording(){

    mediaRecorder.current?.stop()

    if(isMonolog){

      setAiThinking(false)
      setAiSpeaking(false)

      const blob = new Blob(chunks.current, { type:"audio/webm" })

      const formData = new FormData()

      formData.append("audio", blob, "voice.webm")

      const response = await fetch("/api/transcribe", {
        method:"POST",
        body:formData
      })

      const data = await response.json()

      setAllTranscript(prev => prev + `\nTEIL ${currentTeil}:\n${data.transcript}\n`)

      setCompletedTeil(prev=>({ ...prev, [currentTeil]:true }))

      return
    }

    {
      setTimeout(async ()=>{

        try{

          setAiThinking(true)

          const blob = new Blob(chunks.current, { type:"audio/webm" })

          const formData = new FormData()

          formData.append("audio", blob, "voice.webm")
          formData.append("level", level)
          formData.append("teil", String(currentTeil))
          formData.append("questionType", currentQuestion?.question_type || "dialog")
          formData.append("theme", currentQuestion?.question_text || "")
          formData.append("task", currentQuestion?.text_block || "")
          formData.append("history", JSON.stringify(conversationHistory))
          formData.append("round", String(dialogRound))

          const response = await fetch("/api/speaking-ai", {
            method:"POST",
            body:formData
          })

          const data = await response.json()

          setAllTranscript(prev => prev + `\nUSER: ${data.transcript}\nAI: ${data.aiReply}\n`)

          setAiThinking(false)

          if(!data.success){
            alert("AI Error")
            return
          }

          setAiMessage(data.aiReply)

          const audio = new Audio(data.audio)

          aiAudioRef.current = audio

          setAiSpeaking(true)

          audio.play()

          audio.onended = async ()=>{

            setAiSpeaking(false)

            const nextRound = dialogRound + 1

            setDialogRound(nextRound)

            setConversationHistory(prev=>[
              ...prev,
              { role:"user", content:data.transcript },
              { role:"assistant", content:data.aiReply }
            ])

            await startRecording()
          }

        }catch(error){
          console.log(error)
        }

      },500)
    }
  }

  function stopAiAudio(){

    if(aiAudioRef.current){
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

    const maxTeil = Math.max(...questions.map(q => q.teil))

    if(currentTeil < maxTeil){
      setCurrentTeil(prev => prev + 1)
      setRemainingTeilTime(5 * 60)
      return
    }

    finishExam()
  }

  async function finishExam(){

    stopAiAudio()

    if(examFinished) return

    setExamFinished(true)

    try{

      const transcript = allTranscript

      const response = await fetch("/api/speaking-grade", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          level,
          transcript,
          questions: questions.map(q=>({
            teil:q.teil,
            question:q.question_text,
            info:q.text_block
          })),
          speakingData:{ currentTeil, round:dialogRound }
        })
      })

      const data = await response.json()

      localStorage.setItem("sprechenScore", String(data.score))

      localStorage.setItem("sprechenFeedback", JSON.stringify({
        feedback: data.feedback,
        strengths: data.strengths,
        improvements: data.improvements,
        grammarMistakes: data.grammarMistakes
      }))

      onComplete()

    }catch(error){

      console.log(error)

      localStorage.setItem("sprechenScore", "0")

      localStorage.setItem("sprechenFeedback", JSON.stringify({
        feedback: "Terjadi kesalahan saat menilai speaking."
      }))

      onComplete()
    }
  }

  function formatTime(seconds:number){
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec.toString().padStart(2,"0")}`
  }

  const teilQuestions = questions.filter(q => q.teil === currentTeil)
  const currentQuestion = teilQuestions?.[0]

  useEffect(()=>{

    setDialogRound(0)
    setConversationHistory([])
    setAiMessage("")
    setAiThinking(false)
    setAiSpeaking(false)
    setDialogStarted(false)

  },[currentTeil])

  const questionType = String(currentQuestion?.question_type || "").toLowerCase().trim()

  const isDialog = questionType === "dialog"
  const isMonolog = questionType === "monolog"

  if(loading){
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-mist">
        <Loader2 className="animate-spin text-gold" size={28} />
        <p>Loading...</p>
      </div>
    )
  }

  const maxTeilForDisplay = questions.length ? Math.max(...questions.map(q => q.teil)) : 3

  return (

    <div className="max-w-4xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

        <h1 className="text-2xl md:text-4xl font-bold text-ink flex items-center gap-3">
          <Mic className="text-gold shrink-0" size={26} />
          Sprechen <span className="text-gold">{level.toUpperCase()}</span>
        </h1>

        {phase === "exam" && (
          <div className="flex items-center gap-2 text-xs md:text-sm text-mist bg-surface border border-border rounded-full px-4 py-2 shadow-sm">
            Teil {currentTeil} / {maxTeilForDisplay}
          </div>
        )}

      </div>

      {/* TIMER */}

      <div className="mb-8">

        {phase === "preparation" ? (

          <div className="bg-gold rounded-2xl p-5 flex items-center justify-center gap-2 text-ink font-bold text-lg md:text-2xl">
            <Clock size={20} />
            Preparation: {formatTime(remainingPrep)}
          </div>

        ) : (

          <div className="bg-crimson rounded-2xl p-5 flex items-center justify-center gap-2 text-paper font-bold text-lg md:text-2xl">
            <Clock size={20} />
            Pr&uuml;fung: {formatTime(remainingTeilTime)}
          </div>

        )}

      </div>

      {/* QUESTIONS */}

      <div className="space-y-6">

        {(phase === "preparation" ? questions : teilQuestions).map(question=>(

          <div
            key={question.id}
            className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm"
          >

            <h2 className="text-xl md:text-2xl font-bold mb-5 text-ink">
              Teil {question.teil}
            </h2>

            <p className="mb-6 text-base md:text-lg text-ink whitespace-pre-line">
              {question.question_text}
            </p>

            {question.text_block && (
              <div className="bg-paper border border-border rounded-2xl p-6 mb-6 whitespace-pre-line text-mist leading-relaxed">
                {question.text_block}
              </div>
            )}

            {question.image_url && (
              <img
                src={question.image_url}
                alt="prompt"
                className="w-full rounded-2xl mb-6 object-contain bg-black/[0.03] p-4"
              />
            )}

            {question.image_url_2 && (
              <img
                src={question.image_url_2}
                alt="prompt-2"
                className="w-full rounded-2xl mb-6 object-contain bg-black/[0.03] p-4"
              />
            )}

          </div>
        ))}

      </div>

      {phase === "preparation" && (
        <button
          onClick={()=>{ setPhase("exam") }}
          className="mt-8 w-full bg-gradient-to-r from-gold to-crimson text-ink py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl hover:opacity-90 transition-opacity duration-200"
        >
          End Preparation
        </button>
      )}

      {/* RECORD */}

      {phase === "exam" && !completedTeil[currentTeil] && (
        <>

          {aiThinking && isDialog && (
            <div className="bg-surface border border-border rounded-2xl p-5 mb-6 flex items-center justify-center gap-2 text-mist shadow-sm">
              <Bot size={16} className="text-gold" />
              Pr&uuml;fer denkt nach...
            </div>
          )}

          {aiMessage && (
            <div className="bg-gold rounded-2xl p-5 mb-6 flex items-center justify-center gap-2 text-ink font-semibold">
              <Volume2 size={16} />
              Pr&uuml;fer hat gesprochen
            </div>
          )}

          {/* waveform: purely decorative, mirrors existing recording/aiSpeaking state */}
          <div className="flex items-center justify-center gap-1.5 h-10 mb-2">
            {[0,1,2,3,4].map(i=>(
              <span
                key={i}
                className={`w-1.5 rounded-full ${
                  recording
                    ? "bg-crimson animate-bounce"
                    : aiSpeaking
                    ? "bg-gold animate-bounce"
                    : "bg-black/10"
                }`}
                style={{
                  height: recording || aiSpeaking ? "100%" : "25%",
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.9s"
                }}
              />
            ))}
          </div>

          <button
            disabled={aiSpeaking}
            onClick={()=>{
              if(recording){
                stopRecording()
                return
              }
              if(isDialog && dialogRound === 0 && !aiMessage){
                startDialog()
                return
              }
              startRecording()
            }}
            className="w-full bg-gradient-to-r from-gold to-crimson text-ink rounded-2xl py-4 md:py-5 font-bold text-lg md:text-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity duration-200"
          >

            {aiSpeaking ? (
              <>
                <Volume2 size={20} />
                AI is Speaking...
              </>
            ) : recording ? (
              <>
                <Square size={18} />
                {isDialog ? "Close Conversation" : "Close Conversation"}
              </>
            ) : isDialog ? (
              dialogRound === 0 ? (
                <>
                  <Mic size={20} />
                  Start Dialog
                </>
              ) : (
                <>
                  <Mic size={20} />
                  Listening...
                </>
              )
            ) : (
              <>
                <Mic size={20} />
                Start Monolog
              </>
            )}

          </button>

        </>
      )}

      {/* PREVIEW */}

      {recordings[currentTeil] && isMonolog && (
        <div className="mt-8">

          <audio
            controls
            src={recordings[currentTeil]}
            className="w-full"
          />

          <button
            onClick={nextTeil}
            className="mt-5 w-full bg-gold text-ink py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gold-soft transition-colors duration-200"
          >
            <CheckCircle2 size={18} />
            Next Teil
          </button>

        </div>
      )}

      {phase === "exam" && (
        <div className="mt-8">
          <button
            onClick={()=>{
              if(confirm("Yakin ingin lanjut ke Teil berikutnya?")){
                nextTeil()
              }
            }}
            className="w-full bg-surface hover:bg-paper border border-border text-ink py-4 rounded-2xl font-bold transition-colors duration-200 shadow-sm"
          >
            Next Teil &rarr;
          </button>
        </div>
      )}

    </div>
  )
}
