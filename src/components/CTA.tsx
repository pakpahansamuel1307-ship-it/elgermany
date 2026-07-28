"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function CTA(){

  return (

    <section className="px-6 md:px-16 py-20 md:py-28">

      <motion.div
        initial={{ opacity:0, y:32 }}
        whileInView={{ opacity:1, y:0 }}
        transition={{ duration:0.6, ease:"easeOut" }}
        viewport={{ once:true, margin:"-80px" }}
        className="max-w-6xl mx-auto relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-gradient-to-br from-gold via-gold-soft to-crimson px-8 md:px-10 py-16 md:py-24 text-center"
      >

        {/* subtle texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        <div className="relative z-10">

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight tracking-tight text-ink">
            Start Goethe Preparation Now
          </h2>

          <p className="text-ink/70 text-base md:text-lg mt-6 max-w-2xl mx-auto">
            Upgrade your chances of passing the Goethe exam
            with modern practice tests and premium AI correction.
          </p>

          <motion.a
            href="/start"
            whileHover={{ scale:1.05, y:-3 }}
            whileTap={{ scale:0.98 }}
            transition={{ type:"spring", stiffness:400, damping:15 }}
            className="mt-10 bg-ink text-paper px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2 shadow-xl"
          >
            Start now
            <ArrowRight size={18} />
          </motion.a>

        </div>

      </motion.div>

    </section>
  )
}
