import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import ModuleShowcase from "../components/ModuleShowcase"
import Features from "../components/Features"
import Stats from "../components/Stats"
import Pricing from "../components/Pricing"
import FAQ from "../components/FAQ"
import Footer from "../components/Footer"
import CTA from "../components/CTA"

export default function Home(){

  return (

    <main className="relative min-h-screen bg-ink text-paper overflow-hidden">

      {/* Signature hairline: black / crimson / gold, the same order as the flag */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-crimson to-gold z-50" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-crimson/25 rounded-full blur-[140px]" />

        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/25 rounded-full blur-[140px]" />

        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[140px]" />

      </div>

      <Navbar />

      <Hero />

      <ModuleShowcase />

      <Features />

      <Stats />

      <Pricing />

      <FAQ />

      <CTA />

      <Footer />

    </main>
  )
}