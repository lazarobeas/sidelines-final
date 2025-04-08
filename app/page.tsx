import Header from "@/components/landing/header";
import HeroSection from "@/components/landing/heroSection";
import LiveScoresSection from "@/components/landing/liveScoresSection";
import FeaturesSection from "@/components/landing/featuresSection";
import CTASection from "@/components/landing/ctaSection";
import Footer from "@/components/landing/footer";


export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />
            <HeroSection />
            <LiveScoresSection />
            <FeaturesSection />
            <CTASection />
            <Footer />
        </div>
    );
}