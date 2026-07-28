"use client"

import { 
  Coins,
  LayoutDashboard,
  LogOut

} from "lucide-react"

import { useEffect, 
        useState
 } from "react"

import Sidebar
from "../../components/Sidebar"

import DashboardHero
from "../../components/DashboardHero"

import DashboardStats
from "../../components/DashboardStats"

import TryoutList
from "../../components/TryoutList"

import HistorySection
from "../../components/HistorySection"

import LeaderboardSection
from "../../components/LeaderboardSection"

import { useAuthGuard }
from "../../hooks/useAuthGuard"

import ProfileSection from "../../components/ProfileSection"

import CourseSection from "../../components/CourseSection"

import TryoutSection from "../../components/TryoutSection"

import { supabase } 
from "../../lib/supabase"


export default function
DashboardPage(){

  useAuthGuard()

  useEffect(()=>{

  async function
  loadToken(){

    const {
      data:userData
    } =

    await supabase
    .auth
    .getUser()

    const user =
    userData.user

    if(!user)
    return

    const {
      data:profile
    } =

    await supabase

    .from(
      "profiles"
    )

    .select(
      "remaining_tryouts"
    )

    .eq(
      "id",
      user.id
    )

    .single()

    setTokens(

      profile
      ?.remaining_tryouts
      ?? 0

    )
  }

  loadToken()

},[])

  const [
    activeTab,
    setActiveTab
  ] =
  useState(
    "dashboard"
  )

  const [
  tokens,
  setTokens
] =
useState(0)

  return (

    <main className="relative min-h-screen bg-ink text-paper flex overflow-hidden">

      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-crimson to-gold z-50" />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-crimson/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[140px]" />
      </div>

      <Sidebar
        activeTab={
          activeTab
        }
        setActiveTab={
          setActiveTab
        }
      />

      <div className="relative flex-1 p-4 md:p-10 pb-28 md:pb-10 overflow-hidden">

       <button

  onClick={()=>
    window.location.href =
    "/payment"
  }

  className="w-full text-left md:hidden mb-6 bg-gradient-to-br from-gold/10 to-crimson/10 border border-gold/20 rounded-[28px] p-5 backdrop-blur-xl hover:border-gold/40 transition"

>

  <p className="text-xs text-white/50 mb-2">

    Token Tryout

  </p>

  <div className="flex items-center gap-2">

    <Coins
      size={22}
      className="text-gold"
    />

    <h2 className="text-3xl font-bold text-gold">

      {tokens}

    </h2>

  </div>

</button>

        {/* DASHBOARD */}

        {activeTab ===
        "dashboard" && (

          <>

            <DashboardHero />

            <DashboardStats />

            <TryoutList />

          </>

        )}

        {/* TRYOUT */}

       {activeTab ===
"tryout" && (

  <TryoutSection />

)}

        {/* LEADERBOARD */}

        {activeTab ===
        "leaderboard" && (

          <LeaderboardSection />

        )}

        {/* HISTORY */}

        {activeTab ===
        "history" && (

          <HistorySection />

        )}

        {/* PROFILE */}

      {activeTab ===
"profile" && (

  <ProfileSection />

)}
       {/* COURSE */}

{activeTab ===
"course" && (

  <CourseSection />

)}

      </div>

    </main>
  )
}