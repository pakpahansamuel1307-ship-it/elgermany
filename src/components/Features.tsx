"use client"

import { motion } from "framer-motion"

import {
  Brain,
  Video,
  TrendingUp,
  Users2,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    tint: "bg-gold/15 text-gold",
    title: "AI Correction",
    body: "Schreiben and Sprechen graded automatically by AI, with feedback that goes beyond right or wrong.",
  },
  {
    icon: Video,
    tint: "bg-crimson/15 text-crimson",
    title: "Video Explanations",
    body: "Exclusive walkthroughs after every try out, so you understand exactly where you lost points.",
  },
  {
    icon: TrendingUp,
    tint: "bg-green-500/15 text-green-400",
    title: "Progress Tracking",
    body: "Every attempt, every score, tracked over time so you always know how close you are to exam-ready.",
  },
  {
    icon: Users2,
    tint: "bg-blue-500/15 text-blue-400",
    title: "Online & Offline Courses",
    body: "Learn your way \u2014 self-paced video courses, or live guided classes with a mentor.",
  },
]

export default function Features(){

  return (

    <section id="features" className="relative px-6 md:px-16 py-20 md:py-32">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14 md:mb-16">

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-paper">
            Why Choose
            <span className="bg-gradient-to-r from-gold to-crimson bg-clip-text text-transparent">{" "}EL Germany?</span>
          </h2>

          <p className="text-white/50 mt-5 text-base md:text-lg">
            Modern German language practice, built with AI at its core.
          </p>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">

          {features.map((feature, index) => (

            <motion.div
              key={feature.title}
              initial={{ opacity:0, y:32 }}
              whileInView={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay: index * 0.08, ease:"easeOut" }}
              viewport={{ once:true, margin:"-80px" }}
              whileHover={{ y:-6 }}
              className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-7 md:p-8 hover:bg-white/[0.08] hover:border-white/20 transition-colors duration-300"
            >

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.tint}`}>
                <feature.icon size={22} />
              </div>

              <h3 className="text-xl font-bold mb-3 text-paper">
                {feature.title}
              </h3>

              <p className="text-white/50 leading-relaxed text-sm md:text-base">
                {feature.body}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  )
}
