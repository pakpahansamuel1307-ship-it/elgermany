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

    <main className="min-h-screen bg-[#050816] text-white flex">

      <Sidebar
        activeTab={
          activeTab
        }
        setActiveTab={
          setActiveTab
        }
      />

      <div className="flex-1 p-4 md:p-10 pb-28 md:pb-10 overflow-hidden">

       <button

  onClick={()=>
    window.location.href =
    "/payment"
  }

  className="w-full text-left md:hidden mb-6 bg-gradient-to-br from-yellow-400/10 to-red-500/10 border border-yellow-400/20 rounded-[28px] p-5 backdrop-blur-xl hover:border-yellow-400/40 transition"

>

  <p className="text-xs text-gray-400 mb-2">

    Token Tryout

  </p>

  <div className="flex items-center gap-2">

    <Coins
      size={22}
      className="text-yellow-400"
    />

    <h2 className="text-3xl font-bold text-yellow-400">

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