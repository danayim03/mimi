// NavBar.tsx = Navigation bar component
"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NavBar = () => {
    const { user, isLoaded } = useUser();
    const displayName = user?.firstName || user?.username || "My";

    const [atTop, setAtTop] = useState(true);
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const current = window.scrollY;
            const previous = lastScrollY.current;

            setAtTop(current < 10);
            // hide when scrolling down past threshold, show when scrolling up
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

    return (
        <header
            className={`w-full fixed top-0 z-10 transition-all duration-300 ease-in-out
                ${visible ? "translate-y-0" : "-translate-y-full"}
                ${atTop ? "bg-transparent" : "bg-primary-white/95 backdrop-blur-sm"}
            `}
        >
            <nav className="max-width flex-between padding-x padding-y">

                <a href="/">
                    <p className="font-swiss font-bold text-black">HOME</p>
                </a>

                <div>
                    {/* If the user is not signed in, show this */}
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button type="button" className="font-swiss font-bold custom-btn min-w-[130px]">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    {/* If the user is signed in, show this */}
                    <SignedIn>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link
                                href="/my-library"
                                className="font-swiss font-bold text-sm text-black truncate max-w-[120px] sm:max-w-none"
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