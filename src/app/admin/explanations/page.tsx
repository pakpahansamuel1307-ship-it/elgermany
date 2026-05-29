"use client"

import {
  useState
}
from "react"

import {
  supabase
}
from "../../../lib/supabase"

export default function
AdminExplanationPage(){

  const [
    form,
    setForm
  ] =
  useState({

    level:"a1",

    exam_set:1,

    module:"lesen",

    question_order:1,

    explanation_text:""
  })

  async function
  submit(){

    const {
      error
    } =

    await supabase

    .from(
      "tryout_explanations"
    )

    .insert(
      form
    )

    if(error){

      alert(
        error.message
      )

      return
    }

    alert(
      "Pembahasan berhasil"
    )
  }

  return (

    <main className="min-h-screen bg-[#050816] text-white p-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">

          Upload Pembahasan

        </h1>

        <div className="space-y-5">

          <select

            value={
              form.level
            }

            onChange={(
              e
            )=>

              setForm({

                ...form,

                level:
                e.target
                .value
              })
            }

            className="w-full bg-white/10 p-4 rounded-2xl"
          >

            <option value="a1">
              A1
            </option>

            <option value="a2">
              A2
            </option>

            <option value="b1">
              B1
            </option>

            <option value="b2">
              B2
            </option>

          </select>

          <input
            type="number"

            value={
              form.exam_set
            }

            onChange={(
              e
            )=>

              setForm({

                ...form,

                exam_set:
                Number(
                  e.target
                  .value
                )
              })
            }

            className="w-full bg-white/10 p-4 rounded-2xl"

            placeholder="Exam Set"
          />

          <select

            value={
              form.module
            }

            onChange={(
              e
            )=>

              setForm({

                ...form,

                module:
                e.target
                .value
              })
            }

            className="w-full bg-white/10 p-4 rounded-2xl"
          >

            <option value="lesen">
              Lesen
            </option>

            <option value="horen">
              Hören
            </option>

            <option value="schreiben">
              Schreiben
            </option>

            <option value="sprechen">
              Sprechen
            </option>

          </select>

          <input
            type="number"

            value={
              form
              .question_order
            }

            onChange={(
              e
            )=>

              setForm({

                ...form,

                question_order:
                Number(
                  e.target
                  .value
                )
              })
            }

            placeholder="Nomor Soal"

            className="w-full bg-white/10 p-4 rounded-2xl"
          />

          <textarea

            value={
              form
              .explanation_text
            }

            onChange={(
              e
            )=>

              setForm({

                ...form,

                explanation_text:
                e.target
                .value
              })
            }

            placeholder="Pembahasan"

            className="w-full min-h-[220px] bg-white/10 p-5 rounded-3xl"
          />

          <button

            onClick={
              submit
            }

            className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-black py-5 rounded-3xl font-bold"
          >

            Upload Pembahasan

          </button>

        </div>

      </div>

    </main>
  )
}