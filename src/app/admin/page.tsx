"use client"

import {
  FileQuestion,
  CreditCard,
  BookOpen,
  GraduationCap
} from "lucide-react"

import {
  useAdminGuard
} from "../../hooks/useAdminGuard"

export default function
AdminPage(){

  useAdminGuard()

  const menus = [

    {

      title:
      "Questions",

      description:
      "Kelola soal tryout",

      href:
      "/admin/questions",

      icon:
      FileQuestion
    },

    {

      title:
      "Payments",

      description:
      "Verifikasi pembayaran",

      href:
      "/admin/payments",

      icon:
      CreditCard
    },

    {

      title:
      "Explanations",

      description:
      "Kelola pembahasan soal",

      href:
      "/admin/explanations",

      icon:
      BookOpen
    },

    {

      title:
      "Course",

      description:
      "Kelola materi kursus",

      href:
      "/admin/course",

      icon:
      GraduationCap
    }

  ]

  return (

    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-12">

          <h1 className="text-4xl font-bold mb-3">

            Admin Dashboard

          </h1>

          <p className="text-gray-400">

            Kelola seluruh sistem
            EL Germany dari sini.

          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {menus.map(
            menu=>{

              const Icon =
              menu.icon

              return (

                <button

                  key={
                    menu.title
                  }

                  onClick={()=>

                    window.location.href =
                    menu.href

                  }

                  className="group text-left bg-white/5 border border-white/10 rounded-[36px] p-8 hover:border-yellow-400/30 hover:bg-white/10 transition duration-300"

                >

                  <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-yellow-400/20 to-red-500/20 flex items-center justify-center mb-6">

                    <Icon
                      size={30}
                      className="text-yellow-400"
                    />

                  </div>

                  <h2 className="text-2xl font-bold mb-3 group-hover:text-yellow-400 transition">

                    {
                      menu.title
                    }

                  </h2>

                  <p className="text-gray-400 leading-relaxed">

                    {
                      menu.description
                    }

                  </p>

                </button>

              )
            }
          )}

        </div>

      </div>

    </main>
  )
}