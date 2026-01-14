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
