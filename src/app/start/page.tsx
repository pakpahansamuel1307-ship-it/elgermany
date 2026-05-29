export default function StartPage() {

  return (

    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-8">

      <div className="max-w-6xl w-full">

        <h1 className="text-5xl font-bold text-center mb-4">

          Pilih Jenis Belajar

        </h1>

        <p className="text-center text-gray-400 mb-12">

          Pilih metode belajar yang sesuai kebutuhanmu

        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {/* MODUL TERPISAH */}

          <div className="bg-white/10 border border-white/10 rounded-3xl p-10 hover:scale-105 transition-all duration-300">

            <h2 className="text-3xl font-bold mb-4">

              Modul Terpisah

            </h2>

            <p className="text-gray-400 mb-8">

              Beli modul Lesen,
              Hören, Schreiben,
              atau Sprechen secara terpisah.

            </p>

            <a
              href="/modules"
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold inline-block"
            >

              Pilih Modul

            </a>

          </div>

          {/* FULL TRYOUT */}

          <div className="bg-white/10 border border-white/10 rounded-3xl p-10 hover:scale-105 transition-all duration-300">

            <h2 className="text-3xl font-bold mb-4">

              Full Tryout

            </h2>

            <p className="text-gray-400 mb-8">

              Gunakan token untuk
              mengakses full paket tryout.

            </p>

            <a
              href="/tryout"
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold inline-block"
            >

              Mulai Tryout

            </a>

          </div>

          {/* COURSE */}

          <div className="bg-white/10 border border-white/10 rounded-3xl p-10 hover:scale-105 transition-all duration-300">

            <h2 className="text-3xl font-bold mb-4">

              Course

            </h2>

            <p className="text-gray-400 mb-8">

              Belajar privat bahasa Jerman,
              mentoring intensif Goethe,
              latihan speaking, dan persiapan ujian.

            </p>

            <a
              href="/course"
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold inline-block"
            >

              Mulai Belajar

            </a>

          </div>

        </div>

      </div>

    </main>
  )
}