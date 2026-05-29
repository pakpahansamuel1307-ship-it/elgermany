"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqData = [
  {
    question:"Apakah try out mirip ujian Goethe asli?",
    answer:"Ya, soal dan struktur try out dibuat menyerupai ujian Goethe asli."
  },

  {
    question:"Apakah AI correction otomatis?",
    answer:"Ya, schreiben dan sprechen akan dinilai otomatis menggunakan AI modern."
  },

  {
    question:"Apakah video pembahasan gratis?",
    answer:"Video pembahasan hanya tersedia untuk pengguna premium."
  },

  {
    question:"Apakah tersedia speaking simulation?",
    answer:"Ya, tersedia simulasi sprechen menggunakan AI."
  },
]

export default function FAQ(){

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (

    <section id="faq" className="px-6 md:px-16 py-24">

      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">

            Frequently Asked
            <span className="text-yellow-400">
              {" "}Questions
            </span>

          </h2>

          <p className="text-gray-400 mt-5 text-lg">

            Pertanyaan yang paling sering ditanyakan.

          </p>

        </div>

        <div className="space-y-5">

          {faqData.map((faq,index)=>(

            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
            >

              <button
                onClick={()=>setOpenIndex(openIndex===index ? null : index)}
                className="w-full flex items-center justify-between p-7 text-left"
              >

                <span className="text-lg font-semibold">

                  {faq.question}

                </span>

                <ChevronDown
                  className={`transition duration-300 ${
                    openIndex===index ? "rotate-180" : ""
                  }`}
                />

              </button>

              <AnimatePresence>

                {openIndex===index && (

                  <motion.div
                    initial={{ height:0, opacity:0 }}
                    animate={{ height:"auto", opacity:1 }}
                    exit={{ height:0, opacity:0 }}
                    transition={{ duration:0.3 }}
                  >

                    <div className="px-7 pb-7 text-gray-400 leading-relaxed">

                      {faq.answer}

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          ))}

        </div>

      </div>

    </section>
  )
}