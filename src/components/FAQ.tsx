"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqData = [
  {
    question: "Is the tryout similar to the actual Goethe exam?",
    answer: "Yes, the questions and structure of the tryout are designed to closely resemble the actual Goethe exam.",
  },
  {
    question: "Is AI correction automatic?",
    answer: "Yes, Schreiben and Sprechen are automatically assessed using modern AI.",
  },
  {
    question: "Are the explanation files free?",
    answer: "Explanation files are only available to premium users..",
  },
  {
    question: "Is a speaking simulation available?",
    answer: "Yes, AI-powered speaking simulations are available",
  },
]

export default function FAQ(){

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (

    <section id="faq" className="px-6 md:px-16 py-20 md:py-28">

      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-14 md:mb-16">

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Frequently Asked
            <span className="text-crimson">{" "}Questions</span>
          </h2>

          <p className="text-mist mt-5 text-base md:text-lg">
            Frequently Asked Questions
          </p>

        </div>

        <div className="space-y-4">

          {faqData.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={faq.question}
                className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm"
              >

                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-6 md:p-7 text-left"
                >

                  <span className="text-base md:text-lg font-semibold text-ink">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`shrink-0 text-mist transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-crimson" : ""
                    }`}
                    size={20}
                  />

                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <div className="px-6 md:px-7 pb-6 md:pb-7 text-mist leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )
          })}

        </div>

      </div>

    </section>
  )
}
