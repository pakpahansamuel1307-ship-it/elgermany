"use client"

import { motion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  Brain,
  GraduationCap,
} from "lucide-react"

export default function Hero(){

  return (

    <section className="relative z-10 px-6 md:px-16 pt-20 pb-32">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        {/* LEFT */}

        <motion.div
          initial={{ opacity:0, y:40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8 }}
        >

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-sm mb-6">

            <GraduationCap size={16} />
            Premium German Platform

          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">

            Persiapan Bahasa Jerman
            <span className="text-yellow-400">
              {" "}Modern
            </span>
            <br />
            Dengan AI

          </h1>

          <p className="text-gray-400 text-lg mt-6 leading-relaxed">

            Platform try out bahasa Jerman modern dengan AI correction,
            simulasi sprechen interaktif, dan video pembahasan premium.

          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">

         <a
href="/start"
className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold">
Mulai Try Out
</a>

            <a
href="/demo"
className="border border-white px-6 py-3 rounded-xl text-white font-bold"
>
Lihat Demo
</a>

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
  initial={{ opacity:0, scale:0.9 }}
  animate={{
    opacity:1,
    scale:1,
    y:[0,-10,0]
  }}
  transition={{
    duration:4,
    repeat:Infinity
  }}
  className="relative"
>

          <div className="absolute -top-10 -left-10 w-72 h-72 bg-red-500/30 blur-3xl rounded-full"></div>

          <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-400/20 blur-3xl rounded-full"></div>

          <div className="relative bg-white/10 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">

            <div className="space-y-6">

              <div className="bg-[#111827] rounded-2xl p-5">

                <div className="flex items-center gap-3">

                  <BookOpen className="text-yellow-400" />

                  <div>

                    <h3 className="font-semibold">
                      Try Out Bahasa Jerman B1
                    </h3>

                    <p className="text-sm text-gray-400">
                      Simulasi ujian real
                    </p>

                  </div>

                </div>

              </div>

              <div className="bg-[#111827] rounded-2xl p-5">

                <div className="flex items-center gap-3">

                  <Brain className="text-red-400" />

                  <div>

                    <h3 className="font-semibold">
                      AI Correction
                    </h3>

                    <p className="text-sm text-gray-400">
                      Feedback otomatis modern
                    </p>

                  </div>

                </div>

              </div>

              <div className="bg-gradient-to-r from-yellow-400 to-red-500 rounded-2xl p-6 text-black">

                <h3 className="text-2xl font-bold">
                  10.000+
                </h3>

                <p>
                  Latihan diselesaikan
                </p>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  )
}