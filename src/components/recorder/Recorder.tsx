"use client";

import React, { useEffect, useState } from "react";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { Mic, MicOff, Video, Square, AlertCircle, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecorderProps {
    onRecordingComplete: (blob: Blob) => void;
}

// Sub-component for the active recording state
function RecordingView({
    stopRecording
}: {
    stopRecording: () => void;
}) {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
                <div className="relative bg-white border border-slate-200 shadow-2xl rounded-full px-8 py-4 flex items-center gap-8 min-w-[300px] justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </div>
                        <span className="font-mono text-lg font-medium text-slate-900 tabular-nums">
                            {formatTime(elapsedTime)}
                        </span>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <button
                        onClick={stopRecording}
                        className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                    >
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-red-50 transition-colors">
                            <Square className="w-3 h-3 fill-current" />
                        </div>
                        <span className="hidden sm:inline">Stop Recording</span>
                    </button>
                </div>
            </div>
            <p className="mt-8 text-slate-400 text-sm animate-pulse">Recording your screen...</p>
        </div>
    );
}

// Sub-component for the idle state
function IdleView({
    startRecording,
    isAudioEnabled,
    setIsAudioEnabled
}: {
    startRecording: () => void;
    isAudioEnabled: boolean;
    setIsAudioEnabled: (v: boolean) => void;
}) {
    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-8">
                <div className="space-y-4">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-blue-50/50">
                        <Video className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Start New Recording</h2>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        You can choose to record your entire screen, a window, or a specific browser tab.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                        className={cn(
                            "h-14 px-6 rounded-full border-2 font-medium flex items-center gap-2 transition-all duration-200 min-w-[160px] justify-center",
                            isAudioEnabled
                                ? "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-200"
                                : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                        )}
                    >
                        {isAudioEnabled ? (
                            <>
                                <Mic className="w-5 h-5" />
                                <span>Mic On</span>
                            </>
                        ) : (
                            <>
                                <MicOff className="w-5 h-5" />
                                <span>Mic Off</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={startRecording}
                        className="h-14 px-8 rounded-full bg-slate-900 text-white font-semibold shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 min-w-[200px] justify-center"
                    >
                        <Radio className="w-5 h-5" />
                        <span>Broadcast Screen</span>
                    </button>
                </div>
                <p className="text-xs text-slate-400">
                    Uses browser native recording. No data leaves your device until upload.
                </p>
            </div>
        </div>
    );
}

export function Recorder({ onRecordingComplete }: RecorderProps) {
    const {
        status,
        startRecording,
        stopRecording,
        mediaBlob,
        isAudioEnabled,
        setIsAudioEnabled,
        error,
        clearRecording
    } = useMediaRecorder();

    // Handle completion
    useEffect(() => {
        if (mediaBlob && status === "stopped") {
            onRecordingComplete(mediaBlob);
        }
    }, [mediaBlob, status, onRecordingComplete]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Recording Failed</h3>
                <p className="text-slate-500 mb-6 max-w-sm">{error}</p>
                <button
                    onClick={clearRecording}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (status === "recording") {
        return <RecordingView stopRecording={stopRecording} />;
    }

    return (
        <IdleView
            startRecording={startRecording}
            isAudioEnabled={isAudioEnabled}
            setIsAudioEnabled={setIsAudioEnabled}
        />
    );
}
