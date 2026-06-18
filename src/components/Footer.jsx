import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
            {/* Main Content Sections */}
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">

                    {/* Brand/Mission Section */}
                    <div className="space-y-6 xl:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-white">
                            <svg
                                className="w-6 h-6 text-red-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span className="text-xl tracking-wide">
                                Blood<span className="text-red-500">Connect</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                            Bridging the gap between life-saving heroes and patients in need. Our goal is a seamless, transparent, and ultra-efficient blood donation ecosystem.
                        </p>
                        {/* Minimalist Contact Prompt */}
                        <div className="text-xs text-gray-500">
                            Emergency Hotline: <span className="text-red-400 font-semibold">1-800-555-BLOOD</span>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2 sm:grid-cols-3">

                        {/* Column 1: For Donors */}
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                                For Donors
                            </h3>
                            <ul role="list" className="mt-4 space-y-3">
                                <li>
                                    <Link href="/register" className="text-sm hover:text-red-400 transition-colors duration-150">
                                        Join as a Donor
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/requests" className="text-sm hover:text-red-400 transition-colors duration-150">
                                        Donation Requests
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/eligibility" className="text-sm hover:text-red-400 transition-colors duration-150">
                                        Who Can Give Blood?
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 2: For Recipients & Volunteers */}
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                                Get Involved
                            </h3>
                            <ul role="list" className="mt-4 space-y-3">
                                <li>
                                    <Link href="/search" className="text-sm hover:text-red-400 transition-colors duration-150">
                                        Search for Donors
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/volunteer" className="text-sm hover:text-red-400 transition-colors duration-150">
                                        Volunteer Program
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/funding" className="text-sm hover:text-red-400 transition-colors duration-150">
                                        Support Our Funding
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Legal & Support */}
                        <div className="col-span-2 sm:col-span-1">
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                                Legal & Safety
                            </h3>
                            <ul role="list" className="mt-4 space-y-3">
                                <li>
                                    <Link href="/privacy" className="text-sm hover:text-red-400 transition-colors duration-150">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-sm hover:text-red-400 transition-colors duration-150">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-sm hover:text-red-400 transition-colors duration-150">
                                        Contact & Support
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Bottom Horizontal Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500 text-center sm:text-left">
                        &copy; {currentYear} BloodConnect. All rights reserved. Made to save lives.
                    </p>
                    <div className="flex space-x-6 text-xs text-gray-500">
                        <span>Secure Data Encrypted</span>
                        <span>&bull;</span>
                        <span>Community Driven</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}