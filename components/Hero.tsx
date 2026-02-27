"use client";

const Hero = () => {
    return (
        <div className="relative max-width padding-x pt-16 pb-20 flex flex-col">
            {/* Title — sits above the video, bottom edge overlaps it */}
            <h1 className="relative z-10 text-[clamp(4rem,12vw,10rem)] font-karrik font-bold leading-none text-black mb-[-2rem]">
                mimi
            </h1>

            {/* Video box */}
            <div className="relative z-0 w-full overflow-hidden rounded-[2.5rem] aspect-video">
                <video
                    src="/romance-vid.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Tagline + CTA below the video */}
            <div className="flex flex-col gap-4 mt-8">
                <p className="text-lg md:text-xl text-black/80 font-karrik max-w-md leading-relaxed">
                    The modern sanctuary to track, discover, and organize your literary world.
                </p>
                <a href="/#discover" className="custom-btn self-start">
                    Explore Catalogue
                </a>
            </div>
        </div>
    );
};

export default Hero;
