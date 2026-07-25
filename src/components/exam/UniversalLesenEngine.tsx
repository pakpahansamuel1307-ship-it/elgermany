"use client"

import { useEffect, useState } from "react"
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
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

  text_block_image:string
  text_block_image_2:string
  text_block_image_3:string
  text_block_image_4:string
  text_block_image_5:string

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
  onComplete:()=>void
}

export default function UniversalLesenEngine({ level, examSet, onComplete }:Props){

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number,string>>({})

  const storageKey = `lesen_${level}_${examSet}`
  const timerKey = `lesen_timer_${level}_${examSet}`

  const timerMap:{ [key:string]:number } = {
    a1: 20 * 60,
    a2: 30 * 60,
    b1: 65 * 60,
    b2: 65 * 60
  }

  const [remainingTime, setRemainingTime] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timerReady, setTimerReady] = useState(false)

  useEffect(()=>{

    async function loadQuestions(){

      const { data, error } = await supabase
        .from("exam_questions")
        .select("*")
        .eq("level", level)
        .eq("module", "lesen")
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

    if(savedTimer && Number(savedTimer) > 0){
      setRemainingTime(Number(savedTimer))
    }else{
      setRemainingTime(timerMap[level] || 1200)
    }

    setTimerReady(true)

    /* RESTORE ANSWERS */

    const saved = localStorage.getItem(storageKey)

    if(saved){
      setAnswers(JSON.parse(saved))
    }

  },[level, examSet])

  useEffect(()=>{
    if(!timerReady) return

    localStorage.setItem(timerKey, String(remainingTime))

  },[remainingTime, timerReady])

  useEffect(()=>{

    if(loading) return
    if(!timerReady) return
    if(remainingTime <= 0) return

    const timer = setInterval(()=>{
      setRemainingTime(prev=>{
        if(prev <= 1){
          clearInterval(timer)
          submitExam()
          return 0
        }
        return prev - 1
      })
    },1000)

    return ()=>{ clearInterval(timer) }

  },[loading, timerReady])

  function handleAnswer(id:number, value:string){

    const updated = { ...answers, [id]:value }

    setAnswers(updated)

    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  function submitExam(){

    let score = 0

    questions.forEach(q=>{
      if(answers[q.id] === q.correct_answer){
        score++
      }
    })

    const finalScore = Math.round((score / questions.length) * 100)

    localStorage.setItem("lesenScore", String(finalScore))
    localStorage.setItem("moduleScore", String(finalScore))

    async function saveAnswers(){

      const { data:userData } = await supabase.auth.getUser()

      const user = userData.user

      if(!user) return

      const rows = questions.map(q=>({
        user_id: user.id,
        level,
        module: "lesen",
        exam_set: examSet,
        question_id: q.id,
        question_text: q.question_text,
        user_answer: answers[q.id] || "",
        correct_answer: q.correct_answer,
        is_correct: answers[q.id] === q.correct_answer
      }))

      await supabase.from("user_answers").insert(rows)
    }

    saveAnswers()

    localStorage.removeItem(storageKey)
    localStorage.removeItem(timerKey)

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

  const grouped = questions.reduce((acc, q)=>{
    if(!acc[q.teil]){
      acc[q.teil] = []
    }
    acc[q.teil].push(q)
    return acc
  }, {} as Record<number, Question[]>)

  const answeredCount = questions.filter(q => answers[q.id]).length

  return (

    <div className="max-w-4xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

        <h1 className="text-2xl md:text-4xl font-bold text-ink flex items-center gap-3">
          <BookOpen className="text-gold shrink-0" size={26} />
          Lesen <span className="text-gold">{level.toUpperCase()}</span>
        </h1>

        <div className="flex items-center gap-2 text-xs md:text-sm text-mist bg-surface border border-border rounded-full px-4 py-2 shadow-sm">
          <CheckCircle2 size={14} className="text-gold" />
          {answeredCount} / {questions.length} answered
        </div>

      </div>

      {/* TIMER */}

      <div className="bg-gold rounded-2xl p-5 mb-6 flex items-center justify-between text-ink">

        <div className="flex items-center gap-2 font-bold text-sm md:text-base">
          <Clock size={16} />
          Time Remaining
        </div>

        <p className="font-bold text-xl md:text-2xl tabular-nums">
          {Math.floor((remainingTime ?? 0) / 60)}:{String((remainingTime ?? 0) % 60).padStart(2,"0")}
        </p>

      </div>

      {/* QUESTION NAVIGATOR */}

      <div className="flex flex-wrap gap-2 mb-10 bg-surface border border-border rounded-2xl p-4 shadow-sm">

        {questions.map((q, index) => {
          const isAnswered = Boolean(answers[q.id])
          return (
            <button
              key={q.id}
              onClick={() => {
                document.getElementById(`lesen-q-${q.id}`)?.scrollIntoView({ behavior:"smooth", block:"center" })
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

      {Object.entries(grouped).map(([teil, teilQuestions])=>(

        <div key={teil} className="mb-14">

          <h2 className="text-xl md:text-2xl font-bold mb-6 text-ink">
            Teil {teil}
          </h2>

          {[
            teilQuestions[0]?.text_block_image,
            teilQuestions[0]?.text_block_image_2,
            teilQuestions[0]?.text_block_image_3,
            teilQuestions[0]?.text_block_image_4,
            teilQuestions[0]?.text_block_image_5
          ]
          .filter(Boolean)
          .map((image, index)=>(
            <img
              key={index}
              src={image}
              alt={`text-block-${index}`}
              className="w-full rounded-2xl mb-6 object-contain bg-black/[0.03] p-4"
            />
          ))}

          {teilQuestions[0]?.text_block && (
            <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
              <p className="whitespace-pre-line text-base md:text-lg leading-loose text-mist max-w-[68ch]">
                {teilQuestions[0].text_block}
              </p>
            </div>
          )}

          <div className="space-y-6">

            {teilQuestions.map(q=>{

              const options = [
                { key:"A", text:q.option_a, image:q.option_a_image },
                { key:"B", text:q.option_b, image:q.option_b_image },
                { key:"C", text:q.option_c, image:q.option_c_image },
                { key:"D", text:q.option_d, image:q.option_d_image },
                { key:"E", text:q.option_e, image:q.option_e_image },
                { key:"F", text:q.option_f, image:q.option_f_image },
                { key:"G", text:q.option_g, image:q.option_g_image },
                { key:"H", text:q.option_h, image:q.option_h_image },
                { key:"I", text:q.option_i, image:q.option_i_image },
                { key:"J", text:q.option_j, image:q.option_j_image },
                { key:"0", text:q.option_0, image:q.option_0_image },
              ].filter(option => option.text || option.image)

              return (

                <div
                  id={`lesen-q-${q.id}`}
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

                  {q.question_type === "multiple_choice" && (

                    <div className="space-y-3">
                      {options.map(option=>{
                        const selected = answers[q.id] === option.key
                        return (
                          <button
                            key={option.key}
                            onClick={()=>{ handleAnswer(q.id, option.key) }}
                            className={`w-full text-left p-4 rounded-xl flex items-start gap-3 transition-colors duration-200 ${
                              selected
                                ? "bg-gold text-ink"
                                : "bg-black/[0.04] text-ink hover:bg-black/[0.08]"
                            }`}
                          >
                            {selected ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <Circle size={16} className="shrink-0 mt-0.5 opacity-40" />}

                            <span>
                              {option.image && (
                                <img
                                  src={option.image}
                                  alt="option"
                                  className="w-full max-h-[250px] object-contain rounded-xl bg-black/[0.03] mb-4"
                                />
                              )}
                              <span className="font-bold">{option.key}.</span>{" "}
                              {option.text}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {q.question_type === "matching_ads" && (

                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {options.map(option=>{
                        const selected = answers[q.id] === option.key
                        return (
                          <button
                            key={option.key}
                            onClick={()=>{ handleAnswer(q.id, option.key) }}
                            className={`p-4 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors duration-200 ${
                              selected
                                ? "bg-gold text-ink"
                                : "bg-black/[0.04] text-ink hover:bg-black/[0.08]"
                            }`}
                          >
                            {selected && <CheckCircle2 size={14} />}
                            {option.key}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {q.question_type === "true_false" && (

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key:"true", text:"richtig" },
                        { key:"false", text:"falsch" },
                      ].map(option=>{
                        const selected = answers[q.id] === option.key
                        return (
                          <button
                            key={option.key}
                            onClick={()=>{ handleAnswer(q.id, option.key) }}
                            className={`p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors duration-200 ${
                              selected
                                ? "bg-gold text-ink"
                                : "bg-black/[0.04] text-ink hover:bg-black/[0.08]"
                            }`}
                          >
                            {selected ? <CheckCircle2 size={16} /> : <Circle size={16} className="opacity-40" />}
                            {option.text}
                          </button>
                        )
                      })}
                    </div>
                  )}

                </div>
              )
            })}

          </div>

        </div>
      ))}

      <button
        onClick={submitExam}
        className="w-full bg-gradient-to-r from-gold to-crimson text-ink font-bold py-4 md:py-5 rounded-2xl text-lg md:text-xl hover:opacity-90 transition-opacity duration-200"
      >
        Submit Lesen
      </button>

    </div>
  )
}
