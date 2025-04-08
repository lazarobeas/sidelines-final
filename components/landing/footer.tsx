import { Separator } from '@/components/ui/separator';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <span className="font-bold text-2xl text-white mb-4 block">SIDELINES</span>
                        <p className="mt-2">The ultimate platform for sports fans everywhere.</p>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Live Now</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Feed</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Upcoming</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Statistics</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                        </ul>
                    </div>

                </div>

                <Separator className="my-8 bg-gray-800" />

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p>&copy; 2025 Sidelines. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Facebook</a>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}