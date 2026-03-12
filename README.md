# mimi

<!-- Add your project logo here -->

**The modern sanctuary to track, discover, and organize your literary world.**

A personal reading companion to build your library, log journals, save quotes, and explore books — with authentication and data that stays yours.

---

## Screenshots / Demo

<!-- Add your images, GIFs, or animations here to showcase the app -->

---

## Feature highlights

- **Book catalogue** — Search by title or author, browse results with pagination (powered by Google Books API). Initial load is server-rendered for fast first paint.
- **My Library** — Organize books into stacks: Reading, To Read, and Finished. View your collection as visual stacks.
- **Journals** — Attach journal entries to books (e.g. reflections, ratings, finish dates). Edit and manage them from the book or journal views.
- **Quotes** — Save and revisit quotes per book.
- **User profiles** — Public profile pages at `/user/[id]` and user search in the navbar (when signed in).
- **Auth** — Sign in, sign up, and session handling via Clerk. Library and journal data stored in Supabase and tied to your account.

---

## Quickstart

```bash
git clone https://github.com/danayim03/bookhub.git
cd bookhub
npm install
```

Create `.env.local` with:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key  
- `CLERK_SECRET_KEY` — Clerk secret key  
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key  
- `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY` — Google Books API key  

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Why mimi?

mimi is for anyone who wants an intentional space to choose what they read and reflect on it. It helps you build a personal library, track progress, and keep journals and quotes in one place — so your reading life is organized and meaningful rather than scattered.

---

## Backstory

mimi is rooted in a love for the core of Romanticism: the emotional, the imaginative, and the deeply personal. In a world full of noise, the project aims to give people a place to build their world by choosing what they intake and reflect on — starting with books.

---

## Getting started (detailed)

### Prerequisites

- Node.js (project uses Next.js 16 and React 19)
- Accounts and keys for [Clerk](https://clerk.com), [Supabase](https://supabase.com), and [Google Books API](https://developers.google.com/books)

### Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/danayim03/bookhub.git
   cd bookhub
   npm install
   ```

2. **Environment variables**

   In the project root, create `.env.local` and add:

   | Variable | Description |
   |----------|-------------|
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From Clerk Dashboard → API Keys (publishable) |
   | `CLERK_SECRET_KEY` | From Clerk Dashboard → API Keys (secret) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
   | `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY` | Google Books API key |

   Do not commit `.env.local`; it is ignored by git.

3. **Run locally**

   ```bash
   npm run dev
   ```

   Build for production:

   ```bash
   npm run build
   npm start
   ```

### Deploy (e.g. Vercel)

- Set the same environment variables in your host’s dashboard (e.g. Vercel → Settings → Environment Variables).
- For Clerk, use production keys and add your production domain and redirect URLs in the Clerk Dashboard.
- Point the production branch in your host (e.g. Vercel “Production Branch”) to the branch you use for releases (e.g. `main` or `mimi`).

---

## Project hygiene

### Contributing

This project does not accept external contributions (code, pull requests, or contributed patches). The repository is maintained for personal use and reference.

### License

Licensing terms are not yet specified. A `LICENSE` file may be added to the repository. Until then, assume all rights reserved.


---

## Tech stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router)
- **UI:** [React](https://react.dev/) 19, [Tailwind CSS](https://tailwindcss.com/) 4
- **Auth:** [Clerk](https://clerk.com)
- **Data:** [Supabase](https://supabase.com), [Google Books API](https://developers.google.com/books)
- **Data fetching:** [SWR](https://swr.vercel.app/) (client), server `fetch` for SSR


