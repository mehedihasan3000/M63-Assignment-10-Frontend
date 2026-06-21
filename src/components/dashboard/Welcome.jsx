"use client"
import { authClient } from "@/lib/auth-client";
import Link from "next/link"

const Welcome = () => {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    return (
        <div>
            {/* --- WELCOME BANNER DISPLAY SECTION --- */}
            <section className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl shadow-sm text-white p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                        Welcome back, {session?.user?.name || "Donor"}!
                    </h1>
                    <p className="text-rose-100 mt-2 text-sm md:text-base max-w-xl">
                        Track your ongoing requests, update active patient requirements, or schedule immediate emergency dispatch lifelines.
                    </p>
                </div>
                <Link
                    href="/dashboard/donor/create-donation-request"
                    className="bg-white text-rose-700 hover:bg-rose-50 px-5 py-3 rounded-xl font-semibold shadow-sm transition-colors text-center inline-block"
                >
                    Create Donation Request
                </Link>
            </section>
        </div>
    )
}

export default Welcome