"use client";

const Hero = () => {
    const handleExplore = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="relative max-width padding-x pt-12 pb-20 flex flex-col">
            {/* Title — sits above the video, bottom edge overlaps it */}
            <h1 className="relative z-10 text-[clamp(4rem,12vw,10rem)] font-swiss font-bold leading-none text-black mb-[-1.25rem] md:mb-[-2rem]">
                mimi
            </h1>

            {/* Video box */}
            <div className="relative z-0 w-full overflow-hidden rounded-[2.5rem] aspect-video lg:aspect-auto lg:max-h-[50vh]">
                <video
                    src="/romance-vid.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                />
            </div>

            {/* Tagline + CTA below the video */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
                <p className="text-lg font-swiss text-black/80 leading-relaxed md:max-w-sm">
                    The modern sanctuary to track, discover, and organize your literary world.
                </p>
                <button onClick={handleExplore} className="font-swiss custom-btn self-start md:self-auto md:shrink-0">
                    Explore Catalogue
                </button>
            </div>
        </div>
    );
};

export default Hero;
