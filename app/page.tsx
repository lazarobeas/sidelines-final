import Header from "@/components/landing/header";
import HeroSection from "@/components/landing/heroSection";
import LiveScoresSection from "@/components/landing/liveScoresSection";
import Footer from "@/components/landing/footer";


export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />
            <HeroSection />
            <LiveScoresSection />
            <Footer />
        </div>
    );
}