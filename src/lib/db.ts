import fs from "fs";
import path from "path";
import { kv } from "@vercel/kv";

const DB_PATH = path.join(process.cwd(), "db.json");
const KV_KEY = "videos";

export interface VideoData {
    id: string;
    filename: string;
    originalName: string;
    path: string; // url path
    createdAt: string;
    views: number;
}

async function readDb(): Promise<VideoData[]> {
    if (process.env.KV_REST_API_URL) {
        try {
            return (await kv.get<VideoData[]>(KV_KEY)) || [];
        } catch (error) {
            console.error("KV Read Error:", error);
            return [];
        }
    }

    if (process.env.VERCEL) {
        // Return empty array or throw error depending on desired behavior. 
        // Throwing ensures user knows they missed a step.
        // However, for read, maybe we just return empty, but for write we fail.
        // Let's log atleast.
        console.warn("Vercel KV not configured, falling back to empty/fs which will fail on write.");
    }

    if (!fs.existsSync(DB_PATH)) {
        return [];
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function writeDb(data: VideoData[]) {
    if (process.env.KV_REST_API_URL) {
        await kv.set(KV_KEY, data);
        return;
    }

    if (process.env.VERCEL) {
        throw new Error("Vercel KV is not configured. Please run `npx vercel storage add kv` and redeploy.");
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function addVideo(video: VideoData) {
    const db = await readDb();
    db.push(video);
    await writeDb(db);
}

export async function getVideo(id: string): Promise<VideoData | undefined> {
    const db = await readDb();
    return db.find((v) => v.id === id);
}

export async function incrementViews(id: string) {
    const db = await readDb();
    const video = db.find((v) => v.id === id);
    if (video) {
        video.views = (video.views || 0) + 1;
        await writeDb(db);
    }
}
