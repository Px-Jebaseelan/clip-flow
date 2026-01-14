"use server";

import { saveFile } from "@/lib/storage";
import { addVideo } from "@/lib/db";

export async function uploadVideo(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file provided");
    }

    const result = await saveFile(file);

    await addVideo({
        id: result.id,
        filename: result.filename,
        originalName: file.name || "recording.webm",
        path: result.url,
        createdAt: new Date().toISOString(),
        views: 0
    });

    return result;
}
