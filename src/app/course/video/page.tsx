"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Lock,
  Crown,
  CalendarClock,
  ArrowRight,
  Loader2,
  Video,
} from "lucide-react"

import { supabase } from "../../../lib/supabase"
import { useAuthGuard } from "../../../hooks/useAuthGuard"

const levels = [
  { code:"a1", label:"A1", desc:"Dasar untuk pemula" },
  { code:"a2", label:"A2", desc:"Lanjutan dasar" },
  { code:"b1", label:"B1", desc:"Menengah" },
  { code:"b2", label:"B2", desc:"Menengah atas" },
]

export default function CourseVideoPage(){

  useAuthGuard()

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)

  useEffect(()=>{

    async function checkSubscription(){

      const { data:userData } = await supabase.auth.getUser()
      const user = userData.user

      if(!user){
        setLoading(false)
        return
      }

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
      setExpiresAt(profile?.subscription_expires_at || null)
      setLoading(false)
    }

    checkSubscription()

  },[])

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

          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Video Course Terkunci
          </h1>

          <p className="text-mist mb-8 leading-relaxed">
            Video pembelajaran eksklusif A1&ndash;B2 hanya bisa diakses
            oleh peserta yang berlangganan. Berlangganan sekali, buka
            semua level.
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

  return (

    <main className="min-h-screen bg-paper text-ink p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Video className="text-crimson" size={28} />
              Course Video
            </h1>
            <p className="text-mist mt-2">
              Pilih level untuk mulai menonton.
            </p>
          </div>

          {expiresAt && (
            <div className="flex items-center gap-2 text-sm font-semibold text-ink bg-gold/15 px-4 py-2.5 rounded-full">
              <CalendarClock size={15} />
              Aktif s/d {new Date(expiresAt).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}
            </div>
          )}

        </div>

        <div className="grid sm:grid-cols-2 gap-6">

          {levels.map(level=>(
            <button
              key={level.code}
              onClick={()=>router.push(`/course/video/${level.code}`)}
              className="text-left bg-surface border border-border rounded-3xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <h2 className="text-3xl font-bold text-crimson mb-2">{level.label}</h2>
              <p className="text-mist">{level.desc}</p>
            </button>
          ))}

        </div>

      </div>

    </main>
  )
}
