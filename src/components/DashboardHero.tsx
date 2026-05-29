"use client"

import { motion } from "framer-motion"

export default function DashboardHero(){

  return (

    <motion.div
      initial={{ opacity:0, y:30 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.7 }}
      className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 p-[1px]"
    >

      <div className="bg-[#0B1120] rounded-[40px] p-10 md:p-14 relative overflow-hidden">

        {/* GLOW */}

        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-400/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10">

          <p className="text-yellow-400 font-semibold mb-4">

            Willkommen zurück 👋

          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">

            Siap Melanjutkan
            <br />
            Persiapan Goethe?

          </h1>

          <p className="text-gray-400 text-lg mt-6 max-w-2xl">

            Kerjakan try out premium,
            akses video pembahasan,
            dan tingkatkan peluang lulusmu.

          </p>

          <button onClick={()=>{
window.location.href =
"/start"
}} className="mt-10 bg-yellow-400 hover:bg-yellow-300 hover:scale-105 transition-all duration-300 text-black px-8 py-5 rounded-2xl font-bold">

            Mulai Try Out

          </button>

        </div>

      </div>

    </motion.div>
  )
}