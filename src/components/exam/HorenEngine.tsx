"use client"

import { useEffect, useRef, useState } from "react"
import {
  Headphones,
  Volume2,
  Clock,
  CheckCircle2,
  Circle,
  Lock,
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
  onComplete:()=>void
}

export default function HorenEngine({ level, examSet, onComplete }:Props){

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number,string>>({})

  const storageKey = `horen_${level}_${examSet}`
  const stageKey = `horen_stage_${level}_${examSet}`
  const audioTimeKey = `horen_audio_time_${level}_${examSet}`

  const [loading, setLoading] = useState(true)
  const [stage, setStage] = useState<"preparation" | "listening" | "review">("preparation")
  const [prepTime, setPrepTime] = useState(60)
  const [reviewTime, setReviewTime] = useState(300)
  const [restored, setRestored] = useState(false)

  /* Presentation-only: mirrors the already-playing audio element so we can
     draw a (read-only, non-seekable) progress indicator. Does not affect
     playback, timing, or the single-play exam rule in any way. */
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(()=>{

    async function loadQuestions(){

      const { data, error } = await supabase
        .from("exam_questions")
        .select("*")
        .eq("level", level)
        .eq("module", "horen")
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

    /* RESTORE ANSWERS */

    const saved = localStorage.getItem(storageKey)

    if(saved){
      setAnswers(JSON.parse(saved))
    }

    /* RESTORE STAGE */

    const savedStage = localStorage.getItem(stageKey)

    if(savedStage){
      const parsed = JSON.parse(savedStage)
      setStage(parsed.stage ?? "preparation")
      setPrepTime(parsed.prepTime ?? 60)
      setReviewTime(parsed.reviewTime ?? 300)
    }

    setRestored(true)

    if(!savedStage){
      setRestored(true)
    }

  },[level, examSet])

  /* 1 MENIT PERSIAPAN */

  useEffect(()=>{
    if(stage !== "preparation" || prepTime <= 0) return

    const timer = setInterval(()=>{
      setPrepTime(prev=>{
        if(prev <= 1){
          clearInterval(timer)
          setStage("listening")
          return 0
        }
        return Math.max(prev - 1, 0)
      })
    },1000)

    return ()=>{ clearInterval(timer) }

  },[stage])

  /* AUTOPLAY AUDIO */

  useEffect(()=>{

    if(stage !== "listening" || !questions.length) return

    const firstAudio = questions.find(q=>q.audio_url)

    if(!firstAudio) return

    const audio = new Audio(firstAudio.audio_url)

    const savedAudioTime = Number(localStorage.getItem(audioTimeKey) || "0")

    audio.currentTime = savedAudioTime
    setAudioCurrentTime(savedAudioTime)

    audioRef.current = audio

    const saveInternal = setInterval(()=>{
      localStorage.setItem(audioTimeKey, String(audio.currentTime))
    },1000)

    /* Display-only listeners: track progress for the read-only progress bar. */
    audio.onloadedmetadata = ()=>{
      setAudioDuration(audio.duration || 0)
    }
    audio.ontimeupdate = ()=>{
      setAudioCurrentTime(audio.currentTime)
    }

    audio.play().catch(()=>{
      console.log("Autoplay blocked")
    })

    audio.onended = ()=>{
      clearInterval(saveInternal)
      localStorage.removeItem(audioTimeKey)
      setStage("review")
    }

  },[stage, questions])

  /* SAVE STAGE */

  useEffect(()=>{
    if(!restored) return

    localStorage.setItem(stageKey, JSON.stringify({ stage, prepTime, reviewTime }))

  },[stage, prepTime, reviewTime, restored])

  /* REVIEW 5 MENIT */

  useEffect(()=>{
    if(stage !== "review") return

    const timer = setInterval(()=>{
      setReviewTime(prev=>{
        if(prev <= 1){
          clearInterval(timer)
          submitExam()
          return 0
        }
        return prev - 1
      })
    },1000)

    return ()=>{ clearInterval(timer) }

  },[stage])

  function handleAnswer(id:number, value:string){

    const updated = { ...answers, [id]:value }

    setAnswers(updated)

    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  async function submitExam(){

    let score = 0

    questions.forEach(q=>{
      if(answers[q.id] === q.correct_answer){
        score++
      }
    })

    const finalScore = Math.round((score / questions.length) * 100)

    localStorage.setItem("horenScore", String(finalScore))
    localStorage.setItem("moduleScore", String(finalScore))

    async function saveAnswers(){

      const { data:userData } = await supabase.auth.getUser()

      const user = userData.user

      if(!user) return

      const rows = questions.map(q=>({
        user_id: user.id,
        level,
        module: "horen",
        exam_set: examSet,
        question_id: q.id,
        question_text: q.question_text,
        user_answer: answers[q.id] || "",
        correct_answer: q.correct_answer,
        is_correct: answers[q.id] === q.correct_answer
      }))

      await supabase.from("user_answers").insert(rows)
    }

    await saveAnswers()

    localStorage.removeItem(storageKey)
    localStorage.removeItem(stageKey)
    localStorage.removeItem(audioTimeKey)

    onComplete()
  }

  if(loading){
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-mist">
        <Loader2 className="animate-spin text-gold" size={28} />
        <p>Loading...</p>
      </div>
    )
  }

  /* PREPARATION SCREEN */

  if(stage === "preparation"){
    return (
      <div className="text-center py-20 md:py-28 px-6">

        <div className="w-16 h-16 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-8">
          <Headphones className="text-gold" size={28} />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink">
          Listening Preparation
        </h1>

        <p className="text-base md:text-xl text-mist max-w-2xl mx-auto mt-6 leading-relaxed">
          Audio will be played automatically.
          <br />
          Audio can only be played once.
          <br />
          Put on your headset and listen carefully.
        </p>

        <div className="text-6xl md:text-7xl font-bold text-gold mt-12 tabular-nums">
          {prepTime}
        </div>

      </div>
    )
  }

  const totalQuestions = questions.length
  const answeredCount = questions.filter(q => answers[q.id]).length
  const progressPct = audioDuration > 0
    ? Math.min(100, (audioCurrentTime / audioDuration) * 100)
    : 0

  return (

    <div className="px-4 sm:px-6 md:px-10 py-8 md:py-12 max-w-4xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

        <h1 className="text-2xl md:text-4xl font-bold text-ink">
          H&ouml;ren <span className="text-gold">{level.toUpperCase()}</span>
        </h1>

        <div className="flex items-center gap-2 text-xs md:text-sm text-mist bg-surface border border-border rounded-full px-4 py-2 shadow-sm">
          <CheckCircle2 size={14} className="text-gold" />
          {answeredCount} / {totalQuestions} answered
        </div>

      </div>

      {/* LISTENING STATUS */}

      {stage === "listening" && (

        <div className="bg-crimson/10 border border-crimson/40 rounded-2xl p-5 mb-6">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-9 h-9 rounded-xl bg-crimson/20 flex items-center justify-center shrink-0">
              <Volume2 size={16} className="text-crimson animate-pulse" />
            </div>

            <p className="font-semibold text-ink text-sm md:text-base">
              Audio is playing. Listen carefully.
            </p>

          </div>

          {/* read-only progress indicator, no seek/pause control */}

          <div className="h-1.5 rounded-full bg-black/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-crimson transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-mist">
            <span className="tabular-nums">
              {Math.floor(audioCurrentTime / 60)}:{String(Math.floor(audioCurrentTime % 60)).padStart(2,"0")}
            </span>
            <span className="flex items-center gap-1.5">
              <Lock size={11} />
              Plays once, cannot be replayed
            </span>
          </div>

        </div>
      )}

      {/* REVIEW STATUS */}

      {stage === "review" && (

        <div className="bg-gold rounded-2xl p-5 mb-6 flex items-center justify-between text-ink">

          <div className="flex items-center gap-2 font-bold text-sm md:text-base">
            <Clock size={16} />
            Time to review answers
          </div>

          <p className="font-bold text-xl md:text-2xl tabular-nums">
            {Math.floor(reviewTime / 60)}:{String(reviewTime % 60).padStart(2,"0")}
          </p>

        </div>
      )}

      {/* QUESTION NAVIGATOR */}

      <div className="flex flex-wrap gap-2 mb-10 bg-surface border border-border rounded-2xl p-4 shadow-sm">

        {questions.map((q, index) => {
          const isAnswered = Boolean(answers[q.id])
          return (
            <button
              key={q.id}
              onClick={() => {
                document.getElementById(`horen-q-${q.id}`)?.scrollIntoView({ behavior:"smooth", block:"center" })
              }}
              aria-label={`Go to question ${index + 1}`}
              className={`w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors duration-200 ${
                isAnswered
                  ? "bg-gold text-ink"
                  : "bg-black/[0.05] text-mist hover:bg-black/[0.1]"
              }`}
            >
              {index + 1}
            </button>
          )
        })}

      </div>

      {/* QUESTIONS BY TEIL */}

      {[1,2,3,4].map(teil=>{

        const teilQuestions = questions.filter(q=>q.teil === teil)

        if(!teilQuestions.length) return null

        return (

          <div key={teil} className="mb-14">

            <h2 className="text-xl md:text-2xl font-bold mb-6 text-ink">
              Teil {teil}
            </h2>

            {teilQuestions[0]?.text_block && (
              <div className="bg-surface border border-border rounded-2xl p-6 mb-6 whitespace-pre-line text-mist leading-relaxed shadow-sm">
                {teilQuestions[0].text_block}
              </div>
            )}

            <div className="space-y-5">

              {teilQuestions.map(q=>{

                const options = [
                  { key:"A", text:q.option_a, image:q.option_a_image },
                  { key:"B", text:q.option_b, image:q.option_b_image },
                  { key:"C", text:q.option_c, image:q.option_c_image },
                ]

                return (

                  <div
                    id={`horen-q-${q.id}`}
                    key={q.id}
                    className="bg-surface border border-border rounded-2xl p-5 md:p-6 scroll-mt-24 shadow-sm"
                  >

                    <div className="flex items-start gap-3 mb-5">

                      <span className="shrink-0 w-7 h-7 rounded-full bg-black/[0.06] text-ink text-sm font-bold flex items-center justify-center">
                        {q.question_order}
                      </span>

                      <p className="text-base md:text-lg text-ink whitespace-pre-line pt-0.5">
                        {q.question_text}
                      </p>

                    </div>

                    <div className="space-y-3">

                      {q.question_type === "true_false" && (
                        <div className="grid grid-cols-2 gap-3">
                          {["richtig","falsch"].map(option=>{
                            const selected = answers[q.id] === option
                            return (
                              <button
                                key={option}
                                onClick={()=>{ handleAnswer(q.id, option) }}
                                className={`w-full flex items-center justify-center gap-2 text-center p-4 rounded-xl font-semibold capitalize transition-colors duration-200 ${
                                  selected
                                    ? "bg-gold text-ink"
                                    : "bg-black/[0.05] text-ink hover:bg-black/[0.1]"
                                }`}
                              >
                                {selected ? <CheckCircle2 size={16} /> : <Circle size={16} className="opacity-50" />}
                                {option}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {q.question_type === "multiple_choice" && (
                        <div className="grid md:grid-cols-3 gap-4">
                          {options.map(option=>{
                            const selected = answers[q.id] === option.key
                            return (
                              <button
                                key={option.key}
                                onClick={()=>{ handleAnswer(q.id, option.key) }}
                                className={`text-left rounded-2xl overflow-hidden border p-4 transition-colors duration-200 ${
                                  selected
                                    ? "bg-gold text-ink border-gold"
                                    : "bg-black/[0.03] border-border text-ink hover:bg-black/[0.06]"
                                }`}
                              >
                                {option.image && (
                                  <img
                                    src={option.image}
                                    alt="option"
                                    className="w-full h-[220px] object-contain rounded-xl bg-black/[0.03] mb-4"
                                  />
                                )}

                                <p className="font-bold flex items-center gap-2">
                                  {selected ? <CheckCircle2 size={16} /> : <Circle size={16} className="opacity-40" />}
                                  {option.key}
                                </p>

                                {option.text && (
                                  <p className="mt-2 text-sm">
                                    {option.text}
                                  </p>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}

                    </div>

                  </div>
                )
              })}

            </div>

          </div>
        )
      })}

      <button
        onClick={submitExam}
        className="mt-4 w-full bg-gradient-to-r from-gold to-crimson text-ink font-bold py-4 md:py-5 rounded-2xl text-lg md:text-xl hover:opacity-90 transition-opacity duration-200"
      >
        Next Module
      </button>

    </div>
  )
}
