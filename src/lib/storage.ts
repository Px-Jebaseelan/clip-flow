import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// We need to polyfill uuid or just use a simple random string generator if uuid not installed.
// I didn't install uuid. I'll use crypto.randomUUID or a simple helper.
// Node 19+ has global crypto.randomUUID. Next.js 14 runs on newer Node.

export async function saveFile(file: Blob, folder: string = "uploads"): Promise<{ id: string; url: string; filepath: string; filename: string }> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const id = uuidv4();
    const ext = file.type.split("/")[1] || "webm";
    const filename = `${id}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", folder);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    return {
        id,
        url: `/${folder}/${filename}`,
        filepath,
        filename
    };
}
