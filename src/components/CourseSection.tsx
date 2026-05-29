"use client"

import {
  useEffect,
  useState
} from "react"

import { supabase }
from "../lib/supabase"

type Course = {

  id:number

  title:string

  description:string

  price:string

  duration:string

  level:string

  study_days:string

  study_time:string

  image_url:string

  is_active:boolean
}

export default function
CourseSection(){

  const [
    courses,
    setCourses
  ] =
  useState<Course[]>(
    []
  )

  useEffect(()=>{

    async function
    loadCourses(){

      const {
        data,
        error
      } =
      await supabase

      .from(
        "courses"
      )

      .select("*")

      .eq(
        "is_active",
        true
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      )

      if(error){

        console.log(
          error
        )

        return
      }

      setCourses(
        data || []
      )
    }

    loadCourses()

  },[])

  return (

    <section>

      <h1 className="text-4xl font-bold mb-3">

        Kursus Bahasa Jerman

      </h1>

      <p className="text-gray-400 mb-10">

        Pilih kursus terbaik
        sesuai kebutuhanmu

      </p>

      <div className="grid lg:grid-cols-2 gap-6">

        {courses.map(
          course=>{

            const whatsappMessage =

            encodeURIComponent(

              `Halo Kak, saya tertarik dengan kursus ${course.title} di EL Germany. Boleh tanya detailnya?`

            )

            const whatsappUrl =

              `https://wa.me/6281383720052?text=${whatsappMessage}`

            return (

              <div
                key={
                  course.id
                }
                className="bg-white/5 border border-white/10 rounded-[36px] overflow-hidden backdrop-blur-xl"
              >

                {course.image_url && (

                  <img
                    src={
                      course.image_url
                    }
                    alt={
                      course.title
                    }
                    className="w-full h-[220px] object-cover"
                  />

                )}

                <div className="p-8">

                  <div className="flex items-center justify-between mb-4">

                    <h2 className="text-3xl font-bold">

                      {
                        course
                        .title
                      }

                    </h2>

                    <span className="bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm">

                      {
                        course
                        .level
                      }

                    </span>

                  </div>

                  <p className="text-gray-400 mb-6">

                    {
                      course
                      .description
                    }

                  </p>

                  <div className="space-y-3 mb-8">

                    <p>

                      📅 Hari:
                      {" "}
                      {
                        course
                        .study_days
                      }

                    </p>

                    <p>

                      ⏰ Jam:
                      {" "}
                      {
                        course
                        .study_time
                      }

                    </p>

                    <p>

                      🕒 Durasi:
                      {" "}
                      {
                        course
                        .duration
                      }

                    </p>

                    <p className="text-yellow-400 font-bold text-2xl">

                      {
                        course
                        .price
                      }

                    </p>

                  </div>

                  <a
                    href={
                      whatsappUrl
                    }
                    target="_blank"
                    className="w-full block text-center bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold py-4 rounded-2xl hover:opacity-90 transition"
                  >

                    Daftar Sekarang

                  </a>

                </div>

              </div>

            )
          }
        )}

      </div>

    </section>
  )
}