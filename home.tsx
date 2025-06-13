import { useState } from "react";
import Navigation from "@/components/navigation";
import PriceTicker from "@/components/price-ticker";
import HeroSection from "@/components/hero-section";
import InvestmentPlans from "@/components/investment-plans";
import TradingCharts from "@/components/trading-charts";
import StepsSection from "@/components/steps-section";
import PaymentMethods from "@/components/payment-methods";
import Footer from "@/components/footer";
import LoginModal from "@/components/login-modal";
import FloatingShapes from "@/components/floating-shapes";
import TestimonialPopup from "@/components/testimonial-popup";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FloatingShapes />
      <PriceTicker />
      <Navigation onLoginClick={() => setIsLoginOpen(true)} />
      <HeroSection onLoginClick={() => setIsLoginOpen(true)} />
      <InvestmentPlans />
      <TradingCharts />
      <StepsSection />
      <PaymentMethods />
      <PriceTicker reverse />
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <TestimonialPopup />
    </div>
  );
}
