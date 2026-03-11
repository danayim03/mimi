import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About | mimi',
};

export default function About() {
    return (
        <main className="px-4 sm:px-8 pb-2">
        <div className="bg-primary-white rounded-3xl flex flex-col items-center px-6 py-20 sm:px-16 min-h-[80vh]">
            <div className="max-w-3xl w-full space-y-16">
                
                {/* Header Section */}
                <header>
                    <h1 className="text-5xl md:text-7xl font-swiss text-black mb-6 lowercase tracking-tighter">
                        about mimi
                    </h1>
                    <p className="text-2xl italic text-black font-medium leading-tight">
                        “We hope that your book collection gives you a better idea of who you are and what you stand for.”
                    </p>
                </header>

                {/* Our Purpose */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-swiss text-black lowercase">Our Purpose</h2>
                    <div className="text-lg leading-relaxed text-black/90 space-y-4">
                        <p>
                            mimi is dedicated to building a platform that encourages people to spend more time developing self.
                        </p>
                        <p>
                            In a world where it is almost impossible to avoid unwanted influence, mimi hopes to give people an intentional space where they build their world by choosing what information to intake and reflect on those crafts.
                        </p>
                    </div>
                </section>

                {/* Our Root */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-swiss text-black lowercase">Our Root</h2>
                    <p className="text-lg leading-relaxed text-black/90">
                        It all goes down to Dana’s love for the core of Romanticism: emotional, imaginative, and most importantly, deeply personal.
                    </p>
                </section>

                {/* About Romanticism */}
                <section className="space-y-8 text-lg leading-relaxed text-black/90">
                    <h2 className="text-3xl font-swiss text-black lowercase">About Romanticism</h2>
                    <p>
                        Romanticism was an artistic and intellectual orientation that took place in Western civilization from the late 18th to mid-19th century. It emphasized the subjective, emotional, and imaginative, valuing the individual and the personal.
                    </p>

                    <div className="border-l-2 border-primary-pink pl-6 py-2 italic">
                        <p>As a rejection of classicism and rationalism, Romanticism focused on:</p>
                    </div>

                    <ul className="list-none space-y-4 ml-4">
                        {[
                            "The beauty of nature",
                            "Emotion over reason",
                            "Imagination as a gateway to spiritual truth",
                            "Folk culture, national origins, and the medieval era",
                            "The exotic, mysterious, and weird",
                            "Looking inward and determining your own path",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-pink shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <p>
                        Romanticism also viewed the artist as an individual creator, whose spirit was more important than traditional procedures, and it heightened the focus on human passions and inner struggles.
                    </p>

                    <div className="space-y-4">
                        <p>
                            mimi encourages our users to go deep into their roots and question everything; why does a certain thing makes my heart race? Why did I cry over him every night for a whole month? What makes me cathartic? What does it mean to like punk? Goth? Romance?
                        </p>
                        <p className="font-medium pt-4">
                            Continue to explore your great inner world, and as Oscar Wilde said, <span className="italic">“be yourself; everyone else is already taken.”</span>
                        </p>
                    </div>
                </section>
            </div>
        </div>
        </main>
    );
}