// BookCard.tsx = A reusable card that displays individual book details.
"use client";

interface BookProps {
    title: string;
    author: string;
    genre: string;
    year: number;
}

const BookCard = ({ title, author, genre, year }: BookProps) => {
    return (
        <div className="book-card">
            <div className="relative w-full h-40 rounded-xl flex-center mb-4">
                {/* will add book images later. for now, placeholder. */}
                <span className="text-primary-pink font-bold text-4xl">
                    {title}
                </span>
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">
                    {title}
                </h2>
                <p className="text-sm">
                    By {author}
                </p>
            </div>

            <div className="mt-4 flex flex-between w-full text-sm font-bold uppercase tracking-widest">
                <span className="text-primary-plum">{genre}</span>
                <span className="text-primary-plum">{year}</span>
            </div>
        </div>
    );
};

export default BookCard;