"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqData = [
  {
    question:"Is the tryout similar to the actual Goethe exam?",
    answer:"Yes, the questions and structure of the tryout are designed to closely resemble the actual Goethe exam."
  },

  {
    question:"Is AI correction automatic?",
    answer:"Yes, Schreiben and Sprechen are automatically assessed using modern AI."
  },

  {
    question:"Are the explanation files free?",
    answer:"Explanation files are only available to premium users.."
  },

  {
    question:"Is a speaking simulation available?",
    answer:"Yes, AI-powered speaking simulations are available"
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

            Frequently Asked Questions

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