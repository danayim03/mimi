// utils/index.ts = toolbox's tool. 
// in order to load books in page.tsx, we need a tool to fetch the book data.
// fetchBooks() function is the tool that does it.
export async function fetchBooks(title: string, author: string) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

    // build query parts — Google Books supports intitle: and inauthor: filters
    const parts: string[] = [];
    if (title)  parts.push(`intitle:${title}`);
    if (author) parts.push(`inauthor:${author}`);
    if (!parts.length) parts.push("subject:fiction"); // fallback for empty search

    const safeQuery = encodeURIComponent(parts.join("+"));
    // url template provided via Google Books API doc
    const url = `https://www.googleapis.com/books/v1/volumes?q=${safeQuery}&key=${apiKey}&maxResults=12`;
    // try and catch block
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.items) return [];

        return data.items.map((book: any) => ({
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors?.[0] || "Unknown Author",
            genre: book.volumeInfo.categories?.[0] || "Fiction",
            year: book.volumeInfo.publishedDate?.split("-")[0] || "N/A",
            description: book.volumeInfo.description || "No description available.",
            image: book.volumeInfo.imageLinks?.thumbnail || "",
        }));
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}