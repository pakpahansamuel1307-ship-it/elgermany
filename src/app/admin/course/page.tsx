"use client"

import {
  useState
} from "react"

import { supabase }
from "../../../lib/supabase"

export default function
AdminCoursePage(){

  const [
    loading,
    setLoading
  ] =
  useState(false)

  const [form,setForm]
  =
  useState({

    title:"",

    description:"",

    price:0,

    duration:"",

    level:"a1",

    study_days:"",

    study_time:"",

    image_url:"",

    is_active:true
  })

  function
  handleChange(
    key:string,
    value:any
  ){

    setForm(
      prev=>({

        ...prev,

        [key]:
        value
      })
    )
  }

  async function
  submitCourse(){

    try{

      setLoading(
        true
      )

      const {
        error
      } =
      await supabase

      .from(
        "courses"
      )

      .insert({

        title:
        form.title,

        description:
        form.description,

        price:
        form.price,

        duration:
        form.duration,

        level:
        form.level,

        study_days:
        form.study_days,

        study_time:
        form.study_time,

        image_url:
        form.image_url,

        is_active:
        form.is_active
      })

      if(error){

        console.log(
          error
        )

        alert(
          error.message
        )

        return
      }

      alert(
        "Course berhasil diupload"
      )

      setForm({

        title:"",

        description:"",

        price:0,

        duration:"",

        level:"a1",

        study_days:"",

        study_time:"",

        image_url:"",

        is_active:true
      })

    }catch(error){

      console.log(
        error
      )

    }finally{

      setLoading(
        false
      )
    }
  }

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">

          Upload Course

        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <input
            placeholder="Judul Course"

            value={
              form.title
            }

            onChange={(e)=>
              handleChange(
                "title",
                e.target.value
              )
            }

            className="bg-white/10 p-4 rounded-2xl"
          />

          <select

            value={
              form.level
            }

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

            placeholder="Harga"

            value={
              form.price
            }

            onChange={(e)=>
              handleChange(
                "price",
                Number(
                  e.target.value
                )
              )
            }

            className="bg-white/10 p-4 rounded-2xl"
          />

          <input
            placeholder="Durasi (contoh: 8 Minggu)"

            value={
              form.duration
            }

            onChange={(e)=>
              handleChange(
                "duration",
                e.target.value
              )
            }

            className="bg-white/10 p-4 rounded-2xl"
          />

          <input
            placeholder="Hari Belajar"

            value={
              form.study_days
            }

            onChange={(e)=>
              handleChange(
                "study_days",
                e.target.value
              )
            }

            className="bg-white/10 p-4 rounded-2xl"
          />

          <input
            placeholder="Jam Belajar"

            value={
              form.study_time
            }

            onChange={(e)=>
              handleChange(
                "study_time",
                e.target.value
              )
            }

            className="bg-white/10 p-4 rounded-2xl"
          />

        </div>

        <textarea
          placeholder="Deskripsi Course"

          value={
            form.description
          }

          onChange={(e)=>
            handleChange(
              "description",
              e.target.value
            )
          }

          className="w-full mt-6 min-h-[220px] bg-white/10 rounded-3xl p-5"
        />

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

          className="w-full mt-6 bg-white/10 p-4 rounded-2xl"
        />

        {form.image_url && (

          <img
            src={
              form.image_url
            }

            alt="preview"

            className="w-full rounded-3xl mt-6 max-h-[500px] object-cover"
          />

        )}

        <div className="mt-8 flex items-center gap-3">

          <input
            type="checkbox"

            checked={
              form.is_active
            }

            onChange={(e)=>
              handleChange(
                "is_active",
                e.target.checked
              )
            }
          />

          <p>

            Course aktif

          </p>

        </div>

        <button
          onClick={
            submitCourse
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

            "Upload Course"
          }

        </button>

      </div>

    </main>
  )
}