// Hero.tsx = main component
"use client";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [visible, setVisible] = useState(false);
    const [fading, setFading] = useState(false);
    const started = useRef(false);

    useEffect(() => {
        const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        const isReload = navEntry?.type === "reload";
        const firstVisit = sessionStorage.getItem("introSeen") !== "true";

        if (isReload || firstVisit) {
            sessionStorage.removeItem("introSeen");
            setVisible(true);
        }
    }, []);

    const finish = () => {
        sessionStorage.setItem("introSeen", "true");
        setFading(true);
        setTimeout(() => {
            setVisible(false);
            document.body.style.overflow = "";
        }, 800);
    };

    useEffect(() => {
        if (!visible || fading) return;

        document.body.style.overflow = "hidden";

        const startVideo = () => {
            if (started.current) return;
            started.current = true;
            videoRef.current?.play();
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            startVideo();
        };

        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            startVideo();
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchmove", onTouchMove, { passive: false });

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchmove", onTouchMove);
        };
    }, [visible, fading]);

    return (
        <>
            {/* Fullscreen scroll-driven intro */}
            {visible && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 bg-cover bg-center"
                    style={{ backgroundImage: "url('/intro-bg.png')", opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }}
                >
                    <video
                        ref={videoRef}
                        src="/gate_opening_transparent.webm"
                        muted
                        playsInline
                        preload="auto"
                        onEnded={finish}
                        className="w-[50%] h-[50%] object-contain"
                    />
                </div>
            )}

            {/* Main hero — only visible after intro */}
            <div className="flex xl:flex-row flex-col gap-5 relative z-0 max-width">
                <div className="pt-10 padding-x flex-1">
                    <p className="text-[20px] text-primary-pink font-karrik mt-5">
                        The modern sanctuary to track, discover, and organize your literary world.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Hero;