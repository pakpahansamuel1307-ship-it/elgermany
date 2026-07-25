"use client"

import { motion } from "framer-motion"
import {
  GraduationCap,
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

          <div className="inline-flex items-center gap-2 bg-crimson/10 border border-crimson/25 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-crimson mb-6">

            <GraduationCap size={14} />
            Premium German Platform

          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-ink">

            German Language Preparation
            <span className="text-crimson">
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
              className="border border-border hover:border-ink/30 px-6 py-3.5 rounded-xl text-ink font-bold text-center transition-colors duration-200"
            >
              View Demo
            </a>

          </div>

        </motion.div>

        {/* RIGHT: hero photo */}

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

          <div className="pointer-events-none absolute -top-10 -left-10 w-72 h-72 bg-crimson/10 blur-3xl rounded-full"></div>

          <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 bg-gold/10 blur-3xl rounded-full"></div>

          <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl">
            <img
              src="/hero-optimized.webp"
              alt="Belajar bahasa Jerman bersama EL Germany"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* floating stat badge */}

          <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 bg-gradient-to-r from-gold to-crimson rounded-2xl px-5 py-4 md:px-6 md:py-5 text-ink shadow-xl">

            <h3 className="text-2xl font-bold leading-none">
              10.000+
            </h3>

            <p className="text-xs font-semibold mt-1.5">
              Exercises Completed
            </p>

          </div>

        </motion.div>

      </div>

    </section>
  )
}
