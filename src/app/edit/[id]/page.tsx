import { VideoEditor } from "@/components/editor/VideoEditor";
import { getVideo } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPage({ params }: EditPageProps) {
    const resolvedParams = await params;
    const video = await getVideo(resolvedParams.id);

    if (!video) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b px-6 h-14 flex items-center">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
                <div className="ml-4 font-semibold text-slate-900">Edit Recording</div>
            </header>

            <main className="container mx-auto py-8 px-4 max-w-5xl">
                <div className="grid md:grid-cols-[2fr,1fr] gap-8">
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <VideoEditor videoUrl={video.path} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                            <h3 className="font-semibold text-slate-900">Video Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">ID</span>
                                    <span className="font-mono text-slate-700">{video.id.slice(0, 8)}...</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Total Views</span>
                                    <span className="font-semibold text-slate-900">{video.views}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Created</span>
                                    <span className="text-slate-700">{new Date(video.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <p className="text-sm text-blue-800">
                                Share this link to let others view your video.
                            </p>
                            {/* We'll implement a View Page later. For now, Edit Page is owner view. */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
