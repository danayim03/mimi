// NavBar.tsx = Navigation bar component
"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
const NavBar = () => {
    const { user, isLoaded } = useUser();
    const displayName = user?.username || user?.firstName || "My";

    return (
        <header className="w-full fixed top-0 z-10">
            <nav className="max-width flex-between padding-x padding-y bg-primary-white">

                <a href="/">
                    <p className="font-bonbon text-primary-pink">mimi</p>
                </a>

                <div>
                    {/* If the user is not signed in, show this */}
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button type="button" className="custom-btn min-w-[130px]">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    {/* If the user is signed in, show this */}
                    <SignedIn>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/my-library"
                                className="text-sm text-primary-pink font-bold"
                            >
                                {isLoaded ? `${displayName}'s Library` : "My Library"}
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