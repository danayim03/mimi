import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAdmin } from "@/lib/admin";

const BLOGS_IMAGES_DIR = path.join(process.cwd(), "public/blogs-images");
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        if (!ALLOWED.includes(file.type)) {
            return NextResponse.json(
                { error: "Only JPG, PNG, and WebP images are allowed" },
                { status: 400 }
            );
        }

        const ext =
            file.type === "image/jpeg" || file.type === "image/jpg"
                ? "jpg"
                : file.type === "image/png"
                  ? "png"
                  : "webp";
        const base =
            file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]/gi, "-") || "image";
        let filename = `${base}.${ext}`;
        let i = 0;
        while (fs.existsSync(path.join(BLOGS_IMAGES_DIR, filename))) {
            filename = `${base}-${++i}.${ext}`;
        }

        await mkdir(BLOGS_IMAGES_DIR, { recursive: true });
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(BLOGS_IMAGES_DIR, filename);
        await writeFile(filePath, buffer);

        const publicPath = `/blogs-images/${filename}`;
        return NextResponse.json({ path: publicPath });
    } catch (e) {
        console.error("POST /api/blogs/upload error:", e);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
