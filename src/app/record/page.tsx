"use client";

import { useState } from "react";
import { Recorder } from "@/components/recorder/Recorder";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { uploadVideo } from "@/actions/upload";
import { Button } from "@/components/ui/button";

export default function RecordPage() {
    const router = useRouter();
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleRecordingComplete = (blob: Blob) => {
        setRecordedBlob(blob);
    };

    const handleUpload = async () => {
        if (!recordedBlob) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", recordedBlob, "recording.webm");
            const result = await uploadVideo(formData);
            router.push(`/edit/${result.id}`);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="border-b p-4">
                <div className="container mx-auto flex items-center">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="container mx-auto py-12 px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">New Recording</h1>
                        <p className="text-slate-500">Capture your screen and share it with the world.</p>
                    </div>

                    {!recordedBlob ? (
                        <Recorder onRecordingComplete={handleRecordingComplete} />
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-gray-200">
                                <video
                                    src={URL.createObjectURL(recordedBlob)}
                                    controls
                                    className="w-full h-full"
                                />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-slate-900">Recording Ready</h3>
                                    <p className="text-sm text-slate-500">
                                        {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB • webm
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setRecordedBlob(null)}
                                        disabled={isUploading}
                                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
                                    >
                                        Discard
                                    </button>
                                    <Button
                                        onClick={handleUpload}
                                        disabled={isUploading}
                                        className="min-w-[100px]"
                                    >
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & Edit"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
