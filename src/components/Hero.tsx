"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Brain,
  GraduationCap,
  Clock,
} from "lucide-react"

export default function Hero(){

  return (

    <section className="relative z-10 px-6 md:px-16 pt-16 pb-28 md:pt-24 md:pb-36">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        {/* LEFT */}

        <motion.div
          initial={{ opacity:0, y:24 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease:"easeOut" }}
        >

          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-gold mb-6">

            <GraduationCap size={14} />
            Premium German Platform

          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-paper">

            German Language Preparation
            <span className="text-gold">
              {" "}Modern
            </span>
            <br />
            With AI

          </h1>

          <p className="text-mist text-base md:text-lg mt-6 leading-relaxed max-w-lg">

            Modern German language practice platform with AI correction,
            interactive speaking simulation, and premium video explanations.

          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">

            <a
              href="/start"
              className="bg-gold hover:bg-gold-soft text-ink px-6 py-3.5 rounded-xl font-bold text-center transition-colors duration-200"
            >
              Start Try Out
            </a>

            <a
              href="/demo"
              className="border border-white/20 hover:border-white/40 px-6 py-3.5 rounded-xl text-paper font-bold text-center transition-colors duration-200"
            >
              View Demo
            </a>

          </div>

        </motion.div>

        {/* RIGHT: product preview card */}

        <motion.div
          initial={{ opacity:0, scale:0.94 }}
          animate={{
            opacity:1,
            scale:1,
            y:[0,-8,0]
          }}
          transition={{
            opacity:{ duration:0.6, ease:"easeOut" },
            scale:{ duration:0.6, ease:"easeOut" },
            y:{ duration:5, repeat:Infinity, ease:"easeInOut" }
          }}
          className="relative"
        >

          <div className="pointer-events-none absolute -top-10 -left-10 w-72 h-72 bg-crimson/20 blur-3xl rounded-full"></div>

          <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 bg-gold/15 blur-3xl rounded-full"></div>

          <div className="relative bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl">

            <div className="space-y-5">

              {/* mock exam session header */}

              <div className="bg-surface rounded-2xl p-5">

                <div className="flex items-center justify-between mb-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                      <BookOpen size={18} className="text-gold" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-paper text-sm">
                        Try Out Bahasa Jerman B1
                      </h3>
                      <p className="text-xs text-mist">
                        Real exam simulation
                      </p>
                    </div>

                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-mist bg-white/5 border border-white/10 rounded-full px-3 py-1.5 shrink-0">
                    <Clock size={12} />
                    24:18
                  </div>

                </div>

                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-gold to-crimson" />
                </div>

                <p className="text-xs text-mist mt-2">
                  Frage 13 / 20 &middot; Hören
                </p>

              </div>

              <div className="bg-surface rounded-2xl p-5">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-crimson/15 flex items-center justify-center shrink-0">
                    <Brain size={18} className="text-crimson" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-paper text-sm">
                      AI Correction
                    </h3>
                    <p className="text-xs text-mist">
                      Modern automatic feedback
                    </p>
                  </div>

                </div>

              </div>

              <div className="bg-gradient-to-r from-gold to-crimson rounded-2xl p-6 text-ink">

                <h3 className="text-2xl font-bold">
                  10.000+
                </h3>

                <p className="text-sm font-medium">
                  Exercises Completed
                </p>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  )
}
