import { getVideo, incrementViews } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Video } from "lucide-react";

interface ViewPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ViewPage({ params }: ViewPageProps) {
    const resolvedParams = await params;
    const video = getVideo(resolvedParams.id);

    if (!video) {
        notFound();
    }

    // Increment view count (server-side side effect)
    // Note: in Next.js App Router, components are rendered on request.
    // Ideally this should be an action or handled carefully to avoid double counting on re-renders if strict mode or caching behavior.
    // For MVP, calling it here is acceptable.
    incrementViews(resolvedParams.id);

    return (
        <div className="min-h-screen bg-white">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center gap-2 font-semibold" href="/">
                    <Video className="h-6 w-6" />
                    <span>ClipFlow</span>
                </Link>
            </header>

            <main className="container mx-auto py-12 px-4 max-w-4xl">
                <div className="space-y-6">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-gray-200">
                        <video
                            src={video.path}
                            controls
                            autoPlay
                            className="w-full h-full"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">{video.originalName}</h1>
                            <p className="text-sm text-slate-500">
                                Uploaded on {new Date(video.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-slate-900">
                                {/* Display views + 1 to show current hit immediately if incrementViews is sync */}
                                {video.views + 1}
                            </div>
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Views</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
