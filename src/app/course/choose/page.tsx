"use client"

import Link from "next/link"
import { MonitorPlay, GraduationCap } from "lucide-react"

export default function ChooseCourseTypePage(){

  return (

    <main className="min-h-screen bg-paper text-ink flex items-center justify-center p-8">

      <div className="max-w-4xl w-full">

        <h1 className="text-5xl font-bold text-center mb-4">
          Pilih Jenis Course
        </h1>

        <p className="text-center text-mist mb-12">
          Mau belajar lewat video eksklusif, atau bimbingan langsung?
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* COURSE VIDEO */}

          <Link
            href="/course/video"
            className="group bg-surface border border-border rounded-3xl p-10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >

            <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center mb-6">
              <MonitorPlay className="text-ink" size={26} />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Course Video
            </h2>

            <p className="text-mist mb-8">
              Video pembelajaran eksklusif A1&ndash;B2, bisa ditonton
              kapan saja selama masa berlangganan aktif.
            </p>

            <span className="bg-gradient-to-r from-gold to-crimson text-ink px-6 py-3 rounded-xl font-bold inline-block group-hover:opacity-90 transition-opacity duration-200">
              Lihat Video Course
            </span>

          </Link>

          {/* COURSE OFFLINE */}

          <Link
            href="/course"
            className="group bg-surface border border-border rounded-3xl p-10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >

            <div className="w-14 h-14 rounded-2xl bg-crimson/15 flex items-center justify-center mb-6">
              <GraduationCap className="text-crimson" size={26} />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Course Offline
            </h2>

            <p className="text-mist mb-8">
              Belajar privat langsung dengan mentor, jadwal fleksibel,
              cocok untuk persiapan ujian intensif.
            </p>

            <span className="bg-gradient-to-r from-gold to-crimson text-ink px-6 py-3 rounded-xl font-bold inline-block group-hover:opacity-90 transition-opacity duration-200">
              Lihat Penawaran
            </span>

          </Link>

        </div>

      </div>

    </main>
  )
}
