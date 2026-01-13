"use client";

import { useState, useRef, useCallback } from "react";

export type RecordingStatus = "idle" | "recording" | "stopped";

interface UseMediaRecorderReturn {
    status: RecordingStatus;
    isAudioEnabled: boolean;
    setIsAudioEnabled: (enabled: boolean) => void;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    mediaBlob: Blob | null;
    clearRecording: () => void;
    error: string | null;
}

export function useMediaRecorder(): UseMediaRecorderReturn {
    const [status, setStatus] = useState<RecordingStatus>("idle");
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setStatus("stopped");
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            setError(null);

            // 1. Get Screen Stream (Video + System Audio)
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            // 2. Get Mic Stream (if enabled)
            let combinedStream = displayStream;
            let micStream: MediaStream | null = null;

            if (isAudioEnabled) {
                try {
                    micStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                        }
                    });

                    // Combine tracks
                    // Note: multiple audio tracks might behave differently across browsers/players. 
                    // For MVP, simplistic track addition.
                    const tracks = [
                        ...displayStream.getTracks(),
                        ...micStream.getAudioTracks()
                    ];

                    combinedStream = new MediaStream(tracks);
                } catch (err) {
                    console.warn("Microphone access denied or error:", err);
                    // Proceed with just screen
                }
            }

            streamRef.current = combinedStream;

            // 3. Setup Recorder
            // Try to use webm
            const options = { mimeType: "video/webm; codecs=vp9" };
            const recorder = new MediaRecorder(combinedStream,
                MediaRecorder.isTypeSupported(options.mimeType) ? options : undefined
            );

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                setMediaBlob(blob);
                chunksRef.current = [];

                // Stop all tracks
                streamRef.current?.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            };

            mediaRecorderRef.current = recorder;
            recorder.start();
            setStatus("recording");

            // Handle stream end (user stops sharing via browser UI)
            displayStream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to start recording");
            }
            setStatus("idle");
        }
    }, [isAudioEnabled, stopRecording]);

    const clearRecording = useCallback(() => {
        setMediaBlob(null);
        setStatus("idle");
        setError(null);
    }, []);

    return {
        status,
        isAudioEnabled,
        setIsAudioEnabled,
        startRecording,
        stopRecording,
        mediaBlob,
        clearRecording,
        error
    };
}
