"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const links = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "#faq" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-ink/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="px-6 md:px-16 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/logo.png"
              alt="EL Germany"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <span className="text-xl md:text-2xl font-bold tracking-tight text-paper">
              EL<span className="text-gold">Germany</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-9 text-sm font-medium text-white/60">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-gold transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* DESKTOP BUTTON */}
            <a
              href="/login"
              className="hidden sm:inline-flex bg-gradient-to-r from-gold to-crimson text-ink px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity duration-200"
            >
              Login
            </a>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 bg-white/5 text-paper"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden mt-4 bg-ink/95 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-xl"
            >
              <div className="flex flex-col gap-1 text-white/60">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-xl hover:bg-white/5 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}

                <a
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="mt-2 bg-gradient-to-r from-gold to-crimson text-ink text-center py-3 rounded-xl font-bold"
                >
                  Login
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
