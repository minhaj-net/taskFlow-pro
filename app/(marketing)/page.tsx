import HeroSection from '@/app/components/sections/HeroSection'
import TrustedBySection from '@/app/components/sections/TrustedBySection'
import FeaturesSection from '@/app/components/sections/FeaturesSection'
import HowItWorksSection from '@/app/components/sections/HowItWorksSection'
import DashboardPreviewSection from '@/app/components/sections/DashboardPreviewSection'
import BenefitsSection from '@/app/components/sections/BenefitsSection'
import TestimonialsSection from '@/app/components/sections/TestimonialsSection'
import FAQSection from '@/app/components/sections/FAQSection'
import CTASection from '@/app/components/sections/CTASection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <DashboardPreviewSection />
      <BenefitsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
