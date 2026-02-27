// Footer.tsx = the bottom section of the website.
// provides brand name and copyright info.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
    const pathname = usePathname();
    const isJournal = pathname.startsWith("/journal");
    const textColor = isJournal ? "text-primary-white" : "text-primary-pink";
    const borderColor = isJournal ? "border-primary-white" : "border-primary-pink";

    return (
        <footer className={`flex flex-col w-full mt-5 border-t ${borderColor}`}>
            <div className="flex w-full max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
                {/* Left */}
                <div className="flex flex-col justify-start items-start gap-6">
                    <p className={`text-base ${textColor} font-karrik`}>
                        mimi 2026 <br />
                        All rights reserved &copy;
                    </p>
                </div>
                {/* Right */}
                <div className="flex items-center">
                    <Link
                        href="/about"
                        className={`text-base ${textColor} font-karrik`}
                    >
                        About
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;