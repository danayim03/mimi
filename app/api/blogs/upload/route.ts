import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/utils/supabase-server";

const BUCKET = "blogs-images";
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const admin = getSupabaseAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: "Storage not configured. Add SUPABASE_SERVICE_ROLE_KEY." },
                { status: 503 }
            );
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
        const filename = `${base}-${Date.now()}.${ext}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const { data: uploadData, error: uploadError } = await admin.storage
            .from(BUCKET)
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            if (uploadError.message?.includes("Bucket not found") || uploadError.message?.includes("does not exist")) {
                return NextResponse.json(
                    {
                        error:
                            "Storage bucket 'blogs-images' not found. Create it in Supabase Dashboard → Storage.",
                    },
                    { status: 503 }
                );
            }
            console.error("Upload error:", uploadError);
            return NextResponse.json(
                { error: uploadError.message ?? "Upload failed" },
                { status: 500 }
            );
        }

        const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(uploadData.path);
        return NextResponse.json({ path: urlData.publicUrl });
    } catch (e) {
        console.error("POST /api/blogs/upload error:", e);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
