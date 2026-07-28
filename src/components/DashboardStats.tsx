"use client"

import { useEffect, useState }
from "react"

import { motion }
from "framer-motion"

import { ClipboardList, Ticket, TrendingUp, Trophy }
from "lucide-react"

import { supabase }
from "../lib/supabase"

export default function
DashboardStats(){

  const [
    stats,
    setStats
  ] =
  useState([

    {
      title:
      "Total Try Out",
      value:"0"
    },

    {
      title:
      "Remaining Access",
      value:"0"
    },

    {
      title:
      "Highest Score",
      value:"0"
    },

    {
      title:
      "Ranking",
      value:"#-"
    },

  ])

  useEffect(()=>{

    async function
    loadStats(){

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

      /* PROFILE */

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

      /* RESULT USER SENDIRI */

      const {
        data:userResults
      } =
      await supabase

      .from(
        "results"
      )

      .select(
        "score"
      )

      .eq(
        "user_id",
        user.id
      )

      const totalTryout =
      userResults
      ?.length || 0

      const highestScore =
      userResults
      ?.length

      ? Math.max(

          ...userResults
          .map(
            item=>

            item.score
            || 0
          )

        )

      : 0

      /* GLOBAL RANKING */

      const {
        data:allResults
      } =
      await supabase

      .from(
        "results"
      )

      .select(
        "user_id,score"
      )

      if(!allResults){

        return
      }

      /* best score tiap user */

      const userBest:
      Record<
        string,
        number
      > = {}

      allResults
      .forEach(
        item=>{

          if(

            !userBest[
              item.user_id
            ] ||

            item.score >
            userBest[
              item.user_id
            ]

          ){

            userBest[
              item.user_id
            ] =
            item.score
          }
        }
      )

      /* urut global */

      const sorted =

      Object.entries(
        userBest
      )

      .sort(
        (
          a,
          b
        )=>

        b[1] - a[1]
      )

      /* cari rank user */

      const ranking =

      sorted.findIndex(
        ([id])=>

        id ===
        user.id
      ) + 1

      setStats([

        {
          title:
          "Total Try Out",

          value:
          totalTryout
          .toString()
        },

        {
          title:
          "Remaining Access",

          value:
          String(

            profile
            ?.remaining_tryouts
            ?? 0

          )
        },

        {
          title:
          "Highest Score",

          value:
          String(
            highestScore
          )
        },

        {
          title:
          "Ranking",

          value:
          ranking > 0
          ? `#${ranking}`
          : "#-"
        }

      ])
    }

    loadStats()

  },[])

  const statMeta = [
    { icon: ClipboardList, tint: "bg-gold/15 text-gold" },
    { icon: Ticket, tint: "bg-crimson/15 text-crimson" },
    { icon: Trophy, tint: "bg-green-500/15 text-green-400" },
    { icon: TrendingUp, tint: "bg-blue-500/15 text-blue-400" },
  ]

  return (

    <motion.div
      initial={{
        opacity:0
      }}

      whileInView={{
        opacity:1
      }}

      transition={{
        duration:1
      }}

      viewport={{
        once:true
      }}

      className="grid md:grid-cols-4 gap-6 mt-10"
    >

      {stats.map(
      (
        item,
        index
      )=>{

        const Icon = statMeta[index]?.icon

        return (

        <motion.div
          key={index}
          initial={{ opacity:0, y:24 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.5, delay: index * 0.08, ease:"easeOut" }}
          viewport={{ once:true }}
          whileHover={{ y:-4 }}
          className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-7 hover:bg-white/[0.08] transition-colors duration-300"
        >

          <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${statMeta[index]?.tint}`}>
            {Icon && <Icon size={20} />}
          </div>

          <p className="text-white/50 mb-2">

            {item.title}

          </p>

          <h2 className="text-4xl font-bold text-paper">

            {item.value}

          </h2>

        </motion.div>

      )})}

    </motion.div>
  )
}