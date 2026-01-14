"use server";

import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { addVideo } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

import ffmpegStatic from "ffmpeg-static";

import { put } from "@vercel/blob";
import os from "os";
import { Readable } from "stream";
import { finished } from "stream/promises";

if (ffmpegStatic) {
    ffmpeg.setFfmpegPath(ffmpegStatic);
}

export async function trimVideo(relativePath: string, start: number, end: number): Promise<{ id: string; url: string }> {
    const id = uuidv4();
    const isUrl = relativePath.startsWith("http");

    // Determine input path (local file or download to temp)
    let inputPath = "";
    let tempInputPath = "";

    if (isUrl) {
        // Download file to temp
        const response = await fetch(relativePath);
        if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);

        const tempDir = os.tmpdir();
        const ext = path.extname(new URL(relativePath).pathname) || ".webm";
        tempInputPath = path.join(tempDir, `input-${id}${ext}`);

        const fileStream = fs.createWriteStream(tempInputPath);
        // @ts-ignore
        await finished(Readable.fromWeb(response.body).pipe(fileStream));
        inputPath = tempInputPath;
    } else {
        // Local filesystem fallback
        const cleanPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
        inputPath = path.join(process.cwd(), "public", cleanPath);
        if (!fs.existsSync(inputPath)) {
            throw new Error("Input file not found: " + inputPath);
        }
    }

    // Determine output path (temp for Vercel, public for local)
    const isVercel = !!process.env.VERCEL;
    const outputFilename = `${id}.webm`; // output is always webm/mp4 container from ffmpeg usually? defaulting to input ext usually safer but lets stick to webm for now or determine from input
    // Actually ffmpeg output format depends on extension. 

    const outputExt = path.extname(inputPath) || ".webm";
    const actualOutputFilename = `${id}${outputExt}`;

    let outputPath = "";

    if (isVercel) {
        outputPath = path.join(os.tmpdir(), actualOutputFilename);
    } else {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        outputPath = path.join(uploadDir, actualOutputFilename);
    }

    try {
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .setStartTime(start)
                .setDuration(end - start)
                .output(outputPath)
                .on("end", resolve)
                .on("error", (err) => {
                    console.error("Trim ffmpeg error:", err);
                    reject(err);
                })
                .run();
        });

        let finalUrl = "";

        if (isVercel) {
            // Upload to Blob
            const fileStream = fs.createReadStream(outputPath);
            const blob = await put(`uploads/${actualOutputFilename}`, fileStream, {
                access: 'public',
            });
            finalUrl = blob.url;

            // Clean up temp output
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } else {
            // Local URL
            finalUrl = `/uploads/${actualOutputFilename}`;
        }

        // Add to DB
        await addVideo({
            id,
            filename: actualOutputFilename,
            originalName: "trimmed-" + (isUrl ? "video" : path.basename(inputPath)),
            path: finalUrl,
            createdAt: new Date().toISOString(),
            views: 0
        });

        return { id, url: finalUrl };

    } finally {
        // Clean up temp input if we downloaded it
        if (tempInputPath && fs.existsSync(tempInputPath)) {
            fs.unlinkSync(tempInputPath);
        }
    }
}
