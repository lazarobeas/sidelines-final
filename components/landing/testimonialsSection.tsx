import { Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Testimonial component
function TestimonialCard({ name, role, text, rating }) {
    return (
        <Card className="bg-gray-50">
            <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarFallback className="bg-gray-300">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-medium">{name}</h4>
                        <p className="text-sm text-gray-500">{role}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600">"{text}"</p>
            </CardContent>
            <CardFooter>
                <div className="flex">
                    {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
}

export default function TestimonialsSection() {
    // Testimonial data
    const testimonials = [
        {
            id: 1,
            name: "Michael Johnson",
            role: "Basketball Fan",
            text: "This app has changed how I follow basketball. The live updates are lightning fast, and I love the detailed player stats.",
            rating: 5
        },
        {
            id: 2,
            name: "Sarah Williams",
            role: "Soccer Enthusiast",
            text: "I follow multiple leagues across different time zones, and Sidelines makes it so easy to keep track of everything in one place.",
            rating: 5
        },
        {
            id: 3,
            name: "David Chen",
            role: "Fantasy Sports Player",
            text: "The statistical depth is incredible. I've gained a real edge in my fantasy leagues since I started using Sidelines.",
            rating: 5
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands of sports fans who trust Sidelines for their daily sports updates.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(testimonial => (
                        <TestimonialCard
                            key={testimonial.id}
                            name={testimonial.name}
                            role={testimonial.role}
                            text={testimonial.text}
                            rating={testimonial.rating}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}