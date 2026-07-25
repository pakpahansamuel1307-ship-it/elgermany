"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Stats(){

  const [completedTryouts, setCompletedTryouts] = useState(500)
  const [activeUsers, setActiveUsers] = useState(300)

  useEffect(()=>{

    async function loadStats(){

      /* TRYOUT COUNT */

      const { count: tryoutCount, error: tryoutError } = await supabase
        .from("tryout_attempts")
        .select("*", { count: "exact", head: true })
        .not("module_type", "eq", "full")

      console.log("TRYOUT COUNT:", tryoutCount)
      console.log("TRYOUT ERROR:", tryoutError)

      /* USER COUNT */

      const { count: userCount, error: userError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })

      console.log("USER COUNT:", userCount)
      console.log("USER ERROR:", userError)

      setCompletedTryouts(500 + (tryoutCount || 0))
      setActiveUsers(300 + (userCount || 0))
    }

    loadStats()

  },[])

  const stats = [
    { value: `${completedTryouts}+`, label: "Try Out Completed", color: "text-amber-600" },
    { value: `${activeUsers}+`, label: "Active Users", color: "text-crimson" },
    { value: "95%", label: "Satisfaction Level", color: "text-green-600" },
    { value: "A1-B2", label: "All Level", color: "text-blue-600" },
  ]

  return (

    <section className="px-6 md:px-16 py-20 md:py-28">

      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity:0, y:24 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease:"easeOut" }}
          viewport={{ once:true, margin:"-80px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10"
        >

          {stats.map((stat) => (

            <div key={stat.label} className="text-center">

              <h3 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${stat.color}`}>
                {stat.value}
              </h3>

              <p className="text-mist mt-3 text-sm md:text-base">
                {stat.label}
              </p>

            </div>

          ))}

        </motion.div>

      </div>

    </section>
  )
}
