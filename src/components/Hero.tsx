"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Play } from "lucide-react"

const headline = ["Master German.", "Prove It."]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 }
  }
}

const line = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
  }
}

export default function Hero(){

  return (

    <section className="relative overflow-hidden px-6 md:px-16 pt-20 pb-24 md:pt-28 md:pb-32">

      {/* ambient gradient orbs */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="gradient-drift absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gold/25 blur-[110px]" />
        <div className="gradient-drift absolute top-1/3 -right-24 w-[460px] h-[460px] rounded-full bg-crimson/15 blur-[120px]" style={{ animationDelay:"-6s" }} />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">

        <motion.div
          initial={{ opacity:0, y:-10 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease:"easeOut" }}
          className="inline-flex items-center gap-2 bg-crimson/10 border border-crimson/25 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-crimson mb-8"
        >
          <Sparkles size={14} />
          AI-Powered Goethe Exam Prep
        </motion.div>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.02] tracking-tight text-ink"
        >
          {headline.map((text, i)=>(
            <motion.span
              key={text}
              variants={line}
              className={`block ${i === 1 ? "text-crimson" : ""}`}
            >
              {text}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.5, ease:"easeOut" }}
          className="text-mist text-lg md:text-xl mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          Practice all four Goethe skills with AI that grades you instantly &mdash;
          Lesen, H&ouml;ren, Schreiben, and Sprechen, built to feel like exam day.
        </motion.p>

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.65, ease:"easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >

          <a
            href="/start"
            className="group bg-gradient-to-r from-gold to-crimson text-ink px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2 shadow-lg shadow-crimson/10 hover:shadow-xl hover:shadow-crimson/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Your First Tryout
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </a>

          <a
            href="#module-showcase"
            className="group border border-border px-8 py-4 rounded-2xl text-ink font-bold inline-flex items-center gap-2 hover:border-ink/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Play size={16} className="text-crimson" />
            See It In Action
          </a>

        </motion.div>

        {/* PRODUCT SHOWCASE */}

        <motion.div
          initial={{ opacity:0, y:50, scale:0.97 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.9, delay:0.8, ease:[0.16,1,0.3,1] as const }}
          className="relative mt-20 max-w-4xl mx-auto"
        >

          <div className="rounded-[28px] md:rounded-[32px] border border-border bg-surface shadow-2xl shadow-ink/10 overflow-hidden">

            {/* fake browser chrome */}
            <div className="flex items-center gap-1.5 px-5 py-4 border-b border-border bg-paper">
              <span className="w-3 h-3 rounded-full bg-crimson/40" />
              <span className="w-3 h-3 rounded-full bg-gold/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/40" />
            </div>

            <video
              className="w-full h-auto block"
              src="/videos/hero-showcase.mp4"
              poster="/videos/hero-showcase-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
            />

          </div>

        </motion.div>

      </div>

    </section>
  )
}
