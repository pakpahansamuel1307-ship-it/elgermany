"use client"

import { useEffect, useState } from "react"
import {
  Upload,
  Video,
  FileText,
  CheckCircle2,
  Loader2,
  ListChecks,
} from "lucide-react"

import { supabase } from "../../../lib/supabase"

type QuestionOption = {
  id:number
  question_order:number
  question_text:string
}

type ExplanationRow = {
  id:number
  question_order:number
  explanation_text:string | null
  video_url:string | null
}

export default function AdminExplanationPage(){

  const [level, setLevel] = useState("a1")
  const [module, setModule] = useState("lesen")
  const [examSet, setExamSet] = useState(1)

  const [questions, setQuestions] = useState<QuestionOption[]>([])
  const [questionId, setQuestionId] = useState<number | "">("")
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  const [explanationText, setExplanationText] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [existing, setExisting] = useState<ExplanationRow[]>([])

  /* Load the actual questions for the chosen level/module/exam_set so the
     admin picks the exact question from a list instead of typing a raw
     question number by hand - this is what makes matching reliable on the
     display side, since we capture the real question_id straight from
     exam_questions instead of risking a typo. */
  useEffect(()=>{

    async function loadQuestions(){

      setLoadingQuestions(true)
      setQuestionId("")

      const { data } = await supabase
        .from("exam_questions")
        .select("id, question_order, question_text")
        .eq("level", level)
        .eq("module", module)
        .eq("exam_set", examSet)
        .order("question_order", { ascending:true })

      setQuestions(data || [])
      setLoadingQuestions(false)
    }

    loadQuestions()

  },[level, module, examSet])

  useEffect(()=>{

    async function loadExisting(){

      const { data } = await supabase
        .from("tryout_explanations")
        .select("id, question_order, explanation_text, video_url")
        .eq("level", level)
        .eq("module", module)
        .eq("exam_set", examSet)
        .order("question_order", { ascending:true })

      setExisting(data || [])
    }

    loadExisting()

  },[level, module, examSet, submitting])

  async function submit(){

    if(!questionId){
      alert("Pilih soal terlebih dahulu.")
      return
    }

    if(!explanationText.trim() && !videoUrl.trim()){
      alert("Isi pembahasan teks atau link video (minimal salah satu).")
      return
    }

    const selectedQuestion = questions.find(q=>q.id === questionId)

    setSubmitting(true)

    const { error } = await supabase
      .from("tryout_explanations")
      .insert({
        level,
        exam_set: examSet,
        module,
        question_id: questionId,
        question_order: selectedQuestion?.question_order ?? null,
        explanation_text: explanationText.trim() || null,
        video_url: videoUrl.trim() || null,
      })

    setSubmitting(false)

    if(error){
      alert(error.message)
      return
    }

    setExplanationText("")
    setVideoUrl("")
    setQuestionId("")
    alert("Pembahasan berhasil diupload.")
  }

  return (

    <main className="min-h-screen bg-paper text-ink p-6 md:p-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
          <Upload className="text-crimson" size={30} />
          Upload Pembahasan
        </h1>

        <p className="text-mist mb-10">
          Pilih soal secara langsung dari daftar supaya pembahasan pasti
          nyambung ke soal yang benar.
        </p>

        <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-5">

          <div className="grid sm:grid-cols-2 gap-5">

            <div>
              <label className="text-sm font-semibold text-mist mb-2 block">Level</label>
              <select
                value={level}
                onChange={(e)=>setLevel(e.target.value)}
                className="w-full bg-paper border border-border p-4 rounded-2xl text-ink"
              >
                <option value="a1">A1</option>
                <option value="a2">A2</option>
                <option value="b1">B1</option>
                <option value="b2">B2</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-mist mb-2 block">Modul</label>
              <select
                value={module}
                onChange={(e)=>setModule(e.target.value)}
                className="w-full bg-paper border border-border p-4 rounded-2xl text-ink"
              >
                <option value="lesen">Lesen</option>
                <option value="horen">H&ouml;ren</option>
                <option value="schreiben">Schreiben</option>
                <option value="sprechen">Sprechen</option>
              </select>
            </div>

          </div>

          <div>
            <label className="text-sm font-semibold text-mist mb-2 block">Exam Set</label>
            <input
              type="number"
              min={1}
              value={examSet}
              onChange={(e)=>setExamSet(Number(e.target.value) || 1)}
              className="w-full bg-paper border border-border p-4 rounded-2xl text-ink"
              placeholder="Exam Set"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-mist mb-2 block">Pilih Soal</label>

            {loadingQuestions ? (
              <div className="flex items-center gap-2 text-mist p-4">
                <Loader2 className="animate-spin" size={16} />
                Memuat soal...
              </div>
            ) : questions.length === 0 ? (
              <div className="text-mist p-4 bg-paper border border-border rounded-2xl text-sm">
                Tidak ada soal untuk kombinasi level/modul/exam set ini.
              </div>
            ) : (
              <select
                value={questionId}
                onChange={(e)=>setQuestionId(Number(e.target.value))}
                className="w-full bg-paper border border-border p-4 rounded-2xl text-ink"
              >
                <option value="">-- Pilih nomor soal --</option>
                {questions.map(q=>(
                  <option key={q.id} value={q.id}>
                    Soal {q.question_order}: {q.question_text.slice(0, 60)}
                    {q.question_text.length > 60 ? "..." : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-mist mb-2 flex items-center gap-1.5">
              <FileText size={14} />
              Pembahasan Teks (opsional)
            </label>
            <textarea
              value={explanationText}
              onChange={(e)=>setExplanationText(e.target.value)}
              placeholder="Tulis pembahasan di sini..."
              className="w-full min-h-[180px] bg-paper border border-border p-5 rounded-3xl text-ink resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-mist mb-2 flex items-center gap-1.5">
              <Video size={14} />
              Link Video Pembahasan (opsional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e)=>setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/... atau link Google Drive"
              className="w-full bg-paper border border-border p-4 rounded-2xl text-ink"
            />
          </div>

          <button
            onClick={submit}
            disabled={submitting}
            className="w-full bg-gradient-to-r from-gold to-crimson text-ink py-4 md:py-5 rounded-3xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Mengupload...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Pembahasan
              </>
            )}
          </button>

        </div>

        {/* EXISTING FOR THIS FILTER */}

        <div className="mt-8">

          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-ink">
            <ListChecks size={18} className="text-crimson" />
            Pembahasan Tersimpan &mdash; {level.toUpperCase()} / {module} / Set {examSet}
          </h2>

          {existing.length === 0 ? (
            <p className="text-mist text-sm">Belum ada pembahasan untuk kombinasi ini.</p>
          ) : (
            <div className="space-y-2">
              {existing.map(row=>(
                <div
                  key={row.id}
                  className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3 text-sm"
                >
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <span className="font-semibold text-ink">Soal {row.question_order}</span>
                  {row.explanation_text && (
                    <span className="text-mist flex items-center gap-1"><FileText size={12} /> Teks</span>
                  )}
                  {row.video_url && (
                    <span className="text-mist flex items-center gap-1"><Video size={12} /> Video</span>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </main>
  )
}
