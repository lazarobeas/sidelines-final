'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Import Link

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

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <a href="/feed" className="rounded-3xl border-black border-2 p-2 bg-white text-neutral-800 hover:text-indigo-600 font-medium">Live Now</a>
                        <a href="/feed" className="rounded-3xl border-black border-2 p-2 bg-white text-neutral-800 hover:text-indigo-600 font-medium">Feed</a>
                        {/*<a href="/upcoming" className="rounded-3xl border-black border-2 p-2 bg-white text-neutral-800 hover:text-indigo-600 font-medium">Upcoming</a>*/}
                        {/*<a href="/about" className="rounded-3xl border-black border-2 p-2 bg-white text-neutral-800 hover:text-indigo-600 font-medium">About</a>*/}
                    </nav>

                    {/* Sign Up Button (Desktop) */}
                    <div className="hidden md:flex items-center">
                        <Link href="/login" passHref>
                            <Button asChild className="ml-4 rounded-3xl border-black border-2 p-4 bg-white text-neutral-800 hover:text-indigo-600 font-medium">
                                <a>Sign Up</a>
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button variant="ghost" onClick={() => setMobileMenuOpen(true)} className="text-white hover:bg-white/10">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-main-blue text-white md:hidden">
                    <div className="flex justify-end p-4">
                        <Button variant="ghost" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-white/10">
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="px-6 pt-2 pb-8">
                        <div className="flex flex-col space-y-6 items-center">
                            <a href="/feed" className="text-lg font-medium hover:text-indigo-300" onClick={() => setMobileMenuOpen(false)}>Live Now</a>
                            <a href="/feed" className="text-lg font-medium hover:text-indigo-300" onClick={() => setMobileMenuOpen(false)}>Feed</a>
                            {/* <a href="/upcoming" className="text-lg font-medium hover:text-indigo-300" onClick={() => setMobileMenuOpen(false)}>Upcoming</a> */}
                            {/* <a href="/about" className="text-lg font-medium hover:text-indigo-300" onClick={() => setMobileMenuOpen(false)}>About</a> */}
                            <Link href="/login" passHref>
                                <Button asChild className="mt-4 bg-white text-main-blue hover:bg-gray-200 w-full max-w-xs font-semibold">
                                    <a>Sign Up</a>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}