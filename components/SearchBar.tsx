// SearchBar.tsx = a search input and button that allows users to find specific books.
// It uses React State to track the text entered by the user.
"use client";

import React, { useState } from "react";

const SearchBar = () => {
    // searchTitle = current value (what user types)
    // setSearchTitle = function to change the value
    // "" = starting value (empty text)
    const [searchTitle, setSearchTitle] = useState("");
    // function that runs when user submits the form (e = form event)
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault(); // prevents the page from refreshing when user clicks on the search button
        console.log("Searching for: " , searchTitle);
    };

    return (
        <form className="flex items-center w-full max-w-3xl mt-10" onSubmit={handleSearch}>
            <div className="relative w-full flex items-center">
                <input
                    type="text"
                    placeholder="Search for a book title..."
                    className="search-input w-full"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />

                <button type="submit" className="custom-btn ml-4 min-w-[100px]">
                    Search
                </button>
            </div>
        </form>
    )
}

export default SearchBar;