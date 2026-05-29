export default function
TryoutPage(){

  const levels = [

    "A1",
    "A2",
    "B1",
    "B2"

  ]

  return (

    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-8">

      <div className="max-w-6xl w-full">

        <h1 className="text-5xl font-bold text-center mb-4">

          Pilih Level Tryout

        </h1>

        <p className="text-center text-gray-400 mb-14">

          Pilih level Goethe
          yang ingin kamu kerjakan

        </p>

        <div className="grid md:grid-cols-4 gap-8">

          {levels.map(
            level=>(

              <a
                key={level}
                href={`/tryout/${level.toLowerCase()}`}
                className="bg-white/5 border border-white/10 rounded-[36px] p-10 text-center hover:scale-105 transition-all duration-300 backdrop-blur-xl"
              >

                <h2 className="text-5xl font-bold mb-4 text-yellow-400">

                  {level}

                </h2>

                <p className="text-gray-400 mb-8">

                  Tryout Goethe
                  level {level}

                </p>

                <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold py-4 rounded-2xl">

                  Pilih Level

                </div>

              </a>

            )
          )}

        </div>

      </div>

    </main>
  )
}