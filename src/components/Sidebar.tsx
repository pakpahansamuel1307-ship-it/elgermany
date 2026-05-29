"use client"

import { useEffect, useState } from "react"

import {
  LayoutDashboard,
  Trophy,
  User,
  LogOut,
  History,
  Coins,
  BookOpen
} from "lucide-react"

import { supabase }
from "../lib/supabase"

type SidebarProps = {
  activeTab: string
  setActiveTab: (
    tab: string
  ) => void
}

export default function Sidebar({
  activeTab,
  setActiveTab
}: SidebarProps){

  const [
    tokens,
    setTokens
  ] = useState(0)

  const handleLogout =
  async ()=>{

    await supabase.auth
    .signOut()

    window.location.href =
    "/"
  }

  useEffect(()=>{

    async function
    loadToken(){

      const {
        data: userData
      } =
      await supabase
        .auth
        .getUser()

      const user =
        userData.user

      if(!user) return

      const {
        data: profile
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

  return (

    <>
  {/* DESKTOP SIDEBAR */}

  <aside className="hidden md:flex flex-col justify-between w-[280px] border-r border-white/10 bg-white/5 backdrop-blur-xl p-8">

      <div>

        {/* LOGO */}

        <div className="flex items-center gap-3 mb-8">

          <img
            src="/logo.png"
            alt="logo"
            className="w-12 h-12"
          />

          <div>

            <h1 className="font-bold text-xl">

              EL Germany

            </h1>

            <p className="text-gray-400 text-sm">

              Premium Platform

            </p>

          </div>

        </div>

        {/* TOKEN */}

       <button

  onClick={()=>
    window.location.href =
    "/payment"
  }

  className="w-full text-left mb-8 bg-gradient-to-br from-yellow-400/10 to-red-500/10 border border-yellow-400/20 rounded-[28px] p-5 backdrop-blur-xl hover:border-yellow-400/40 hover:scale-[1.01] transition"

>

          <p className="text-xs text-gray-400 mb-2">
            Token Tryout
          </p>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Coins
                size={22}
                className="text-yellow-400"
              />

              <h2 className="text-3xl font-bold text-yellow-400">
                {tokens}
              </h2>

            </div>

          </div>

        </button>

        {/* MENU */}

        <div className="space-y-3">

          <button
            onClick={() =>
              setActiveTab(
                "dashboard"
              )
            }
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition ${
              activeTab ===
              "dashboard"
              ? "bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold"
              : "hover:bg-white/10"
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "tryout"
              )
            }
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition ${
              activeTab ===
              "tryout"
              ? "bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold"
              : "hover:bg-white/10"
            }`}
          >
            <BookOpen size={20} />
            Tryout
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "leaderboard"
              )
            }
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition ${
              activeTab ===
              "leaderboard"
              ? "bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold"
              : "hover:bg-white/10"
            }`}
          >
            <Trophy size={20} />
            Leaderboard
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "history"
              )
            }
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition ${
              activeTab ===
              "history"
              ? "bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold"
              : "hover:bg-white/10"
            }`}
          >
            <History size={20} />
            History
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "profile"
              )
            }
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition ${
              activeTab ===
              "profile"
              ? "bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold"
              : "hover:bg-white/10"
            }`}
          >
            <User size={20} />
            Profile
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "course"
              )
            }
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition ${
              activeTab ===
              "course"
              ? "bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold"
              : "hover:bg-white/10"
            }`}
          >
            <BookOpen size={20} />
            Course
          </button>

        </div>

      </div>

      <button
        className="flex items-center gap-4 hover:bg-red-500/20 text-red-400 px-5 py-4 rounded-2xl transition"
        onClick={
          handleLogout
        }
      >
        <LogOut size={20} />
        Logout
      </button>

    </aside>

{/* MOBILE NAVBAR */}

<div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0B1020]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2">

  <div className="flex items-center justify-around">

    <button
      onClick={()=>
        setActiveTab(
          "dashboard"
        )
      }
      className={`flex flex-col items-center text-xs ${
        activeTab ===
        "dashboard"
        ? "text-yellow-400"
        : "text-gray-400"
      }`}
    >

      <LayoutDashboard
        size={22}
      />

      Dashboard

    </button>

    <button
      onClick={()=>
        setActiveTab(
          "tryout"
        )
      }
      className={`flex flex-col items-center text-xs ${
        activeTab ===
        "tryout"
        ? "text-yellow-400"
        : "text-gray-400"
      }`}
    >

      <BookOpen
        size={22}
      />

      Tryout

    </button>

    <button
      onClick={()=>
        setActiveTab(
          "history"
        )
      }
      className={`flex flex-col items-center text-xs ${
        activeTab ===
        "history"
        ? "text-yellow-400"
        : "text-gray-400"
      }`}
    >

      <History
        size={22}
      />

      History

    </button>

    <button
      onClick={()=>
        setActiveTab(
          "profile"
        )
      }
      className={`flex flex-col items-center text-xs ${
        activeTab ===
        "profile"
        ? "text-yellow-400"
        : "text-gray-400"
      }`}
    >

      <User
        size={22}
      />

      Profile

    </button>

  </div>

</div>

</>
  )
}