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

    <main className="min-h-screen bg-[#0F172A] text-white overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">

  <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>

  <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>

  <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-3xl"></div>

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