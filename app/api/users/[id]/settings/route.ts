import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const { data, error } = await supabase
            .from("user_settings")
            .select("is_public")
            .eq("user_id", id)
            .single();

        // PGRST116 = no row found — default to public
        if (error && error.code !== "PGRST116") {
            console.error("Settings fetch error:", error.message);
        }

        return NextResponse.json({ is_public: data?.is_public ?? true });
    } catch (e) {
        console.error("GET /settings error:", e);
        return NextResponse.json({ is_public: true });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        const { id } = await params;

        if (!userId || userId !== id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { is_public } = await req.json();

        const { error } = await supabase
            .from("user_settings")
            .upsert({ user_id: id, is_public }, { onConflict: "user_id" });

        if (error) {
            console.error("Settings upsert error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("POST /settings error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
