"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function CTA(){

  return (

    <section className="px-6 md:px-16 py-24">

      <motion.div
        initial={{ opacity:0, y:50 }}
        whileInView={{ opacity:1, y:0 }}
        transition={{ duration:0.7 }}
        viewport={{ once:true }}
        className="max-w-6xl mx-auto relative overflow-hidden rounded-[40px] bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 p-[1px]"
      >

        <div className="bg-[#0F172A] rounded-[40px] px-10 py-20 text-center relative overflow-hidden">

          {/* GLOW */}

          <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-400/20 blur-3xl rounded-full"></div>

          <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-500/20 blur-3xl rounded-full"></div>

          <div className="relative z-10">

            <h2 className="text-4xl md:text-6xl font-bold leading-tight">

              Mulai Persiapan Goethe
              <span className="text-yellow-400">
                {" "}Sekarang
              </span>

            </h2>

            <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">

              Tingkatkan peluang lulus ujian Goethe
              dengan try out modern dan AI correction premium.

            </p>

          <a
href="/start"
className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 transition inline-block"
>
Mulai Sekarang
</a>

          </div>

        </div>

      </motion.div>

    </section>
  )
}