"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trimVideo } from "@/actions/trim";
import { Loader2, Scissors, Download, Copy, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoEditorProps {
    videoUrl: string;
    onTrimComplete?: (newUrl: string) => void;
}

export function VideoEditor({ videoUrl, onTrimComplete }: VideoEditorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
    const [trimmedId, setTrimmedId] = useState<string | null>(null);
    const [waveformHeights, setWaveformHeights] = useState<number[]>([]);

    useEffect(() => {
        // Generate waveform on client side only to avoid hydration mismatch
        const heights = Array.from({ length: 40 }).map((_, i) => (Math.sin(i) * 0.5 + 0.5) * 80 + 20);
        setWaveformHeights(heights);
    }, []);

    useEffect(() => {
        setTrimmedUrl(null);
        setTrimmedId(null);
        setStartTime(0);
    }, [videoUrl]);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const vidDuration = videoRef.current.duration;
            setDuration(vidDuration);
            setEndTime(vidDuration);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTrim = async () => {
        if (startTime >= endTime) {
            alert("Start time must be before end time");
            return;
        }

        setIsProcessing(true);
        try {
            const result = await trimVideo(videoUrl, startTime, endTime);
            setTrimmedUrl(result.url);
            setTrimmedId(result.id);
            if (onTrimComplete) onTrimComplete(result.url);
        } catch (error) {
            console.error("Trim failed:", error);
            alert("Failed to trim video.");
        } finally {
            setIsProcessing(false);
        }
    };

    const copyShareLink = () => {
        if (trimmedId) {
            const url = `${window.location.origin}/view/${trimmedId}`;
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate percentage positions for sliders
    const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
    const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;
    const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Video Preview Area */}
            <div className="group relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 aspect-video flex flex-col">
                <div className="relative flex-1 flex items-center justify-center">
                    <video
                        key={trimmedUrl || videoUrl}
                        ref={videoRef}
                        src={trimmedUrl || videoUrl}
                        className="max-h-full max-w-full"
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onClick={togglePlay}
                    />

                    {/* Overlay Controls */}
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300",
                        isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                    )}>
                        <button
                            onClick={togglePlay}
                            className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </button>
                    </div>

                    {isProcessing && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-md z-20">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                            <p className="text-lg font-medium">Processing Trim...</p>
                            <p className="text-sm text-slate-400">This happens on the server, sit tight.</p>
                        </div>
                    )}
                </div>

                {/* Simple Progress Bar if just viewing */}
                {trimmedUrl && !isProcessing && (
                    <div className="h-1 bg-slate-800 w-full relative group-hover:h-2 transition-all">
                        <div style={{ width: `${currentPercent}%` }} className="h-full bg-blue-500 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" />
                        </div>
                    </div>
                )}
            </div>

            {/* Editor Controls */}
            {!trimmedUrl && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                <Scissors className="w-4 h-4" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Trim Video</h3>
                        </div>
                        <div className="font-mono text-sm bg-slate-100 px-3 py-1 rounded-md text-slate-600">
                            Total: {duration.toFixed(1)}s
                        </div>
                    </div>

                    {/* Timeline Slider */}
                    <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden cursor-pointer group">
                        {/* Ruler/Waveform placeholder */}
                        <div className="absolute inset-0 flex items-end justify-between px-2 pb-2 opacity-30">
                            {/* Waveform placeholder - We render this client-side only to prevent hydration mismatch */}
                            {waveformHeights.length > 0 ? waveformHeights.map((h, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-slate-400 rounded-full"
                                    style={{ height: `${h}%` }}
                                />
                            )) : (
                                /* Skeleton/Loader state */
                                Array.from({ length: 40 }).map((_, i) => (
                                    <div key={i} className="w-1 bg-slate-400 rounded-full h-1/2 opacity-20" />
                                ))
                            )}
                        </div>

                        {/* Selected Region (Mask) */}
                        <div
                            className="absolute top-0 bottom-0 bg-blue-500/20 border-x-2 border-blue-500"
                            style={{ left: `${startPercent}%`, right: `${100 - endPercent}%` }}
                        />

                        {/* Scrubber inputs (Hidden but functional) */}
                        <input
                            type="range"
                            min={0}
                            max={duration}
                            step={0.1}
                            value={startTime}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setStartTime(Math.min(val, endTime - 0.5));
                                if (videoRef.current) videoRef.current.currentTime = val;
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-10"
                            style={{ pointerEvents: 'none' }} // We need to think about how to implement dual sliders properly without custom lib
                        />

                        {/* Note: Standard Range Inputs don't allow dual Text. For MVP smoothness without installing Radix Slider, 
                 we will use two visible sliders below for precision, and just visual representation above.
             */}
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Start Time</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min={0}
                                    max={duration}
                                    step={0.1}
                                    value={startTime}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setStartTime(Math.min(val, endTime - 1));
                                        if (videoRef.current) videoRef.current.currentTime = val;
                                    }}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <span className="font-mono text-lg font-medium text-slate-900 min-w-[5ch]">{formatTime(startTime)}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">End Time</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min={0}
                                    max={duration}
                                    step={0.1}
                                    value={endTime}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setEndTime(Math.max(val, startTime + 1));
                                        if (videoRef.current) videoRef.current.currentTime = val;
                                    }}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <span className="font-mono text-lg font-medium text-slate-900 min-w-[5ch]">{formatTime(endTime)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                        <button
                            onClick={() => {
                                setStartTime(0);
                                setEndTime(duration);
                            }}
                            className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                        <button
                            onClick={handleTrim}
                            disabled={isProcessing}
                            className="px-6 py-3 bg-slate-900 text-white rounded-full font-medium shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                        >
                            <Scissors className="w-4 h-4" />
                            Trim & Save
                        </button>
                    </div>
                </div>
            )}

            {trimmedUrl && (
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-green-50 rounded-2xl border border-green-100 text-green-900 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <Download className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Your video is ready!</h3>
                            <p className="text-green-700/80 text-sm">Trimmed successfully.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <a
                            href={trimmedUrl}
                            download
                            className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-white border border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 h-11 px-6 shadow-sm"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </a>
                        <Button
                            variant="default" // Using default button styling but overriding classes if needed
                            className="flex-1 sm:flex-none h-11 px-6 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                            onClick={copyShareLink}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
