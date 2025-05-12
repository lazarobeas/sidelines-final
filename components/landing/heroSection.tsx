import { Button } from '@/components/ui/button';
import Image from "next/image";

export default function HeroSection() {
    const liveFeedActualWidth = 800;  // e.g., Check the real width of public/live-feed.png
    const liveFeedActualHeight = 600; // e.g., Check the real height of public/live-feed.png

    const stadiumActualWidth = 1200; // e.g., Check the real width of public/stadium-football-sports.jpg
    const stadiumActualHeight = 800; // e.g., Check the real height of public/stadium-football-sports.jpg

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
                            <Button className="rounded-3xl border-black border-2 p-2 bg-white text-indigo-600 hover:bg-gray-100 py-6 px-8 text-lg">
                                Get Started
                            </Button>
                            <Button variant="outline" className="rounded-3xl border-black border-2 p-2 text-white hover:bg-white/10 py-6 px-8 text-lg">
                                Live Demo
                            </Button>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-md">
                            <div className="rounded-xl bg-white shadow-2xl content-stretch overflow-hidden transform rotate-2">
                                <Image
                                    src="/stadium-football-sports.jpg"
                                    alt='App Screenshot'
                                    width={liveFeedActualWidth}   // Use ACTUAL width
                                    height={liveFeedActualHeight} // Use ACTUAL height
                                    sizes="(min-width: 768px) 373px" // Approx 5/6 of 448px

                                    className='w-full h-auto' // Let height scale automatically
                                />
                            </div>
                            <div className="absolute -bottom-4 -left-4 rounded-xl bg-white shadow-xl overflow-hidden transform -rotate-3 w-5/6 hidden md:block">
                                <Image
                                    src='/live-feed.png'
                                    alt='Second Screenshot'
                                    width={stadiumActualWidth}   // Use ACTUAL width
                                    height={stadiumActualHeight} // Use ACTUAL height
                                    // Only visible >= md. Parent max-w-md (448px), image is w-5/6
                                    sizes="(min-width: 768px) 373px" // Approx 5/6 of 448px
                                    className='w-full h-auto' // Let height scale automatically
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}