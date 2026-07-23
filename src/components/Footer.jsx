import {
  Mail,
  Globe,
  MessageCircle,
  Circle
} from "lucide-react"

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Try Out", href: "/tryout" },
  { label: "Modul", href: "/modules" },
]

const programs = ["Goethe A1", "Goethe A2", "Goethe B1", "Goethe B2"]

const socials = [
  { icon: Globe, href: "#", hoverClass: "hover:bg-gold hover:text-ink" },
  { icon: Circle, href: "#", hoverClass: "hover:bg-crimson hover:text-paper" },
  { icon: MessageCircle, href: "#", hoverClass: "hover:bg-green-500 hover:text-paper" },
]

export default function Footer(){

  return (

    <footer className="border-t border-white/10 mt-24 bg-surface-deep">

      <div className="max-w-6xl mx-auto px-6 md:px-16 py-14 md:py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* BRAND */}

          <div>

            <div className="flex items-center gap-3">

              <img
                src="/logo.png"
                alt="EL Germany"
                className="w-11 h-11 object-contain"
              />

              <h2 className="text-xl font-bold text-paper">
                EL<span className="text-gold">Germany</span>
              </h2>

            </div>

            <p className="text-mist mt-5 leading-relaxed text-sm">
              Modern German language practice platform
              with AI correction, speaking simulation,
              and Goethe A1&ndash;B2 practice materials
              to help you prepare for your exam.
            </p>

          </div>

          {/* MENU */}

          <div>

            <h3 className="font-bold text-base mb-5 text-paper">
              Menu
            </h3>

            <div className="flex flex-col gap-3 text-mist text-sm">
              {menuLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-gold transition-colors duration-200 w-fit"
                >
                  {link.label}
                </a>
              ))}
            </div>

          </div>

          {/* PROGRAM */}

          <div>

            <h3 className="font-bold text-base mb-5 text-paper">
              Program
            </h3>

            <div className="space-y-3 text-mist text-sm">
              {programs.map((program) => (
                <p key={program}>{program}</p>
              ))}
            </div>

          </div>

          {/* CONTACT */}

          <div>

            <h3 className="font-bold text-base mb-5 text-paper">
              Contact
            </h3>

            <div className="space-y-4 text-mist text-sm">

              <div className="flex items-center gap-3">
                <Mail size={16} className="shrink-0" />
                <span className="break-all">pakpahansamuel137@gmail.com</span>
              </div>

              <div className="flex gap-3 pt-1">
                {socials.map(({ icon: Icon, href, hoverClass }, index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-colors duration-200 ${hoverClass}`}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

          <p className="text-mist/70 text-xs md:text-sm">
            &copy; 2026 elgermany.com &mdash; All rights reserved.
          </p>

          <p className="text-mist/70 text-xs md:text-sm">
            Made with &#10084;&#65039; for German learners
          </p>

        </div>

      </div>

    </footer>
  )
}
