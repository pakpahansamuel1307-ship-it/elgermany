"use client"

import { motion }
from "framer-motion"

import {
  useEffect,
  useState
} from "react"

import { supabase }
from "../lib/supabase"

export default function
Stats(){

  const [
    completedTryouts,
    setCompletedTryouts
  ] =
  useState(500)

  const [
    activeUsers,
    setActiveUsers
  ] =
  useState(300)

  useEffect(()=>{

    async function
    loadStats(){

      /* TRYOUT COUNT */

      const {
        count:
        tryoutCount,
        error:
        tryoutError
      } =
      await supabase

      .from(
        "tryout_attempts"
      )

      .select(
        "*",
        {
          count:
          "exact",
          head:true
        }
      )

      .not(
        "module_type",
        "eq",
        "full"
      )

      console.log(
        "TRYOUT COUNT:",
        tryoutCount
      )

      console.log(
        "TRYOUT ERROR:",
        tryoutError
      )

      /* USER COUNT */

      const {
        count:
        userCount,
        error:
        userError
      } =
      await supabase

      .from(
        "profiles"
      )

      .select(
        "*",
        {
          count:
          "exact",
          head:true
        }
      )

      console.log(
        "USER COUNT:",
        userCount
      )

      console.log(
        "USER ERROR:",
        userError
      )

      setCompletedTryouts(

        500 +

        (
          tryoutCount
          || 0
        )

      )

      setActiveUsers(

        300 +

        (
          userCount
          || 0
        )

      )
    }

    loadStats()

  },[])

  return (

    <section className="px-6 md:px-16 py-24">

      <motion.div className="max-w-6xl mx-auto">

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

          className="grid md:grid-cols-4 gap-8"
        >

          <div className="text-center">

            <h3 className="text-5xl font-bold text-yellow-400">

              {
                completedTryouts
              }+

            </h3>

            <p className="text-gray-400 mt-3">

              Try Out Diselesaikan

            </p>

          </div>

          <div className="text-center">

            <h3 className="text-5xl font-bold text-red-400">

              {
                activeUsers
              }+

            </h3>

            <p className="text-gray-400 mt-3">

              Pengguna Aktif

            </p>

          </div>

          <div className="text-center">

            <h3 className="text-5xl font-bold text-green-400">

              95%

            </h3>

            <p className="text-gray-400 mt-3">

              Tingkat Kepuasan

            </p>

          </div>

          <div className="text-center">

            <h3 className="text-5xl font-bold text-blue-400">

              A1-B2

            </h3>

            <p className="text-gray-400 mt-3">

              Semua Level

            </p>

          </div>

        </motion.div>

      </motion.div>

    </section>
  )
}