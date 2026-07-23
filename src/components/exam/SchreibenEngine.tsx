"use client"

import { useEffect, useState } from "react"
import {
  PenLine,
  Clock,
  Type,
  AlignLeft,
  Loader2,
} from "lucide-react"

import { supabase } from "../../lib/supabase"

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
  onComplete:()=>void
}

export default function SchreibenEngine({ level, examSet, onComplete }:Props){

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number,string>>({})

  const storageKey = `schreiben_${level}_${examSet}`
  const timerKey = `schreiben_timer_${level}_${examSet}`

  const timerMap:{ [key:string]:number } = {
    a1:20 * 60,
    a2:30 * 60,
    b1:60 * 60,
    b2:75 * 60
  }

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [remainingTime, setRemainingTime] = useState(timerMap[level] || 1200)

  useEffect(()=>{

    async function loadQuestions(){

      const { data, error } = await supabase
        .from("exam_questions")
        .select("*")
        .eq("level", level)
        .eq("module", "schreiben")
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

    /* RESTORE TIMER */

    const savedTimer = localStorage.getItem(timerKey)

    if(savedTimer){
      setRemainingTime(Number(savedTimer))
    }

    /* RESTORE ANSWERS */

    const saved = localStorage.getItem(storageKey)

    if(saved){
      setAnswers(JSON.parse(saved))
    }

  },[level, examSet])

  useEffect(()=>{

    localStorage.setItem(timerKey, String(remainingTime))

  },[remainingTime])

  useEffect(()=>{

    if(loading) return
    if(submitting) return

    if(remainingTime <= 0){
      submitExam()
      return
    }

    const timer = setInterval(()=>{
      setRemainingTime(prev => Math.max(prev - 1, 0))
    },1000)

    return ()=>{ clearInterval(timer) }

  },[loading, submitting])

  function handleChange(id:number, value:string){

    const updated = { ...answers, [id]:value }

    setAnswers(updated)

    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  async function submitExam(){

    try{

      setSubmitting(true)

      const answerList = questions.map(q => answers[q.id] || "")
      const questionList = questions.map(q => q.question_text)

      const aiResponse = await fetch("/api/ai-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          module: "schreiben",
          answers: answerList,
          questions: questionList
        })
      })

      const aiResult = await aiResponse.json()

      const score = typeof aiResult.score === "number" ? aiResult.score : 0
      const feedback = aiResult.feedback ?? "Feedback belum tersedia."

      localStorage.setItem("schreibenScore", String(score))
      localStorage.setItem("moduleScore", String(score))
      localStorage.setItem("schreibenFeedback", feedback)

      setSubmitting(false)

      localStorage.removeItem(storageKey)
      localStorage.removeItem(timerKey)

      onComplete()

    }catch(error){

      console.log(error)
      alert("AI gagal memproses jawaban.")
      setSubmitting(false)
    }
  }

  if(loading){
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-mist">
        <Loader2 className="animate-spin text-gold" size={28} />
        <p>Loading...</p>
      </div>
    )
  }

  return (

    <div className="max-w-4xl mx-auto">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-2">
        <PenLine className="text-gold shrink-0" size={26} />
        <h1 className="text-2xl md:text-4xl font-bold text-paper">
          Schreiben <span className="text-gold">{level.toUpperCase()}</span>
        </h1>
      </div>

      <p className="text-mist mb-8 ml-[38px]">
        Answer all questions in German.
      </p>

      {/* TIMER */}

      <div className="bg-gold rounded-2xl p-5 mb-10 flex items-center justify-between text-ink">

        <div className="flex items-center gap-2 font-bold text-sm md:text-base">
          <Clock size={16} />
          Time Remaining
        </div>

        <p className="font-bold text-xl md:text-2xl tabular-nums">
          {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2,"0")}
        </p>

      </div>

      <div className="space-y-8">

        {questions.map(question=>{

          const value = answers[question.id] || ""

          const wordCount = value.trim().split(" ").filter(word => word.length > 0).length
          const charCount = value.length

          return (

            <div
              key={question.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
            >

              <h2 className="text-xl md:text-2xl font-bold mb-5 text-paper">
                Teil {question.teil}
              </h2>

              {question.text_block_image && (
                <img
                  src={question.text_block_image}
                  alt="stimulus"
                  className="w-full rounded-2xl mb-6 object-contain bg-white/5 p-4"
                />
              )}

              {question.text_block && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                  <p className="whitespace-pre-line text-base md:text-lg text-mist leading-relaxed">
                    {question.text_block}
                  </p>
                </div>
              )}

              <p className="mb-5 text-base md:text-lg text-paper whitespace-pre-line">
                {question.question_text}
              </p>

              <textarea
                value={value}
                onChange={(e)=> handleChange(question.id, e.target.value)}
                placeholder="Tulis jawabanmu di sini..."
                className="w-full min-h-[240px] bg-surface border border-white/10 rounded-2xl p-6 outline-none focus:border-gold/60 resize-none text-paper text-base leading-relaxed transition-colors duration-200"
              />

              <div className="mt-4 flex items-center gap-5 text-xs md:text-sm text-mist">

                <span className="flex items-center gap-1.5">
                  <Type size={14} />
                  Word Count: {wordCount}
                </span>

                <span className="flex items-center gap-1.5">
                  <AlignLeft size={14} />
                  Characters: {charCount}
                </span>

              </div>

            </div>
          )
        })}

      </div>

      <button
        onClick={submitExam}
        disabled={submitting}
        className="mt-10 w-full bg-gradient-to-r from-gold to-crimson text-ink font-bold py-4 md:py-5 rounded-2xl text-lg md:text-xl hover:opacity-90 transition-opacity duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Memproses..." : "Submit Schreiben"}
      </button>

    </div>
  )
}
