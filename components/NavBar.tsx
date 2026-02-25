// NavBar.tsx = Navigation bar component
"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
    // grab user's data
    const { user, isLoaded } = useUser();
    // determine which name to show on library
    const displayName = user?.username || user?.firstName || "My";

    return (
        <header className="w-full fixed top-0 z-10">
            <nav className="max-width flex-between padding-x padding-y bg-primary-plum">

                <Link href="/">
                    <Image src="/logo.png" alt="BookHub logo" width={40} height={40} />
                </Link>

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
                            {/* Library link */}
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