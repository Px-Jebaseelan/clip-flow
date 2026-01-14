import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { put } from "@vercel/blob";

export async function saveFile(file: Blob, folder: string = "uploads"): Promise<{ id: string; url: string; filepath: string; filename: string }> {
    const ext = file.type.split("/")[1] || "webm";
    const filename = `${uuidv4()}.${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`${folder}/${filename}`, file, {
            access: 'public',
        });

        // For Blob storage, filepath is less relevant, we map it to the URL
        return {
            id: filename.split(".")[0],
            url: blob.url,
            filepath: blob.url,
            filename: blob.pathname.split("/").pop() || filename
        };
    }

    // Check if running on Vercel without Blob configured
    if (process.env.VERCEL) {
        throw new Error("Vercel Blob Storage is not configured. Please run `npx vercel storage add blob` and redeploy.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", folder);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    return {
        id: filename.split(".")[0],
        url: `/${folder}/${filename}`,
        filepath,
        filename
    };
}
