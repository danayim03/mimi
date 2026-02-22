// NavBar.tsx = Navigation bar component
"use client";

import Link from "next/link";

const NavBar = () => {
    return (
        <header className="w-full absolute z-10">
            <nav className="max-width flex-between padding-x padding-y bg-transparent">
                <Link href="/" className="text-2xl font-bold text-primary-plum font-libre">
                    BookHub
                </Link>

                <button type="button" className="custom-btn min-w-[130px]">
                    Sign In
                </button>
            </nav>
        </header>
    );
};

export default NavBar;