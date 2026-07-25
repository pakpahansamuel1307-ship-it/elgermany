"use client"

import { motion } from "framer-motion"

import {
  BookOpen,
  Brain,
  GraduationCap,
} from "lucide-react"

const features = [
  {
    icon: BookOpen,
    tint: "bg-gold/20 text-ink",
    title: "Realistic Try Out",
    body: "Goethe exam simulation designed to resemble the actual exam.",
  },
  {
    icon: Brain,
    tint: "bg-crimson/15 text-crimson",
    title: "AI Correction",
    body: "Automatic assessment of Schreiben and Sprechen using modern AI.",
  },
  {
    icon: GraduationCap,
    tint: "bg-green-500/15 text-green-600",
    title: "Video Explanations",
    body: "Exclusive file explanations after completing the try out.",
  },
]

export default function Features(){

  return (

    <section id="features" className="relative z-10 px-6 md:px-16 py-20 md:py-28">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14 md:mb-16">

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">

            Why Choose
            <span className="text-crimson">
              {" "}EL Germany?
            </span>

          </h2>

          <p className="text-mist mt-5 text-base md:text-lg">

            Modern German language practice platform
            with a premium experience.

          </p>

        </div>

        <motion.div
          initial={{ opacity:0, y:32 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease:"easeOut" }}
          viewport={{ once:true, margin:"-80px" }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
        >

          {features.map((feature) => (

            <div
              key={feature.title}
              className="bg-surface border border-border rounded-2xl p-7 md:p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.tint}`}>
                <feature.icon size={22} />
              </div>

              <h3 className="text-xl font-bold mb-3 text-ink">
                {feature.title}
              </h3>

              <p className="text-mist leading-relaxed text-sm md:text-base">
                {feature.body}
              </p>

            </div>

          ))}

        </motion.div>

      </div>

    </section>
  )
}
