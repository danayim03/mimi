// SearchBar.tsx = a search input and button that allows users to find specific books.
"use client";

import React, { useState } from "react";

interface SearchBarProps {
    onSearch: (title: string, author: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(title, author);
    };

    return (
        <form className="flex flex-col sm:flex-row items-stretch sm:items-center w-full max-w-3xl mt-10 gap-4" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search by title..."
                className="search-input flex-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Search by author..."
                className="search-input flex-1"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
            />
            <button type="submit" className="custom-btn self-start px-5 py-2 text-sm">
                Search
            </button>
        </form>
    );
};

export default SearchBar;