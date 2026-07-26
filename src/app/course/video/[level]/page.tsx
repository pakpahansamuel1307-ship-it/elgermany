"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Lock,
  Crown,
  ArrowRight,
  ArrowLeft,
  Loader2,
  PlayCircle,
} from "lucide-react"

import { supabase } from "../../../../lib/supabase"
import { useAuthGuard } from "../../../../hooks/useAuthGuard"

type CourseVideo = {
  id:number
  title:string
  description:string | null
  video_url:string
  order_index:number
}

/* Renders an inline YouTube player when the link is recognizably YouTube,
   otherwise falls back to a plain "open video" link/button so any other
   video host (Google Drive, Vimeo, direct file, etc.) still works. */
function getYoutubeEmbedUrl(url:string):string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]+)/,
    /youtu\.be\/([\w-]+)/,
    /youtube\.com\/embed\/([\w-]+)/,
  ]
  for(const pattern of patterns){
    const match = url.match(pattern)
    if(match) return `https://www.youtube.com/embed/${match[1]}`
  }
  return null
}

export default function CourseVideoLevelPage(){

  useAuthGuard()

  const params = useParams()
  const level = typeof params.level === "string" ? params.level : "a1"

  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [videos, setVideos] = useState<CourseVideo[]>([])
  const [activeVideo, setActiveVideo] = useState<CourseVideo | null>(null)

  useEffect(()=>{

    async function load(){

      const { data:userData } = await supabase.auth.getUser()
      const user = userData.user

      if(!user){
        setLoading(false)
        return
      }

      /* Re-checked here on purpose (not just on the level-picker page) -
         this page is reachable directly by URL, so access has to hold up
         on its own regardless of how the visitor arrived. */
      const { data:profile } = await supabase
        .from("profiles")
        .select("subscription_active, subscription_expires_at")
        .eq("id", user.id)
        .single()

      const active =
        profile?.subscription_active &&
        profile?.subscription_expires_at &&
        new Date(profile.subscription_expires_at) > new Date()

      setHasAccess(Boolean(active))

      if(active){

        const { data } = await supabase
          .from("course_videos")
          .select("*")
          .eq("level", level)
          .order("order_index", { ascending:true })

        setVideos(data || [])
        setActiveVideo(data?.[0] || null)
      }

      setLoading(false)
    }

    load()

  },[level])

  if(loading){
    return (
      <main className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <div className="flex items-center gap-3 text-mist">
          <Loader2 className="animate-spin text-gold" size={24} />
          Loading...
        </div>
      </main>
    )
  }

  if(!hasAccess){
    return (
      <main className="min-h-screen bg-paper text-ink flex items-center justify-center p-8">
        <div className="max-w-lg w-full bg-surface border border-border rounded-3xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="text-ink" size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Terkunci</h1>
          <p className="text-mist mb-8">
            Berlangganan dulu untuk membuka video level {level.toUpperCase()}.
          </p>
          <Link
            href="/payment"
            className="bg-gradient-to-r from-gold to-crimson text-ink px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2 hover:opacity-90 transition-opacity duration-200"
          >
            <Crown size={18} />
            Lihat Paket Langganan
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    )
  }

  const embedUrl = activeVideo ? getYoutubeEmbedUrl(activeVideo.video_url) : null

  return (

    <main className="min-h-screen bg-paper text-ink p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        <Link href="/course/video" className="inline-flex items-center gap-1.5 text-mist hover:text-crimson text-sm font-semibold mb-6 transition-colors duration-200">
          <ArrowLeft size={14} />
          Semua Level
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Course Video &mdash; {level.toUpperCase()}
        </h1>

        {videos.length === 0 ? (

          <div className="bg-surface border border-border rounded-3xl p-10 text-center text-mist shadow-sm">
            Belum ada video untuk level ini.
          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2">

              <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">

                {activeVideo && embedUrl ? (
                  <div className="aspect-video">
                    <iframe
                      src={embedUrl}
                      title={activeVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : activeVideo ? (
                  <div className="aspect-video flex flex-col items-center justify-center gap-4 bg-paper">
                    <PlayCircle size={40} className="text-crimson" />
                    <a
                      href={activeVideo.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-gold to-crimson text-ink px-6 py-3 rounded-xl font-bold"
                    >
                      Buka Video
                    </a>
                  </div>
                ) : null}

                {activeVideo && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-ink">{activeVideo.title}</h2>
                    {activeVideo.description && (
                      <p className="text-mist mt-2 leading-relaxed">{activeVideo.description}</p>
                    )}
                  </div>
                )}

              </div>

            </div>

            <div className="space-y-3">
              {videos.map(video=>(
                <button
                  key={video.id}
                  onClick={()=>setActiveVideo(video)}
                  className={`w-full text-left p-4 rounded-2xl border flex items-center gap-3 transition-colors duration-200 ${
                    activeVideo?.id === video.id
                      ? "bg-gold/15 border-gold/30"
                      : "bg-surface border-border hover:bg-paper"
                  }`}
                >
                  <PlayCircle size={18} className={activeVideo?.id === video.id ? "text-crimson" : "text-mist"} />
                  <span className="font-semibold text-ink text-sm">{video.title}</span>
                </button>
              ))}
            </div>

          </div>
        )}

      </div>

    </main>
  )
}
