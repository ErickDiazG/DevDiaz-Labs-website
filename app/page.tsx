import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FlavorCarousel } from "@/components/flavor-carousel"

import { ActivationsSection } from "@/components/activations-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FlavorCarousel />

      <ActivationsSection />
      <Footer />
    </main>
  )
}
