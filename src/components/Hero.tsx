"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Play } from "lucide-react"

const headline = ["Master German.", "Prove It."]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.13 }
  }
}

const line = {
  hidden: { opacity: 0, y: 60, rotateX: 20 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
}

export default function Hero(){

  return (

    <section className="relative overflow-hidden px-6 md:px-16 pt-24 pb-24 md:pt-36 md:pb-36">

      {/* vivid ambient gradient mesh */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="gradient-drift absolute -top-32 left-1/4 w-[560px] h-[560px] rounded-full bg-gold/30 blur-[130px]" />
        <div className="gradient-drift absolute top-1/4 -right-32 w-[520px] h-[520px] rounded-full bg-crimson/30 blur-[130px]" style={{ animationDelay:"-6s" }} />
        <div className="gradient-drift absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/15 blur-[120px]" style={{ animationDelay:"-12s" }} />
      </div>

      {/* faint grid texture for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }}
      />

      <div className="relative max-w-6xl mx-auto text-center">

        <motion.div
          initial={{ opacity:0, scale:0.8 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.6, ease:[0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-gold mb-8"
        >
          <Sparkles size={14} />
          AI-Powered Goethe Exam Prep
        </motion.div>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          style={{ perspective:800 }}
          className="text-6xl sm:text-7xl md:text-9xl font-bold leading-[0.95] tracking-tighter text-paper"
        >
          {headline.map((text, i)=>(
            <motion.span
              key={text}
              variants={line}
              className={`block ${i === 1 ? "bg-gradient-to-r from-gold via-gold-soft to-crimson bg-clip-text text-transparent" : ""}`}
            >
              {text}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.55, ease:"easeOut" }}
          className="text-white/60 text-lg md:text-xl mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          Practice all four Goethe skills with AI that grades you instantly &mdash;
          Lesen, H&ouml;ren, Schreiben, and Sprechen, built to feel like exam day.
        </motion.p>

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.7, ease:"easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >

          <motion.a
            href="/start"
            whileHover={{ scale:1.04, y:-3 }}
            whileTap={{ scale:0.98 }}
            transition={{ type:"spring", stiffness:400, damping:15 }}
            className="group bg-gradient-to-r from-gold to-crimson text-ink px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2 shadow-xl shadow-crimson/20"
          >
            Start Your First Tryout
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </motion.a>

          <motion.a
            href="#module-showcase"
            whileHover={{ scale:1.04, y:-3 }}
            whileTap={{ scale:0.98 }}
            transition={{ type:"spring", stiffness:400, damping:15 }}
            className="group bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl text-paper font-bold inline-flex items-center gap-2"
          >
            <Play size={16} className="text-gold" />
            See It In Action
          </motion.a>

        </motion.div>

        {/* PRODUCT SHOWCASE */}

        <motion.div
          initial={{ opacity:0, y:60, scale:0.94 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:1, delay:0.85, ease:[0.16,1,0.3,1] as const }}
          className="relative mt-20 max-w-4xl mx-auto"
        >

          <div className="absolute -inset-6 bg-gradient-to-r from-gold/20 via-transparent to-crimson/20 blur-3xl rounded-[40px]" />

          <div className="relative rounded-[28px] md:rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">

            {/* fake browser chrome */}
            <div className="flex items-center gap-1.5 px-5 py-4 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-crimson/60" />
              <span className="w-3 h-3 rounded-full bg-gold/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
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
