"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar(){

  const [open,setOpen] = useState(false)

  return (

    <nav className="relative z-50 px-6 md:px-16 py-6">

      <div className="flex items-center justify-between">

        {/* LOGO */}

        <div className="flex items-center gap-3">

          <img
            src="/logo.png"
            alt="EL Germany"
            className="w-12 h-12 object-contain"
          />

          <h1 className="text-2xl font-bold">

            EL
            <span className="text-yellow-400">
              Germany
            </span>

          </h1>

        </div>

        {/* DESKTOP MENU */}

        <div className="hidden md:flex gap-8 text-sm text-gray-300">

         <a
href="#"
onClick={() =>
window.scrollTo({
top: 0,
behavior: "smooth"
})
}
className="hover:text-yellow-400 transition"
>
Home
</a>

          <a
href="#features"
className="hover:text-yellow-400 transition"
>
Features
</a>

       <a
href="/pricing"
className="hover:text-yellow-400 transition"
>
Pricing
</a>

         <a
href="#faq"
className="hover:text-yellow-400 transition"
>
FAQ
</a>

        </div>

        {/* DESKTOP BUTTON */}

        <a
href="/login"
className="bg-yellow-400 text-black px-5 py-2 rounded-xl font-semibold"
>
Login
</a>

        {/* MOBILE BUTTON */}

        <button
          onClick={()=>setOpen(!open)}
          className="md:hidden"
        >

          {open ? <X /> : <Menu />}

        </button>

      </div>

      {/* MOBILE MENU */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{ opacity:0, y:-20 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-20 }}
            transition={{ duration:0.3 }}
            className="md:hidden mt-6 bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
          >

            <div className="flex flex-col gap-5 text-gray-300">

              <a href="#">Home</a>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">FAQ</a>

              <button className="bg-yellow-400 text-black py-3 rounded-2xl font-bold mt-3">

                Login

              </button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </nav>
  )
}