import {
  Mail,
  Globe,
  MessageCircle,
  Circle
} from "lucide-react"

export default function
Footer(){

  return (

    <footer className="border-t border-white/10 mt-24 bg-[#050816]">

      <div className="max-w-6xl mx-auto px-6 md:px-16 py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* BRAND */}

          <div>

            <div className="flex items-center gap-3">

              <img
                src="/logo.png"
                alt="EL Germany"
                className="w-12 h-12 object-contain"
              />

              <h2 className="text-2xl font-bold text-white">

                EL

                <span className="text-yellow-400">

                  Germany

                </span>

              </h2>

            </div>

            <p className="text-gray-400 mt-5 leading-relaxed">

              Platform try out bahasa Jerman modern
              dengan AI correction,
              speaking simulation,
              dan latihan Goethe
              A1–B2 untuk membantu
              persiapan ujianmu.

            </p>

          </div>

          {/* MENU */}

          <div>

            <h3 className="font-bold text-lg mb-5 text-white">

              Menu

            </h3>

            <div className="flex flex-col gap-3 text-gray-400">

              <a
                href="/"
                className="hover:text-yellow-400 transition"
              >

                Home

              </a>

              <a
                href="/dashboard"
                className="hover:text-yellow-400 transition"
              >

                Dashboard

              </a>

              <a
                href="/tryout"
                className="hover:text-yellow-400 transition"
              >

                Try Out

              </a>

              <a
                href="/modules"
                className="hover:text-yellow-400 transition"
              >

                Modul

              </a>

            </div>

          </div>

          {/* PROGRAM */}

          <div>

            <h3 className="font-bold text-lg mb-5 text-white">

              Program

            </h3>

            <div className="space-y-3 text-gray-400">

              <p>
                Goethe A1
              </p>

              <p>
                Goethe A2
              </p>

              <p>
                Goethe B1
              </p>

              <p>
                Goethe B2
              </p>

            </div>

          </div>

          {/* CONTACT */}

          <div>

            <h3 className="font-bold text-lg mb-5 text-white">

              Contact

            </h3>

            <div className="space-y-4 text-gray-400">

              <div className="flex items-center gap-3">

                <Mail
                  size={18}
                />

                <span>

                  contact@elgermany.com

                </span>

              </div>

              <div className="flex gap-4 pt-2">

                <a
                  href="#"
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500 hover:text-white transition"
                >

                  <Globe
                    size={18}
                  />

                </a>

                <a
                  href="#"
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-black transition"
                >

                  <Circle
                    size={18}
                  />

                </a>

                <a
                  href="#"
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 hover:text-white transition"
                >

                  <MessageCircle
                    size={18}
                  />

                </a>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

          <p className="text-gray-500 text-sm">

            © 2026 elgermany.com —
            All rights reserved.

          </p>

          <p className="text-gray-500 text-sm">

            Made with ❤️ for German learners

          </p>

        </div>

      </div>

    </footer>
  )
}