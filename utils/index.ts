// utils/index.ts = toolbox's tool. 
// in order to load books in page.tsx, we need a tool to fetch the book data.
// fetchBooks() function is the tool that does it.
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 800;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchBooks(title: string, author: string, startIndex = 0) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

    // build query parts — Google Books supports intitle: and inauthor: filters
    const parts: string[] = [];
    if (title)  parts.push(`intitle:${title}`);
    if (author) parts.push(`inauthor:${author}`);
    if (!parts.length) parts.push("Jane Austen Bronte Dickens Hardy classic english fiction"); // default: english classic novels

    const safeQuery = encodeURIComponent(parts.join("+"));
    const url = `https://www.googleapis.com/books/v1/volumes?q=${safeQuery}&key=${apiKey}&maxResults=12&startIndex=${startIndex}`;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(url);
            const data = await response.json();

            // retry if API returned no items (intermittent empty response)
            if (!data.items) {
                if (attempt < MAX_RETRIES - 1) {
                    await wait(RETRY_DELAY_MS);
                    continue;
                }
                return { books: [], totalItems: 0 };
            }

            const books = data.items.map((book: any) => ({
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors?.[0] || "Unknown Author",
                genre: book.volumeInfo.categories?.[0] || "Fiction",
                year: book.volumeInfo.publishedDate?.split("-")[0] || "N/A",
                description: book.volumeInfo.description || "No description available.",
                image: book.volumeInfo.imageLinks?.thumbnail || "",
            }));

            return { books, totalItems: data.totalItems ?? 0 };
        } catch {
            if (attempt < MAX_RETRIES - 1) {
                await wait(RETRY_DELAY_MS);
            }
        }
    }

    return { books: [], totalItems: 0 };
}
