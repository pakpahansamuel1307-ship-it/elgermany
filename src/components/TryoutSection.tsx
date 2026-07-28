"use client"

import { useEffect, useState } from "react"
import {
  ChevronDown,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  BookOpen,
  Loader2,
  Award,
  Video,
} from "lucide-react"

import { supabase } from "../lib/supabase"

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

type UserAnswer = {
  level:string
  exam_set:number
  module:string
  question_id:number
  question_order?:number
  question_text:string
  user_answer:string
  correct_answer:string
  is_correct:boolean
}

type Explanation = {
  id?:number
  question_id?:number | null
  level:string
  exam_set:number
  module:string
  question_order:number
  explanation_text:string | null
  video_url?:string | null
}

const moduleLabels:{ [key:string]:string } = {
  lesen: "Lesen",
  horen: "H\u00F6ren",
  schreiben: "Schreiben",
  sprechen: "Sprechen",
  full: "Full Try Out",
}

/* question_id is the reliable match (it directly references the exact
   question that was answered). The composite-key match (level/exam_set/
   module/question_order) is kept only as a fallback for explanation rows
   uploaded before question_id existed on this table. */
function findExplanation(explanations:Explanation[], answer:UserAnswer){
  return explanations.find(exp=>
    (exp.question_id && exp.question_id === answer.question_id) ||
    (
      !exp.question_id &&
      exp.level === answer.level &&
      exp.exam_set === answer.exam_set &&
      exp.module === answer.module &&
      exp.question_order === answer.question_order
    )
  )
}

/* Renders the AI feedback block for one attempt. The parsing logic here
   (try/catch JSON.parse, detecting combined schreiben+sprechen feedback
   from a Full Tryout vs a single-module feedback blob) is unchanged from
   before - only the markup/styling around it is new. */
function AiFeedbackBlock({ rawFeedback }:{ rawFeedback:string }){

  let parsed:any
  let isFullFeedback = false

  try{
    parsed = JSON.parse(rawFeedback)
    isFullFeedback = parsed?.schreiben && parsed?.sprechen
  }catch{
    return (
      <div className="mt-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5">
        <h4 className="font-bold mb-3 flex items-center gap-2 text-paper">
          <Sparkles size={16} className="text-crimson" />
          Feedback AI
        </h4>
        <p className="text-white/50 whitespace-pre-wrap">{rawFeedback}</p>
      </div>
    )
  }

  if(isFullFeedback){

    const schreiben =
      typeof parsed.schreiben === "string" && parsed.schreiben.trim().startsWith("{")
        ? JSON.parse(parsed.schreiben)
        : { feedback: parsed.schreiben }

    const sprechen =
      typeof parsed.sprechen === "string" && parsed.sprechen.trim().startsWith("{")
        ? JSON.parse(parsed.sprechen)
        : { feedback: parsed.sprechen }

    return (
      <div className="mt-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-8">

        <div>
          <h4 className="text-lg font-bold text-crimson mb-3 flex items-center gap-2">
            <Sparkles size={16} />
            Feedback Schreiben
          </h4>
          <p className="text-paper/80 whitespace-pre-line leading-relaxed">{schreiben.feedback}</p>
        </div>

        <div>
          <h4 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
            <Sparkles size={16} />
            Feedback Sprechen
          </h4>
          <p className="text-paper/80 whitespace-pre-line leading-relaxed">{sprechen.feedback}</p>
        </div>

      </div>
    )
  }

  return (
    <div className="mt-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">

      <h4 className="font-bold text-lg mb-5 flex items-center gap-2 text-paper">
        <Sparkles size={16} className="text-crimson" />
        AI Feedback
      </h4>

      {parsed.feedback && (
        <div className="mb-6">
          <h5 className="font-bold text-crimson mb-2 text-sm uppercase tracking-wide">Feedback</h5>
          <p className="text-paper/80 leading-relaxed whitespace-pre-line">{parsed.feedback}</p>
        </div>
      )}

      {parsed.strengths?.length > 0 && (
        <div className="mb-6">
          <h5 className="font-bold text-green-400 mb-2 text-sm uppercase tracking-wide">Strengths</h5>
          <ul className="space-y-1.5">
            {parsed.strengths.map((item:string, index:number)=>(
              <li key={index} className="flex items-start gap-2 text-paper/80">
                <CheckCircle2 size={15} className="text-green-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {parsed.improvements?.length > 0 && (
        <div className="mb-6">
          <h5 className="font-bold mb-2 text-sm uppercase tracking-wide text-amber-400">Improvements</h5>
          <ul className="space-y-1.5">
            {parsed.improvements.map((item:string, index:number)=>(
              <li key={index} className="flex items-start gap-2 text-paper/80">
                <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {parsed.grammarMistakes?.length > 0 && (
        <div>
          <h5 className="font-bold text-crimson mb-2 text-sm uppercase tracking-wide">Grammar Mistakes</h5>
          <ul className="space-y-1.5">
            {parsed.grammarMistakes.map((item:string, index:number)=>(
              <li key={index} className="flex items-start gap-2 text-paper/80">
                <XCircle size={15} className="text-crimson shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}

export default function TryoutSection(){

  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [answers, setAnswers] = useState<UserAnswer[]>([])
  const [explanations, setExplanations] = useState<Explanation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{

    async function loadAttempts(){

      const { data:userData } = await supabase.auth.getUser()
      const user = userData.user

      if(!user){
        setLoading(false)
        return
      }

      const { data:userAnswers } = await supabase
        .from("user_answers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending:false })

      /* user_answers doesn't store question_order directly - look it up
         from exam_questions via question_id instead of requiring a schema
         change (which could break exam submission if that column doesn't
         already exist on user_answers in the live database). This is a
         pure read, so if anything about it doesn't match, the worst case
         is an explanation simply doesn't show - never a broken submission. */

      const questionIds = Array.from(
        new Set((userAnswers || []).map(a=>a.question_id).filter(Boolean))
      )

      let orderByQuestionId:{ [key:number]:number } = {}

      if(questionIds.length > 0){

        const { data:questionRows } = await supabase
          .from("exam_questions")
          .select("id, question_order")
          .in("id", questionIds)

        orderByQuestionId = Object.fromEntries(
          (questionRows || []).map(q=>[q.id, q.question_order])
        )
      }

      const enrichedAnswers = (userAnswers || []).map(a=>({
        ...a,
        question_order: orderByQuestionId[a.question_id] ?? a.question_order
      }))

      setAnswers(enrichedAnswers)

      const { data:attemptsData, error } = await supabase
        .from("tryout_attempts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending:false })

      if(error){
        console.log(error)
        setLoading(false)
        return
      }

      const { data:explanationData } = await supabase
        .from("tryout_explanations")
        .select("*")

      setExplanations(explanationData || [])

      /* Older Full Tryout attempts were saved without exam_set (the bug
         that was hiding every explanation for Full Tryout - now fixed at
         the source in /exam/full/[level]/[set]). For attempts saved
         before that fix, recover exam_set from the title text
         ("Goethe A1 Set 3") so their review/explanations still work. */
      const attemptsWithExamSet = (attemptsData || []).map(item=>{
        if(item.exam_set) return item
        const match = item.tryout_title?.match(/Set\s+(\d+)/i)
        return match ? { ...item, exam_set: Number(match[1]) } : item
      })

      setAttempts(attemptsWithExamSet)
      setLoading(false)
    }

    loadAttempts()

  },[])

  if(loading){
    return (
      <section className="flex flex-col items-center justify-center gap-3 py-24 text-white/50">
        <Loader2 className="animate-spin text-gold" size={26} />
        Loading...
      </section>
    )
  }

  return (

    <section>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-paper flex items-center gap-3">
          <BookOpen className="text-crimson" size={28} />
          Riwayat Try Out
        </h1>
        <p className="text-white/50 mt-2">
          Review hasil dan pembahasan try out kamu.
        </p>
      </div>

      {attempts.length === 0 && (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 text-center text-white/50">
          Belum ada riwayat try out.
        </div>
      )}

      <div className="space-y-5">

        {attempts.map((item, index)=>{

          const relevantAnswers = answers.filter(answer=>
            answer.level === item.level &&
            answer.exam_set === item.exam_set &&
            (item.module_type === "full" || answer.module === item.module_type)
          )

          /* Group by module so a Full Tryout shows Lesen / H\u00F6ren as their
             own clearly-numbered sections instead of one long mixed list. */
          const answersByModule = relevantAnswers.reduce((acc, answer)=>{
            if(!acc[answer.module]) acc[answer.module] = []
            acc[answer.module].push(answer)
            return acc
          }, {} as { [key:string]:UserAnswer[] })

          const explanationCount = relevantAnswers.filter(answer=>
            findExplanation(explanations, answer)
          ).length

          return (

            <details
              key={item.id ?? index}
              className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 md:p-8"
            >

              <summary className="cursor-pointer list-none">

                <div className="flex flex-wrap items-center justify-between gap-6">

                  <div className="flex items-start gap-4">

                    <div className="w-11 h-11 rounded-xl bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Award size={20} className="text-ink" />
                    </div>

                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-paper">
                        {item.tryout_title}
                      </h2>
                      <p className="text-white/40 text-sm mt-1">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-4 md:gap-6">

                    <div className="text-right">
                      <p className="text-white/40 text-xs uppercase tracking-wide">Final Score</p>
                      <h2 className="text-3xl md:text-4xl font-bold text-crimson">
                        {item.score}
                      </h2>
                    </div>

                    {explanationCount > 0 ? (
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-ink bg-gold px-3 py-2 rounded-full whitespace-nowrap">
                        <FileText size={13} />
                        {explanationCount} Pembahasan
                      </div>
                    ) : null}

                    <ChevronDown
                      size={20}
                      className="text-white/40 transition-transform duration-300 group-open:rotate-180 shrink-0"
                    />

                  </div>

                </div>

              </summary>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-8">

                {item.ai_feedback && <AiFeedbackBlock rawFeedback={item.ai_feedback} />}

                {Object.entries(answersByModule).map(([moduleType, moduleAnswers])=>(

                  <div key={moduleType}>

                    <h3 className="text-lg font-bold text-paper mb-4 flex items-center gap-2">
                      {item.module_type === "full" && (
                        <span className="text-xs font-semibold text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                          {moduleLabels[moduleType] || moduleType}
                        </span>
                      )}
                      Review Jawaban
                    </h3>

                    <div className="space-y-4">

                      {moduleAnswers
                        .slice()
                        .sort((a,b)=> (a.question_order || 0) - (b.question_order || 0))
                        .map((answer, idx)=>{

                        const matchedExplanation = findExplanation(explanations, answer)

                        return (

                          <div
                            key={idx}
                            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5"
                          >

                            <p className="font-semibold text-paper mb-4">
                              {answer.question_order || idx + 1}. {answer.question_text}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">

                              <div>
                                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Your Answer</p>
                                <p className="text-paper flex items-center gap-1.5">
                                  {answer.is_correct
                                    ? <CheckCircle2 size={15} className="text-green-400 shrink-0" />
                                    : <XCircle size={15} className="text-crimson shrink-0" />}
                                  {answer.user_answer || <span className="text-white/40 italic">(kosong)</span>}
                                </p>
                              </div>

                              <div>
                                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Correct Answer</p>
                                <p className="font-bold text-green-400">
                                  {answer.correct_answer}
                                </p>
                              </div>

                            </div>

                            {matchedExplanation?.explanation_text && (
                              <div className="mt-4 bg-gold/10 border border-gold/25 rounded-xl p-4">
                                <h4 className="font-bold mb-2 text-sm flex items-center gap-1.5 text-amber-400">
                                  <FileText size={14} />
                                  Pembahasan
                                </h4>
                                <p className="text-paper/80 whitespace-pre-wrap text-sm leading-relaxed">
                                  {matchedExplanation.explanation_text}
                                </p>
                              </div>
                            )}

                            {matchedExplanation?.video_url && (
                              <a
                                href={matchedExplanation.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-2 bg-crimson text-paper text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-crimson/90 transition-colors duration-200"
                              >
                                <Video size={15} />
                                Tonton Video Pembahasan
                              </a>
                            )}

                          </div>
                        )
                      })}

                    </div>

                  </div>
                ))}

              </div>

            </details>
          )
        })}

      </div>

    </section>
  )
}
