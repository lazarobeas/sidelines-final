'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-main-blue shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <span className="font-bold text-2xl text-white">SIDELINES</span>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button variant="ghost" onClick={() => setMobileMenuOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white md:hidden">
                    <div className="flex justify-end p-4">
                        <Button variant="ghost" onClick={() => setMobileMenuOpen(false)}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="px-6 pt-2 pb-8">
                        <div className="flex flex-col space-y-6">
                            <a href="/feed" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Live Now</a>
                            <a href="/feed" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Feed</a>
                            <a href="/upcoming" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Upcoming</a>
                            <a href="/about" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>About</a>
                            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 w-full">Sign Up</Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}