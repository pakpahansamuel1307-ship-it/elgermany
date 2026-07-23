"use client"

import { motion } from "framer-motion"

export default function CTA(){

  return (

    <section className="px-6 md:px-16 py-20 md:py-28">

      <motion.div
        initial={{ opacity:0, y:32 }}
        whileInView={{ opacity:1, y:0 }}
        transition={{ duration:0.6, ease:"easeOut" }}
        viewport={{ once:true, margin:"-80px" }}
        className="max-w-6xl mx-auto relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-gradient-to-r from-gold via-orange-400 to-crimson p-[1px]"
      >

        <div className="bg-ink rounded-[31px] md:rounded-[39px] px-8 md:px-10 py-16 md:py-20 text-center relative overflow-hidden">

          {/* GLOW */}

          <div className="pointer-events-none absolute top-0 left-0 w-72 h-72 bg-gold/15 blur-3xl rounded-full"></div>

          <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 bg-crimson/15 blur-3xl rounded-full"></div>

          <div className="relative z-10">

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight tracking-tight text-paper">
              Start Goethe Preparation
              <span className="text-gold">{" "}Now</span>
            </h2>

            <p className="text-mist text-base md:text-lg mt-6 max-w-2xl mx-auto">
              Upgrade your chances of passing the Goethe exam
              with modern practice tests and premium AI correction.
            </p>

            <a
              href="/start"
              className="mt-10 bg-gold text-ink px-8 py-3.5 rounded-xl font-bold hover:bg-gold-soft transition-colors duration-200 inline-block"
            >
              Start now
            </a>

          </div>

        </div>

      </motion.div>

    </section>
  )
}
