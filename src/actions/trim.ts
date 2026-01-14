"use server";

import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { addVideo } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

import ffmpegStatic from "ffmpeg-static";

if (ffmpegStatic) {
    ffmpeg.setFfmpegPath(ffmpegStatic);
}

// We need uuid logic again. Since I can't import straightforwardly from storage if I didn't export it or it's not a library.
// I'll just use crypto.randomUUID().

export async function trimVideo(relativePath: string, start: number, end: number): Promise<{ id: string; url: string }> {
    const cleanPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
    const inputPath = path.join(process.cwd(), "public", cleanPath);

    if (!fs.existsSync(inputPath)) {
        throw new Error("Input file not found: " + inputPath);
    }

    const id = uuidv4();
    const ext = path.extname(inputPath);
    const outputFilename = `${id}${ext}`; // Use ID as filename for consistency
    const outputRelativePath = `uploads/${outputFilename}`;
    const outputPath = path.join(process.cwd(), "public", "uploads", outputFilename);

    // Ensure uploads dir exists (redundant but safe)
    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .setStartTime(start)
            .setDuration(end - start)
            .output(outputPath)
            .on("end", async () => {
                const url = "/" + outputRelativePath;
                await addVideo({
                    id,
                    filename: outputFilename,
                    originalName: "trimmed-" + path.basename(inputPath),
                    path: url,
                    createdAt: new Date().toISOString(),
                    views: 0
                });
                resolve({ id, url });
            })
            .on("error", (err) => {
                console.error("Trim error:", err);
                reject(err);
            })
            .run();
    });
}
