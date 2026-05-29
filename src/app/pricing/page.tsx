export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">
          Paket Belajar Bahasa Jerman
        </h1>

        <p className="text-gray-400 mb-12">
          Pilih paket yang sesuai kebutuhanmu
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white/10 p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">
              Full Tryout
            </h2>

            <p className="text-gray-400 mb-6">
              Gunakan token untuk membuka
              full paket tryout.
            </p>

            <a
href="/tryout"
className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold inline-block"
>
Lihat Tryout
</a>
          </div>

          <div className="bg-white/10 p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">
              Modul Terpisah
            </h2>

            <p className="text-gray-400 mb-6">
              Kaufen Modul Lesen,
              Hören, Schreiben,
              atau Sprechen terpisah.
            </p>

           <a
href="/modules"
className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold inline-block"
>
Lihat Modul
</a>
          </div>

          <div className="bg-white/10 p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">
              Les Privat
            </h2>

            <p className="text-gray-400 mb-6">
              Les privat bahasa Jerman
              online/offline.
            </p>

           <a
href="/course"
className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold inline-block"
>
Lihat Harga
</a>
          </div>

        </div>

      </div>

    </main>
  )
}