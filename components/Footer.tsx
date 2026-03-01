"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
    const pathname = usePathname();
    const isJournal = pathname.startsWith("/journal");
    const textColor = "text-black";
    const mutedColor = "text-black/60";
    const borderColor = isJournal ? "border-primary-white" : "border-primary-pink/20";

    const navLinkClass = `text-sm font-swiss transition-opacity hover:opacity-100 opacity-70 ${textColor}`;

    return (
        <footer className="w-full px-4 sm:px-8 pb-4 mt-2">
        <div className="bg-primary-white rounded-3xl overflow-hidden">
            {/* Main footer content */}
            <div className="flex flex-wrap justify-between gap-10 sm:px-16 px-6 py-12">
                {/* Brand */}
                <div className="flex flex-col gap-3 max-w-xs">
                    <span className={`text-6xl sm:text-9xl font-swiss font-bold tracking-tight ${textColor}`}>
                        mimi
                    </span>
                    <p className={`text-sm font-swiss leading-relaxed ${mutedColor}`}>
                        Discover, track, and reflect on the books that shape you.
                    </p>
                </div>

                {/* Links */}
                <div className="flex gap-16 flex-wrap">
                    <div className="flex flex-col gap-3">
                        <span className={`text-xs font-swiss uppercase tracking-widest ${mutedColor}`}>
                            Explore
                        </span>
                        <Link href="/" className={navLinkClass}>Home</Link>
                        <Link href="/#discover" className={navLinkClass}>Catalogue</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className={`text-xs font-swiss uppercase tracking-widest ${mutedColor}`}>
                            Company
                        </span>
                        <Link href="/about" className={navLinkClass}>About</Link>
                        <Link href="/blogs" className={navLinkClass}>Blogs</Link>
                        <Link href="/contact" className={navLinkClass}>Contact</Link>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 sm:px-16 px-6 py-5 border-t border-black/10">
                <p className={`text-xs font-swiss ${mutedColor}`}>
                    &copy; 2026 mimi. All rights reserved.
                </p>
                <p className={`text-xs font-swiss ${mutedColor}`}>
                    Made with love for daydreamers.
                </p>
            </div>
        </div>
        </footer>
    );
};

export default Footer;