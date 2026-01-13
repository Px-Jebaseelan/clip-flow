# ClipFlow

**ClipFlow** is a modern, fast, and privacy-focused screen recorder and video editor built for the web. Capture, trim, and share your screen in seconds without watermarks or hefty installations.

![ClipFlow Logo](public/logo.png)

## Features

- **High-Quality Recording**: Capture 1080p/4k video with system audio and microphone support.
- **Server-Side Trimming**: Precision trimming without re-encoding lag, powered by FFmpeg.
- **Instant Sharing**: Generate public links for easy sharing and collaboration.
- **Privacy First**: Your recordings are processed securely.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Directory)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Video Processing**: [FFmpeg](https://ffmpeg.org/) (via `fluent-ffmpeg` and `ffmpeg-static`)
- **Language**: TypeScript

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
