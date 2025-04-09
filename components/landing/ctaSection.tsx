'use client';

import { useState } from 'react';
import { Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

export default function CTASection() {
    const [email, setEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleWaitlistSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setShowAlert(true);
            setEmail('');
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    return (
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-500">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Card className="bg-transparent border-0 shadow-none text-white">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold text-white">Ready to Elevate Your Sports Experience?</CardTitle>
                            <CardDescription className="text-xl text-white/90">
                                Join our waitlist today and be the first to experience Sidelines when we launch.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-white/10 text-white placeholder-white/60 border-white/20 focus-visible:ring-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button type="submit" className="bg-white rounded-3xl border-black border-2 p-4 text-indigo-600 hover:bg-gray-100 whitespace-nowrap">
                                    Join Waitlist
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <div className="flex items-center justify-center space-x-6">
                                <div className="flex items-center text-white">
                                    <Shield className="h-5 w-5 mr-2" />
                                    <span>Secure & Private</span>
                                </div>
                                <div className="flex items-center text-white">
                                    <Users className="h-5 w-5 mr-2" />
                                    <span>5,000+ Early Adopters</span>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}