import Link from "next/link";

export default function HeroBanner() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-red-50/60 via-white to-white py-20 sm:py-32 border-b border-gray-100">
            {/* Decorative subtle background element */}
            <div className="absolute top-0 left-1/2 -z-10 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]">
                <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                    <defs>
                        <pattern
                            id="grid-pattern"
                            width={200}
                            height={200}
                            x="50%"
                            y={-1}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M.5 200V.5H200" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" strokeWidth={0} />
                </svg>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Small Tagline */}
                <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 mb-6 animate-pulse">
                    Be a Hero, Save Lives
                </span>

                {/* Main Heading */}
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl leading-none">
                    Every Drop Counts. <br />
                    <span className="text-red-600">Connect, Donate, Save Lives.</span>
                </h1>

                {/* Supporting Text */}
                <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    BloodConnect bridges the gap between generous blood donors and those in urgent need.
                    Join our growing community today and help make a difference in someones life.
                </p>

                {/* Call to Actions (Buttons) */}
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl shadow-md text-white bg-red-600 hover:bg-red-700 hover:shadow-lg transition-all duration-200 active:scale-98"
                    >
                        Join as a donor
                    </Link>

                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-semibold rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 active:scale-98"
                    >
                        Search Donors
                    </Link>
                </div>
            </div>
        </section>
    );
}