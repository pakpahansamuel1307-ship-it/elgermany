"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Headphones, PenLine, Mic } from "lucide-react"

const modules = [
  {
    key:"lesen",
    label:"Lesen",
    icon:BookOpen,
    tagline:"Read like it's the real exam.",
    body:"Reading comprehension tasks structured exactly like the Goethe format, graded instantly so you know your score before you close the tab.",
    video:"/videos/module-lesen.mp4",
    poster:"/videos/module-lesen-poster.jpg",
  },
  {
    key:"horen",
    label:"H\u00F6ren",
    icon:Headphones,
    tagline:"Listen once. Like exam day.",
    body:"Audio plays a single time, no replays \u2014 the same pressure and format as the actual listening exam, so nothing feels unfamiliar on the day.",
    video:"/videos/module-horen.mp4",
    poster:"/videos/module-horen-poster.jpg",
  },
  {
    key:"schreiben",
    label:"Schreiben",
    icon:PenLine,
    tagline:"Write. Get graded instantly.",
    body:"AI reviews your written answers for grammar, structure, and accuracy the moment you submit \u2014 no waiting days for a tutor to reply.",
    video:"/videos/module-schreiben.mp4",
    poster:"/videos/module-schreiben-poster.jpg",
  },
  {
    key:"sprechen",
    label:"Sprechen",
    icon:Mic,
    tagline:"Speak. AI listens back.",
    body:"A real speaking simulation \u2014 monologue and dialogue tasks with an AI examiner that responds and evaluates like the real thing.",
    video:"/videos/module-sprechen.mp4",
    poster:"/videos/module-sprechen-poster.jpg",
  },
]

export default function ModuleShowcase(){

  const [active, setActive] = useState(0)
  const current = modules[active]

  return (

    <section id="module-showcase" className="relative px-6 md:px-16 py-20 md:py-32">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14 md:mb-16">

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-paper">
            Four Skills.
            <span className="bg-gradient-to-r from-gold to-crimson bg-clip-text text-transparent">{" "}One AI Examiner.</span>
          </h2>

          <p className="text-white/50 mt-5 text-base md:text-lg max-w-xl mx-auto">
            Every Goethe module, rebuilt to feel like the real exam.
          </p>

        </div>

        {/* TABS */}

        <div className="flex flex-wrap justify-center gap-3 mb-10">

          {modules.map((mod, index)=>{
            const isActive = index === active
            return (
              <motion.button
                key={mod.key}
                onClick={()=>setActive(index)}
                whileHover={{ scale:1.05 }}
                whileTap={{ scale:0.97 }}
                transition={{ type:"spring", stiffness:400, damping:17 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-colors duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-gold to-crimson text-ink shadow-lg shadow-crimson/20"
                    : "bg-white/5 border border-white/10 text-white/60 hover:text-paper hover:border-white/20"
                }`}
              >
                <mod.icon size={16} />
                {mod.label}
              </motion.button>
            )
          })}

        </div>

        {/* CONTENT */}

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity:0, x:-24 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:24 }}
              transition={{ duration:0.45, ease:[0.16,1,0.3,1] }}
            >

              <h3 className="text-2xl md:text-4xl font-bold text-paper mb-4 tracking-tight">
                {current.tagline}
              </h3>

              <p className="text-white/60 text-base md:text-lg leading-relaxed">
                {current.body}
              </p>

            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.key + "-video"}
              initial={{ opacity:0, scale:0.95 }}
              animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0, scale:0.95 }}
              transition={{ duration:0.45, ease:[0.16,1,0.3,1] }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-gold/15 to-crimson/15 blur-2xl rounded-[36px]" />
              <div className="relative rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                <video
                  className="w-full h-auto block"
                  src={current.video}
                  poster={current.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>

    </section>
  )
}
