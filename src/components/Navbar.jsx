"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { data: session, isPending, error } = authClient.useSession();
    //console.log(session?.user)

    //const isLogged = session?.user
    const loggedInUser = session?.user;
    const isLogged = loggedInUser ? true : false;

    const [isLoggedIn, setIsLoggedIn] = useState(isLogged); // Toggled true for demonstration
    const user = {
        name: session?.user?.name,
        email: session?.user?.email,
        avatarUrl: session?.user?.image
    };
    const handleLogout = async () => {
        await authClient.signOut();
        //setIsLoggedIn(false);
        router.push('/login')
    };

    // Helper to check if a link is active
    const isActive = (path) => pathname === path;

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Platform Logo / Brand */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
                            <svg
                                className="w-6 h-6 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span className="text-xl tracking-wide">
                                Blood<span className="text-red-600">Connect</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center Navigation Links */}
                    <div className="hidden sm:flex sm:space-x-8 h-full">
                        <Link
                            href="/"
                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full ${isActive("/")
                                ? "border-red-600 text-red-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/requests"
                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full ${isActive("/requests")
                                ? "border-red-600 text-red-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Donation Requests
                        </Link>

                        {/* Render Funding Link only when logged in */}
                        {isLogged && (
                            <Link
                                href="/funding"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full ${isActive("/funding")
                                    ? "border-red-600 text-red-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                Funding
                            </Link>
                        )}
                        <Link
                            href="/search"
                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full ${isActive("/search")
                                ? "border-red-600 text-red-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Search
                        </Link>
                    </div>

                    {/* Right Side Actions (Auth State Dependent) */}
                    <div className="flex items-center">
                        {!isLogged ? (
                            // --- LOGGED OUT STATE ---
                            <Link
                                href="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                            >
                                Login
                            </Link>
                        ) : (
                            // --- LOGGED IN STATE ---
                            <div className="ml-3 relative" ref={dropdownRef}>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 border border-gray-200 transition-transform duration-200 hover:scale-105"
                                        id="user-menu-button"
                                        aria-expanded={isDropdownOpen}
                                        aria-haspopup="true"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="h-8 w-8 rounded-full object-cover"
                                            src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}
                                            alt={user?.name || "User Avatar"}
                                        />
                                    </button>
                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 divide-y divide-gray-100"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu-button"
                                    >
                                        {/* User info header */}
                                        <div className="px-4 py-2">
                                            <p className="text-xs text-gray-400 font-semibold">Signed in as</p>
                                            <p className="text-sm text-gray-700 font-medium truncate">{user?.email || "user@example.com"}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="py-1">
                                            <Link
                                                href="/dashboard"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                                role="menuitem"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                        </div>

                                        <div className="py-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                role="menuitem"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}