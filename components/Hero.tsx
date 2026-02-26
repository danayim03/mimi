// Hero.tsx = main component 
"use client";
import Image from "next/image";

const Hero = () => {
    // scrollToSection is defined here because it scrolls specifically to book catalogue section
    const scrollToSection = () => {
        const element = document.getElementById('book-catalogue');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex xl:flex-row flex-col gap-5 relative z-0 max-width">
            <div className="pt-10 padding-x flex-1">
                <h1 className="text-primary-pink text-[50px] sm:text-[64px] font-bold font-bonbon leading-[1.1]">
                    mimi
                </h1>

                <p className="text-[20px] text-primary-pink font-karrik mt-5">
                    The modern sanctuary to track, discover, and organize your literary world. 
                </p>

                <button onClick={scrollToSection} className="custom-btn mt-10 min-w-[170px]">
                    Explore Library
                </button>
            </div>

            <div className="xl:flex-[1.5] flex justify-end items-end w-full xl:h-screen">
                <Image 
                    src="/logo.png"
                    width={600}
                    height={600}
                    alt="hero image"
                />
            </div>
        </div>
    );
};

export default Hero;