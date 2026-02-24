// BookDetails.tsx = detail view of a BookCard & add to library button
"use client";
// import for Clerk
import { useAuth } from "@clerk/nextjs";

interface BookDetailsProps {
    isOpen: boolean;
    closeModal: () => void;
    book: {
        title: string;
        author: string;
        genre: string;
        year: number;
        description: string;
        image: string;
    }
}

const BookDetails = ({ isOpen, closeModal, book }: BookDetailsProps) => {
    // if not opened, don't show anything
    if (!isOpen) return null;

    const { isSignedIn } = useAuth();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4">
            <div className="bg-primary-green rounded-3xl max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-full max-h-[90vh] overflow-y-auto relative p-8">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 bg-primary-plum text-primary-pink rounded-full transition hover:bg-primary-pink hover:text-primary-plum"
                >
                    x
                </button>

                <div className="flex flex-row gap-6 items-start mt-4">
                    {/* Book Image */}
                    <div className="shrink-0">
                        {book.image ? (
                            <img src={book.image} alt={book.title} className="h-64 object-contain" />
                        ) : (
                            <span className="text-6xl font-bold text-primary-pink">{book.title}</span>
                        )}
                    </div>

                    {/* Book Info + Description + Button */}
                    <div className="flex flex-col gap-4 flex-1">
                        {/* Book Info */}
                        <div>
                            <h2 className="text-3xl font-bold font-libre text-primary-pink leading-tight">
                                {book.title}
                            </h2>
                            <p className="text-lg text-primary-pink mt-2">
                                By {book.author}
                            </p>

                            <div className="flex gap-4 mt-4">
                                <span className="bg-primary-plum text-primary-pink px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {book.genre}
                                </span>
                                <span className="bg-primary-plum text-primary-pink px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {book.year}
                                </span>
                                {/* Add Button */}
                                <button
                                    disabled={!isSignedIn}
                                    onClick={() => console.log("Adding to your library...")}
                                    className="bg-primary-plum text-primary-pink px-3 py-1 rounded-full text-xs font-bold hover:bg-primary-pink hover:text-primary-plum"
                                >
                                    {isSignedIn ? "Add to My Library" : "Sign in to add books"}
                                </button>
                            </div>
                        </div>

                        {/* Book Description */}
                        <div>
                            <h3 className="text-lg text-primary-pink font-sans">
                                Description
                            </h3>
                            <p className="text-primary-pink leading-relaxed text-sm max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {book.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;