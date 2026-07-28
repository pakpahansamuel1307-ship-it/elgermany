"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

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

const navItems = [
  { key:"dashboard", label:"Dashboard", icon:LayoutDashboard },
  { key:"tryout", label:"Tryout", icon:BookOpen },
  { key:"leaderboard", label:"Leaderboard", icon:Trophy },
  { key:"history", label:"History", icon:History },
  { key:"profile", label:"Profile", icon:User },
  { key:"course", label:"Course", icon:BookOpen },
]

const mobileNavItems = [
  { key:"dashboard", label:"Dashboard", icon:LayoutDashboard },
  { key:"tryout", label:"Tryout", icon:BookOpen },
  { key:"history", label:"History", icon:History },
  { key:"profile", label:"Profile", icon:User },
]

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

  <aside className="hidden md:flex flex-col justify-between w-[280px] shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-xl p-8">

      <div>

        {/* LOGO */}

        <div className="flex items-center gap-3 mb-8">

          <img
            src="/logo.png"
            alt="logo"
            className="w-12 h-12 object-contain"
          />

          <div>

            <h1 className="font-bold text-xl text-paper">

              EL Germany

            </h1>

            <p className="text-white/40 text-sm">

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

  className="w-full text-left mb-8 bg-gradient-to-br from-gold/10 to-crimson/10 border border-gold/20 rounded-[28px] p-5 backdrop-blur-xl hover:border-gold/40 hover:scale-[1.01] transition"

>

          <p className="text-xs text-white/50 mb-2">
            Token Tryout
          </p>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Coins
                size={22}
                className="text-gold"
              />

              <h2 className="text-3xl font-bold text-gold">
                {tokens}
              </h2>

            </div>

          </div>

        </button>

        {/* MENU */}

        <div className="space-y-2">

          {navItems.map((item)=>{
            const isActive = activeTab === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className="relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-colors duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    transition={{ type:"spring", stiffness:400, damping:32 }}
                    className="absolute inset-0 bg-gradient-to-r from-gold to-crimson rounded-2xl"
                  />
                )}
                <span className={`relative flex items-center gap-4 ${isActive ? "text-ink font-semibold" : "text-white/60 hover:text-paper"}`}>
                  <item.icon size={20} />
                  {item.label}
                </span>
              </button>
            )
          })}

        </div>

      </div>

      <button
        className="flex items-center gap-4 hover:bg-crimson/15 text-crimson px-5 py-4 rounded-2xl transition-colors duration-200"
        onClick={
          handleLogout
        }
      >
        <LogOut size={20} />
        Logout
      </button>

    </aside>

{/* MOBILE NAVBAR */}

<div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-ink/95 backdrop-blur-xl border-t border-white/10 px-2 py-2">

  <div className="flex items-center justify-around">

    {mobileNavItems.map((item)=>{
      const isActive = activeTab === item.key
      return (
        <button
          key={item.key}
          onClick={()=>setActiveTab(item.key)}
          className={`flex flex-col items-center gap-1 text-xs px-3 py-1 transition-colors duration-200 ${
            isActive ? "text-gold" : "text-white/40"
          }`}
        >
          <item.icon size={22} />
          {item.label}
        </button>
      )
    })}

  </div>

</div>

</>
  )
}
