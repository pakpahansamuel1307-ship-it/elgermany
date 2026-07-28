"use client"

import { motion } from "framer-motion"

export default function DashboardHero(){

  return (

    <motion.div
      initial={{ opacity:0, y:30 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
      className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-gold via-gold-soft to-crimson p-[1px]"
    >

      <div className="bg-ink rounded-[40px] p-10 md:p-14 relative overflow-hidden">

        {/* GLOW */}

        <div className="absolute top-0 left-0 w-72 h-72 bg-gold/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-72 h-72 bg-crimson/20 blur-3xl rounded-full"></div>

        <div className="relative z-10">

          <p className="text-gold font-semibold mb-4">

            Willkommen zur&uuml;ck &#128075;

          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-paper">

            Ready to Continue
            <br />
            Goethe Preparation?

          </h1>

          <p className="text-white/50 text-lg mt-6 max-w-2xl">

           Take premium tryouts,
            access file explanations, 
            and increase your chances of passing.

          </p>

          <motion.button
            whileHover={{ scale:1.04, y:-2 }}
            whileTap={{ scale:0.98 }}
            transition={{ type:"spring", stiffness:400, damping:15 }}
            onClick={()=>{
              window.location.href = "/start"
            }}
            className="mt-10 bg-gold text-ink px-8 py-5 rounded-2xl font-bold shadow-lg shadow-gold/10"
          >

            Start Practice Test

          </motion.button>

        </div>

      </div>

    </motion.div>
  )
}