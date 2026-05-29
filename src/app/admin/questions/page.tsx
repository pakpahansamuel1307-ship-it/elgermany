"use client"

import { useState } from "react"
import { supabase } from "../../../lib/supabase"

export default function AdminQuestionsPage(){

  const [loading,setLoading] =
  useState(false)

  const [
globalAudioUrl,
setGlobalAudioUrl
] =
useState("")

  const [form,setForm] =
  useState({

    level:"a1",

    exam_set:1,

    module:"lesen",

    teil:1,

    question_order:1,

    question_type:
    "multiple_choice",

    question_text:"",

    text_block:"",

    text_block_image:"",

    option_a:"",
    option_b:"",
    option_c:"",
    option_d:"",
    option_e:"",
    option_f:"",
    option_g:"",
    option_h:"",
    option_0:"",

    option_a_image:"",
option_b_image:"",
option_c_image:"",
option_d_image:"",
option_e_image:"",
option_f_image:"",
option_g_image:"",
option_h_image:"",
option_0_image:"",

    correct_answer:"",

    image_url:"",
    image_url_2:"",
    audio_url:""
  })

  function handleChange(
    key:string,
    value:any
  ){

    setForm(prev=>({

      ...prev,

      [key]:
      value
    }))
  }

  async function submitQuestion(){

    try{

      setLoading(true)

      const {
        error
      } =
      await supabase

      .from(
        "exam_questions"
      )

      .insert({

        level:
        form.level,

        exam_set:
        form.exam_set,

        module:
        form.module,

        teil:
        form.teil,

        question_order:
        form.question_order,

        question_type:
        form.question_type,

        question_text:
        form.question_text,

        text_block:
        form.text_block,

        text_block_image:
        form.text_block_image,

        option_a:
        form.option_a,

        option_b:
        form.option_b,

        option_c:
        form.option_c,

        option_d:
        form.option_d,

        option_e:
        form.option_e,

        option_f:
        form.option_f,

        option_g:
        form.option_g,

        option_h:
        form.option_h,

        option_0:
        form.option_0,

        option_a_image:
form.option_a_image,

option_b_image:
form.option_b_image,

option_c_image:
form.option_c_image,

option_d_image:
form.option_d_image,

option_e_image:
form.option_e_image,

option_f_image:
form.option_f_image,

option_g_image:
form.option_g_image,

option_h_image:
form.option_h_image,

option_0_image:
form.option_0_image,

        correct_answer:
        form.correct_answer,

        image_url:
        form.image_url,

        image_url_2:
        form.image_url_2,

        audio_url:

form.module
=== "horen"

?

globalAudioUrl

:

form.audio_url
      })

      if(error){

        console.log(
          error
        )

        alert(
          JSON.stringify(
            error
          )
        )

        return
      }

      alert(
        "Soal berhasil diupload"
      )

      setForm(prev=>({

        ...prev,

        question_order:
        prev.question_order + 1,

        question_text:"",

        text_block:"",

        text_block_image:"",

        option_a:"",
        option_b:"",
        option_c:"",
        option_d:"",
        option_e:"",
        option_f:"",
        option_g:"",
        option_h:"",
        option_0:"",

        option_a_image:"",
option_b_image:"",
option_c_image:"",
option_d_image:"",
option_e_image:"",
option_f_image:"",
option_g_image:"",
option_h_image:"",
option_0_image:"",

        correct_answer:"",

        image_url:"",
        image_url_2:"",
        audio_url:
prev.module
=== "horen"

?

globalAudioUrl

:

""
      }))

    }catch(error){

      console.log(
        error
      )

    }finally{

      setLoading(false)
    }
  }

const isMultipleChoice =

  form.question_type ===
  "multiple_choice"

const isMatchingAds =

  form.question_type ===
  "matching_ads"

const isWriting =

  form.question_type ===
  "writing"

const isSpeaking =

  form.module ===
  "sprechen"

const isTrueFalse =

  form.question_type ===
  "true_false"

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">

          Upload Soal Tryout

        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <select
            value={form.level}
            onChange={(e)=>
              handleChange(
                "level",
                e.target.value
              )
            }
            className="bg-white/10 p-4 rounded-2xl"
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

            onChange={(e)=>
              handleChange(
                "exam_set",

                Number(
                  e.target.value
                )
              )
            }

            placeholder="Set"

            className="bg-white/10 p-4 rounded-2xl"
          />

          <select
            value={form.module}

            onChange={(e)=>
              handleChange(
                "module",
                e.target.value
              )
            }

            className="bg-white/10 p-4 rounded-2xl"
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
              form.teil
            }

            onChange={(e)=>
              handleChange(
                "teil",

                Number(
                  e.target.value
                )
              )
            }

            placeholder="Teil"

            className="bg-white/10 p-4 rounded-2xl"
          />

          <input
            type="number"

            value={
              form.question_order
            }

            onChange={(e)=>
              handleChange(
                "question_order",

                Number(
                  e.target.value
                )
              )
            }

            placeholder="Nomor soal"

            className="bg-white/10 p-4 rounded-2xl"
          />

          <select
            value={
              form.question_type
            }

            onChange={(e)=>
              handleChange(
                "question_type",
                e.target.value
              )
            }

            className="bg-white/10 p-4 rounded-2xl"
          >

            <option value="multiple_choice">
              Multiple Choice
            </option>

            <option value="true_false">
              Richtig / Falsch
            </option>

            <option value="matching_ads">
              Matching Ads
            </option>

            <option value="writing">
              Writing
            </option>

            <option value="speaking">
              Speaking
            </option>

            <option value="vorstellen">
  A1 Vorstellen
</option>

<option value="bitte">
  A1 Bitte
</option>

<option value="dialog">
  Dialog
</option>

<option value="presentation">
  Presentation
</option>

<option value="discussion">
  Discussion
</option>

<option value="termin">
  Termin Planung
</option>

          </select>

        </div>

        <textarea
          placeholder="Question Text"

          value={
            form.question_text
          }

          onChange={(e)=>
            handleChange(
              "question_text",
              e.target.value
            )
          }

          className="w-full mt-6 min-h-[180px] bg-white/10 rounded-3xl p-5"
        />

        <textarea
          placeholder="Text Block (artikel panjang / email / iklan)"

          

          value={
            form.text_block
          }

          onChange={(e)=>
            handleChange(
              "text_block",
              e.target.value
            )
          }

          className="w-full mt-6 min-h-[280px] bg-white/10 rounded-3xl p-5"
        />

        <input
  placeholder="Text Block Image URL"

  value={
    form.text_block_image
  }

  onChange={(e)=>
    handleChange(
      "text_block_image",
      e.target.value
    )
  }

  className="w-full mt-6 bg-white/10 p-4 rounded-2xl"
/>

{form.text_block_image && (

  <img
    src={
      form.text_block_image
    }

    alt="preview"

    className="w-full rounded-3xl mt-5 max-h-[700px] object-contain bg-white/5 p-3"
  />

)}

        {(isMultipleChoice || isMatchingAds) && (

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          {(isMultipleChoice || isMatchingAds) && ( <>

          <input placeholder="Option A"
            value={form.option_a}
            onChange={(e)=>
              handleChange(
                "option_a",
                e.target.value
              )
            }
            className="bg-white/10 p-4 rounded-2xl"
          />

          <input placeholder="Option B"
            value={form.option_b}
            onChange={(e)=>
              handleChange(
                "option_b",
                e.target.value
              )
            }
            className="bg-white/10 p-4 rounded-2xl"
          />

          <input placeholder="Option C"
            value={form.option_c}
            onChange={(e)=>
              handleChange(
                "option_c",
                e.target.value
              )
            }
            className="bg-white/10 p-4 rounded-2xl"
          />

</>

          )}

          {isMatchingAds && ( <> 

          <input placeholder="Option D"
            value={form.option_d}
            onChange={(e)=>
              handleChange(
                "option_d",
                e.target.value
              )
            }
            className="bg-white/10 p-4 rounded-2xl"
          />

          <input placeholder="Option E"
            value={form.option_e}
            onChange={(e)=>
              handleChange(
                "option_e",
                e.target.value
              )
            }
            className="bg-white/10 p-4 rounded-2xl"
          />

          <input placeholder="Option F"
            value={form.option_f}
            onChange={(e)=>
              handleChange(
                "option_f",
                e.target.value
              )
            }
            className="bg-white/10 p-4 rounded-2xl"
          />

          <input placeholder="Option G"
            value={form.option_g}
            onChange={(e)=>
              handleChange(
                "option_g",
                e.target.value
              )
            }
            className="bg-white/10 p-4 rounded-2xl"
          />

          <input placeholder="Option H"
            value={form.option_h}
            onChange={(e)=>
              handleChange(
                "option_h",
                e.target.value
              )
            }
            className="bg-white/10 p-4 rounded-2xl"
          />

          <input placeholder="Option 0 (tidak cocok)"
            value={form.option_0}
            onChange={(e)=>
              handleChange(
                "option_0",
                e.target.value
              )
            }
            className="bg-white/10 p-4 rounded-2xl"
          />

        
        </>
          )}

          <input
  placeholder="Option A Image URL"
  value={form.option_a_image}
  onChange={(e)=>
    handleChange(
      "option_a_image",
      e.target.value
    )
  }
  className="bg-white/10 p-4 rounded-2xl"
/>

{form.option_a_image && (

  <img
    src={
      form.option_a_image
    }

    alt="preview"

    className="w-full rounded-2xl max-h-[220px] object-contain bg-white/5 p-3"
  />

)}

<input
  placeholder="Option B Image URL"
  value={form.option_b_image}
  onChange={(e)=>
    handleChange(
      "option_b_image",
      e.target.value
    )
  }
  className="bg-white/10 p-4 rounded-2xl"
/>

{form.option_b_image && (

  <img
    src={
      form.option_b_image
    }

    alt="preview"

    className="w-full rounded-2xl max-h-[220px] object-contain bg-white/5 p-3"
  />

)}

<input
  placeholder="Option C Image URL"
  value={form.option_c_image}
  onChange={(e)=>
    handleChange(
      "option_c_image",
      e.target.value
    )
  }
  className="bg-white/10 p-4 rounded-2xl"
/>

{form.option_c_image && (

  <img
    src={
      form.option_c_image
    }

    alt="preview"

    className="w-full rounded-2xl max-h-[220px] object-contain bg-white/5 p-3"
  />

)}

<input
  placeholder="Option D Image URL"
  value={form.option_d_image}
  onChange={(e)=>
    handleChange(
      "option_d_image",
      e.target.value
    )
  }
  className="bg-white/10 p-4 rounded-2xl"
/>

{form.option_d_image && (

  <img
    src={
      form.option_d_image
    }

    alt="preview"

    className="w-full rounded-2xl max-h-[220px] object-contain bg-white/5 p-3"
  />

)}

<input
  placeholder="Option E Image URL"
  value={form.option_e_image}
  onChange={(e)=>
    handleChange(
      "option_e_image",
      e.target.value
    )
  }
  className="bg-white/10 p-4 rounded-2xl"
/>

{form.option_e_image && (

  <img
    src={
      form.option_e_image
    }

    alt="preview"

    className="w-full rounded-2xl max-h-[220px] object-contain bg-white/5 p-3"
  />

)}

<input
  placeholder="Option F Image URL"
  value={form.option_f_image}
  onChange={(e)=>
    handleChange(
      "option_f_image",
      e.target.value
    )
  }
  className="bg-white/10 p-4 rounded-2xl"
/>

{form.option_f_image && (

  <img
    src={
      form.option_f_image
    }

    alt="preview"

    className="w-full rounded-2xl max-h-[220px] object-contain bg-white/5 p-3"
  />

)}

<input
  placeholder="Option G Image URL"
  value={form.option_g_image}
  onChange={(e)=>
    handleChange(
      "option_g_image",
      e.target.value
    )
  }
  className="bg-white/10 p-4 rounded-2xl"
/>

{form.option_g_image && (

  <img
    src={
      form.option_g_image
    }

    alt="preview"

    className="w-full rounded-2xl max-h-[220px] object-contain bg-white/5 p-3"
  />

)}

<input
  placeholder="Option H Image URL"
  value={form.option_h_image}
  onChange={(e)=>
    handleChange(
      "option_h_image",
      e.target.value
    )
  }
  className="bg-white/10 p-4 rounded-2xl"
/>

{form.option_h_image && (

  <img
    src={
      form.option_h_image
    }

    alt="preview"

    className="w-full rounded-2xl max-h-[220px] object-contain bg-white/5 p-3"
  />

)}

<input
  placeholder="Option 0 Image URL"
  value={form.option_0_image}
  onChange={(e)=>
    handleChange(
      "option_0_image",
      e.target.value
    )
  }
  className="bg-white/10 p-4 rounded-2xl"
/>

{form.option_0_image && (

  <img
    src={
      form.option_0_image
    }

    alt="preview"

    className="w-full rounded-2xl max-h-[220px] object-contain bg-white/5 p-3"
  />

)}

        </div>

        )}
        
        {form.module ===
"horen" && (

  <div className="mt-6 bg-white/5 p-6 rounded-3xl">

    <p className="font-bold mb-4">

      Upload Audio Hören
      (1x untuk semua soal)

    </p>

    <input
      type="file"

      accept="audio/*"

      onChange={async (
        e
      )=>{

        const file =
        e.target
        .files?.[0]

        if(!file)
        return

        const fileName =

          `${Date.now()}-${file.name}`

        const {
          error
        } =

        await supabase
        .storage

        .from(
          "audio"
        )

        .upload(
          fileName,
          file
        )

        if(error){

          alert(
            error.message
          )

          return
        }

        const {
          data
        } =

        supabase
        .storage

        .from(
          "audio"
        )

        .getPublicUrl(
          fileName
        )

        setGlobalAudioUrl(
          data.publicUrl
        )

        alert(
          "Audio berhasil diupload"
        )
      }}
    />

    {globalAudioUrl && (

      <audio
        controls

        src={
          globalAudioUrl
        }

        className="w-full mt-5"
      />

    )}

  </div>

)}

       {form.module !==
"sprechen" && (

  <input
    placeholder="Correct Answer"

    value={
      form.correct_answer
    }

    onChange={(e)=>
      handleChange(
        "correct_answer",
        e.target.value
      )
    }

    className="w-full mt-6 bg-white/10 p-4 rounded-2xl"
  />

)}
        
{isSpeaking && (

  <div className="space-y-4 mt-6">

    <input
      placeholder="Image URL"

      value={
        form.image_url
      }

      onChange={(e)=>
        handleChange(
          "image_url",
          e.target.value
        )
      }

      className="w-full bg-white/10 p-4 rounded-2xl"
    />

    <input
      placeholder="Image URL 2"

      value={
        form.image_url_2 || ""
      }

      onChange={(e)=>
        handleChange(
          "image_url_2",
          e.target.value
        )
      }

      className="w-full bg-white/10 p-4 rounded-2xl"
    />

    {form.module ===
"horen" && (

  <div className="mt-6">

    <p className="mb-3 font-bold">

      Upload Audio Hören
      (1x untuk semua soal)

    </p>

    <input
      type="file"
      accept="audio/*"

      onChange={async (
        e
      )=>{

        const file =
        e.target
        .files?.[0]

        if(!file)
        return

        const fileName =

          `${Date.now()}-${file.name}`

        const {
          error
        } =

        await supabase
        .storage

        .from(
          "audio"
        )

        .upload(
          fileName,
          file
        )

        if(error){

          alert(
            error.message
          )

          return
        }

        const {
          data
        } =

        supabase
        .storage

        .from(
          "audio"
        )

        .getPublicUrl(
          fileName
        )

        setGlobalAudioUrl(
          data.publicUrl
        )

        handleChange(
          "audio_url",
          data.publicUrl
        )

        alert(
          "Audio berhasil diupload"
        )
      }}
    />

    {globalAudioUrl && (

      <audio
        controls
        src={
          globalAudioUrl
        }

        className="w-full mt-5"
      />

    )}

  </div>

)}

  </div>

)}

        <button
          onClick={
            submitQuestion
          }

          disabled={
            loading
          }

          className="mt-10 w-full bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold py-5 rounded-3xl"
        >

          {

            loading

            ?

            "Uploading..."

            :

            "Upload Soal"
          }

        </button>

      </div>

    </main>
  )
}