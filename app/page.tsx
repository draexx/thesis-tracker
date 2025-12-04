import { PublicNavbar } from "@/components/landing/PublicNavbar"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Benefits } from "@/components/landing/Benefits"
import { Testimonials } from "@/components/landing/Testimonials"
import { CTASection } from "@/components/landing/CTASection"
import { Footer } from "@/components/layout/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
