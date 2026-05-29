"use client"

import { useEffect, useState }
from "react"

import { motion }
from "framer-motion"

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
      "Sisa Akses",
      value:"0"
    },

    {
      title:
      "Nilai Tertinggi",
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
          "Sisa Akses",

          value:
          String(

            profile
            ?.remaining_tryouts
            ?? 0

          )
        },

        {
          title:
          "Nilai Tertinggi",

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
      )=>(

        <div
          key={index}
          className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-7"
        >

          <p className="text-gray-400 mb-3">

            {item.title}

          </p>

          <h2 className="text-4xl font-bold">

            {item.value}

          </h2>

        </div>

      ))}

    </motion.div>
  )
}