"use client"

import { useEffect, useState } from "react"
import {
  Upload,
  Video,
  Loader2,
  ListVideo,
  Trash2,
} from "lucide-react"

import { supabase } from "../../../lib/supabase"
import { useAdminGuard } from "../../../hooks/useAdminGuard"

type CourseVideo = {
  id:number
  level:string
  title:string
  description:string | null
  video_url:string
  order_index:number
}

export default function AdminCourseVideosPage(){

  useAdminGuard()

  const [level, setLevel] = useState("a1")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [orderIndex, setOrderIndex] = useState(1)

  const [submitting, setSubmitting] = useState(false)
  const [existing, setExisting] = useState<CourseVideo[]>([])

  async function loadExisting(){

    const { data } = await supabase
      .from("course_videos")
      .select("*")
      .eq("level", level)
      .order("order_index", { ascending:true })

    setExisting(data || [])
  }

  useEffect(()=>{

    loadExisting()

  },[level])

  async function submit(){

    if(!title.trim() || !videoUrl.trim()){
      alert("Judul dan link video wajib diisi.")
      return
    }

    setSubmitting(true)

    const { error } = await supabase
      .from("course_videos")
      .insert({
        level,
        title: title.trim(),
        description: description.trim() || null,
        video_url: videoUrl.trim(),
        order_index: orderIndex,
      })

    setSubmitting(false)

    if(error){
      alert(error.message)
      return
    }

    setTitle("")
    setDescription("")
    setVideoUrl("")
    setOrderIndex(prev=>prev + 1)

    loadExisting()
    alert("Video berhasil diupload.")
  }

  async function removeVideo(id:number){

    if(!confirm("Hapus video ini?")) return

    const { error } = await supabase
      .from("course_videos")
      .delete()
      .eq("id", id)

    if(error){
      alert(error.message)
      return
    }

    loadExisting()
  }

  return (

    <main className="min-h-screen bg-paper text-ink p-6 md:p-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
          <Video className="text-crimson" size={30} />
          Kelola Video Course
        </h1>

        <p className="text-mist mb-10">
          Video ini hanya bisa ditonton peserta yang berlangganan aktif.
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
              <label className="text-sm font-semibold text-mist mb-2 block">Urutan Tayang</label>
              <input
                type="number"
                min={1}
                value={orderIndex}
                onChange={(e)=>setOrderIndex(Number(e.target.value) || 1)}
                className="w-full bg-paper border border-border p-4 rounded-2xl text-ink"
              />
            </div>

          </div>

          <div>
            <label className="text-sm font-semibold text-mist mb-2 block">Judul Video</label>
            <input
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              placeholder="Contoh: Grammatik Dasar - Artikel"
              className="w-full bg-paper border border-border p-4 rounded-2xl text-ink"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-mist mb-2 block">Deskripsi (opsional)</label>
            <textarea
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              placeholder="Ringkasan singkat isi video..."
              className="w-full min-h-[120px] bg-paper border border-border p-5 rounded-3xl text-ink resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-mist mb-2 block">Link Video (YouTube disarankan)</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e)=>setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
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
                Upload Video
              </>
            )}
          </button>

        </div>

        <div className="mt-8">

          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-ink">
            <ListVideo size={18} className="text-crimson" />
            Video Level {level.toUpperCase()}
          </h2>

          {existing.length === 0 ? (
            <p className="text-mist text-sm">Belum ada video untuk level ini.</p>
          ) : (
            <div className="space-y-2">
              {existing.map(video=>(
                <div
                  key={video.id}
                  className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-gold/20 text-ink text-xs font-bold flex items-center justify-center shrink-0">
                      {video.order_index}
                    </span>
                    <span className="font-semibold text-ink">{video.title}</span>
                  </div>
                  <button
                    onClick={()=>removeVideo(video.id)}
                    className="text-mist hover:text-crimson transition-colors duration-200 shrink-0"
                    aria-label="Hapus video"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </main>
  )
}
