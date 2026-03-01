// NavBar.tsx = Navigation bar component
"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UserResult {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    imageUrl: string;
    email: string;
}

const NavBar = () => {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const displayName = user?.firstName || user?.username || "My";

    const [atTop, setAtTop] = useState(true);
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<UserResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const onScroll = () => {
            const current = window.scrollY;
            const previous = lastScrollY.current;
            setAtTop(current < 10);
            if (current > 60) {
                setVisible(current < previous);
            } else {
                setVisible(true);
            }
            lastScrollY.current = current;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (value.trim().length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            const res = await fetch(`/api/users/search?q=${encodeURIComponent(value.trim())}`);
            const data = await res.json();
            setResults(data);
            setShowDropdown(true);
            setSearching(false);
        }, 300);
    };

    return (
        <header
            className={`w-full fixed top-0 z-10 px-4 sm:px-8 pt-4 transition-all duration-300 ease-in-out
                ${visible ? "translate-y-0" : "-translate-y-full"}
            `}
        >
            <nav className={`max-width mx-auto flex-between px-6 py-3 rounded-t-2xl transition-all duration-300
                ${atTop
                    ? "bg-primary-white shadow-none"
                    : "bg-primary-white/95 backdrop-blur-sm shadow-sm"
                }
            `}>

                {/* Left group — HOME + search */}
                <div className="flex items-center gap-6 flex-1">
                <a href="/">
                    <p className="font-swiss text-black">HOME</p>
                </a>

                {/* User search — signed in only */}
                <SignedIn>
                    <div ref={searchRef} className="relative w-full max-w-sm">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => results.length > 0 && setShowDropdown(true)}
                            placeholder="Search users..."
                            className="w-full bg-black/5 text-black font-swiss text-sm px-4 py-1.5 rounded-full outline-none placeholder:text-black/30 focus:bg-black/10 transition-colors"
                        />

                        {/* Dropdown */}
                        {showDropdown && (
                            <div className="absolute top-full mt-2 left-0 right-0 bg-primary-white rounded-2xl shadow-lg overflow-hidden z-50">
                                {searching ? (
                                    <p className="font-swiss text-xs text-black/40 px-4 py-3">Searching...</p>
                                ) : results.length === 0 ? (
                                    <p className="font-swiss text-xs text-black/40 px-4 py-3">No users found.</p>
                                ) : (
                                    results.map((u) => (
                                        <div
                                            key={u.id}
                                            onClick={() => { setShowDropdown(false); setQuery(""); router.push(`/user/${u.id}`); }}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 transition-colors cursor-pointer"
                                        >
                                            <img
                                                src={u.imageUrl}
                                                alt=""
                                                className="w-7 h-7 rounded-full object-cover shrink-0"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <p className="font-swiss text-xs text-black truncate">
                                                    {[u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "User"}
                                                </p>
                                                {u.username && (
                                                    <p className="font-swiss text-[10px] text-black/40 truncate">
                                                        @{u.username}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </SignedIn>
                </div>

                <div className="pl-6">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button type="button" className="font-swiss custom-btn min-w-[130px]">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex items-center gap-6">
                            <Link
                                href="/my-library"
                                className="font-swiss text-sm text-black truncate max-w-[120px] sm:max-w-none"
                            >
                                {isLoaded ? `${displayName}'s LIBRARY` : "MY LIBRARY"}
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>
                </div>

            </nav>
        </header>
    );
};

export default NavBar;
