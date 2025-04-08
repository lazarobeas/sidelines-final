import {Bell, MessageCircle, Star, TrendingUp} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function FeatureCard({ icon, title, description }) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                    {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-base">{description}</CardDescription>
            </CardContent>
        </Card>
    );
}

export default function FeaturesSection() {
    // Feature data
    const features = [
        {
            id: 1,
            icon: <Bell className="h-6 w-6 text-indigo-600" />,
            title: "Instant Notifications",
            description: "Get real-time alerts for scores, player stats, and game-changing moments."
        },
        {
            id: 2,
            icon: <MessageCircle className="h-6 w-6 text-indigo-600" />,
            title: "Live Chat",
            description: "Never miss a play with your friends with our live chat and talk about the game."
        },
        {
            id: 3,
            icon: <Star className="h-6 w-6 text-indigo-600" />,
            title: "Favorite Teams",
            description: "Customize your experience by following the teams you care about most."
        },
        {
            id: 4,
            icon: <TrendingUp className="h-6 w-6 text-indigo-600" />,
            title: "Play-by-play",
            description: "Get play-by-play updates so you can stay in the game."
        }
    ];

    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why Choose Sidelines</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our platform offers everything you need to stay connected to the sports you love.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map(feature => (
                        <FeatureCard
                            key={feature.id}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}