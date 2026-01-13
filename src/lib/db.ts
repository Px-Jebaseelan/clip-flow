import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db.json");

export interface VideoData {
    id: string;
    filename: string;
    originalName: string;
    path: string; // url path
    createdAt: string;
    views: number;
}

function readDb(): VideoData[] {
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

function writeDb(data: VideoData[]) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function addVideo(video: VideoData) {
    const db = readDb();
    db.push(video);
    writeDb(db);
}

export function getVideo(id: string): VideoData | undefined {
    const db = readDb();
    return db.find((v) => v.id === id);
}

export function incrementViews(id: string) {
    const db = readDb();
    const video = db.find((v) => v.id === id);
    if (video) {
        video.views = (video.views || 0) + 1;
        writeDb(db);
    }
}
