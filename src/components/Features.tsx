"use client"

import { motion } from "framer-motion"

import {
  BookOpen,
  Brain,
  GraduationCap,
} from "lucide-react"

export default function Features(){

  return (

    <section id="features"className="relative z-10 px-6 md:px-16 py-24">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-4xl md:text-5xl font-bold">

            Kenapa Memilih
            <span className="text-yellow-400">
              {" "}EL Germany?
            </span>

          </h2>

          <p className="text-gray-400 mt-5 text-lg">

            Platform try out bahasa Jerman modern
            dengan pengalaman premium.

          </p>

        </div>

        <motion.div
          initial={{ opacity:0, y:50 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.7 }}
          viewport={{ once:true }}
          className="grid md:grid-cols-3 gap-8"
        >

          {/* CARD 1 */}

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition-all duration-300">

            <div className="w-14 h-14 rounded-2xl bg-yellow-400/20 flex items-center justify-center mb-6">

              <BookOpen className="text-yellow-400" />

            </div>

            <h3 className="text-2xl font-bold mb-4">

              Try Out Realistis

            </h3>

            <p className="text-gray-400 leading-relaxed">

              Simulasi ujian Goethe yang dirancang
              menyerupai ujian asli.

            </p>

          </div>

          {/* CARD 2 */}

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition-all duration-300">

            <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">

              <Brain className="text-red-400" />

            </div>

            <h3 className="text-2xl font-bold mb-4">

              AI Correction

            </h3>

            <p className="text-gray-400 leading-relaxed">

              Penilaian schreiben dan sprechen
              otomatis menggunakan AI modern.

            </p>

          </div>

          {/* CARD 3 */}

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition-all duration-300">

            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6">

              <GraduationCap className="text-green-400" />

            </div>

            <h3 className="text-2xl font-bold mb-4">

              Video Pembahasan

            </h3>

            <p className="text-gray-400 leading-relaxed">

              Akses video pembahasan eksklusif
              setelah menyelesaikan try out.

            </p>

          </div>

        </motion.div>

      </div>

    </section>
  )
}