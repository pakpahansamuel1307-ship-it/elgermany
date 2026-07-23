import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
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
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-crimson to-gold" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-crimson/15 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold/15 rounded-full blur-3xl" />

        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl" />

      </div>

      <Navbar />

      <Hero />

      <Features />

      <Stats />

      <Pricing />

      <FAQ />

      <CTA />

      <Footer />

    </main>
  )
}