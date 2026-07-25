"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

/* The separate-module purchase flow has been retired: everything now goes
   through the Full Tryout flow (see /exam/full/[level]/[set]). This page
   is kept as a redirect (instead of being deleted outright) so any old
   bookmarked or shared link doesn't dead-end on a raw 404. */

export default function ModulesLevelRedirect(){

  const router = useRouter()

  useEffect(()=>{
    router.replace("/tryout")
  },[router])

  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center">
      <div className="flex items-center gap-3 text-mist">
        <Loader2 className="animate-spin text-gold" size={24} />
        Redirecting...
      </div>
    </main>
  )
}
