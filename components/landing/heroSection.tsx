import { Button } from '@/components/ui/button';
import Image from "next/image";
import Link from 'next/link'

export default function HeroSection() {
    return (
        <section className="relative py-20 bg-main-blue overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-main-blue bg-repeat bg-center"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-12 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Get the Ultimate Sports Companion Experience
                        </h1>
                        <p className="text-xl text-white/90 mb-8 max-w-lg">
                            Real-time scores and live chat with sports fanatics - all in one place. Stay ahead of the game.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link href="/login">
                            <Button className="rounded-3xl border-black border-2 p-2 bg-white text-indigo-600 hover:bg-gray-100 py-6 px-8 text-lg">
                                Get Started
                            </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-md">
                        <div className="rounded-xl  bg-white shadow-2xl overflow-hidden transform rotate-2">
                            <Image 
                                src="/stadium-football-sports.jpg" 
                                alt='App Screenshot' 
                                className='w-full' 
                                width={600} 
                                height={400}
                                quality={90}
                            />
                        </div>
                        <div className="absolute -bottom-4 -left-4 rounded-xl bg-white shadow-xl overflow-hidden transform -rotate-3 w-5/6 hidden md:block">
                                <Image 
                                    src='/stadium-football-sports.jpg' 
                                    alt='Second Screenshot' 
                                    className='w-full h-full object-cover' 
                                    width={500} 
                                    height={350}
                                    quality={90}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}