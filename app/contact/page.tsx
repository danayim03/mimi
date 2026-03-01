"use client";

import { useState } from "react";

const ContactPage = () => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        const res = await fetch("https://formspree.io/f/xwvnjlyo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                message: form.message,
            }),
        });

        if (res.ok) {
            setStatus("sent");
            setForm({ firstName: "", lastName: "", email: "", message: "" });
        } else {
            setStatus("error");
        }
    };

    const inputClass =
        "w-full bg-transparent border-b border-black/30 text-black font-swiss text-sm py-2 outline-none focus:border-black transition-colors placeholder:text-black/30";

    return (
        <main className="px-4 sm:px-8 pb-2">
        <div className="bg-primary-white rounded-3xl padding-x max-width mx-auto py-20 min-h-[80vh]">
            <div className="max-w-2xl">

                {/* Header */}
                <h1 className="font-swiss text-5xl sm:text-7xl text-black leading-tight mb-6">
                    Contact Us
                </h1>
                <p className="font-swiss text-black/60 text-base leading-relaxed mb-16 max-w-md">
                    Feel free to reach out any time. mimi is here to receive questions about the app and any feedback you may have.
                </p>

                {status === "sent" ? (
                    <div className="flex flex-col gap-4">
                        <p className="font-swiss text-black text-base">
                            Your message has been sent ✦
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="font-swiss text-xs text-black/50 hover:text-black transition-colors self-start"
                        >
                            Send another
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-10">

                        {/* Name row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-swiss uppercase tracking-widest text-black/50">
                                    First Name
                                </label>
                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="Jane"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-swiss uppercase tracking-widest text-black/50">
                                    Last Name
                                </label>
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Eyre"
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-swiss uppercase tracking-widest text-black/50">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="jane@example.com"
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-swiss uppercase tracking-widest text-black/50">
                                Tell Us the Details
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Your message..."
                                rows={6}
                                required
                                className="w-full bg-primary-white border border-black/20 focus:border-black text-black font-swiss text-sm p-4 resize-none outline-none transition-colors placeholder:text-black/20 mt-2"
                            />
                        </div>

                        {status === "error" && (
                            <p className="font-swiss text-sm text-red-500 -mt-4">
                                Something went wrong. Please try again.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className="custom-btn self-start disabled:opacity-50"
                        >
                            {status === "sending" ? "Sending..." : "Send Message"}
                        </button>

                    </form>
                )}

            </div>
        </div>
        </main>
    );
};

export default ContactPage;
