import Link from "next/link";
import { Video, Scissors, Share2, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link className="flex items-center gap-2 font-bold text-xl tracking-tight" href="#">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Video className="w-4 h-4 fill-current" />
            </div>
            <span>ClipFlow</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <Link className="hover:text-blue-600 transition-colors" href="#">Features</Link>
            <Link className="hover:text-blue-600 transition-colors" href="#">Pricing</Link>
            <Link className="hover:text-blue-600 transition-colors" href="#">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/record" className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900">
              Log in
            </Link>
            <Link
              href="/record"
              className="inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10 opacity-60 mix-blend-multiply" />
          <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-purple-100/50 rounded-full blur-3xl -z-10 opacity-60 mix-blend-multiply" />

          <div className="container px-4 mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-sm font-medium text-blue-600 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse" />
              New: Server-side Trimming 2.0
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Screen recording <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">reimagined</span> for speed.
            </h1>

            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Capture, trim, and share your screen in seconds. No hefty installs, no watermarks, just pure productivity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link
                href="/record"
                className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 shadow-xl shadow-blue-600/20 transition-all hover:scale-105"
              >
                <Video className="w-5 h-5" />
                Start Recording Free
              </Link>
              <Link
                href="#"
                className="h-12 px-8 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium flex items-center gap-2 shadow-sm transition-all hover:bg-slate-50"
              >
                <Play className="w-5 h-5 fill-slate-700" />
                Watch Demo
              </Link>
            </div>

            {/* Mock UI Representation */}
            <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white/50 p-2 shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-1000 delay-500">
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden aspect-[16/9] relative group">
                {/* Fake Browser UI */}
                <div className="h-10 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="mx-auto w-1/2 h-6 bg-white rounded border border-slate-200 shadow-sm flex items-center justify-center text-[10px] text-slate-400">
                    clipflow.app/view/demo-recording
                  </div>
                </div>
                {/* Placeholder Content */}
                <div className="absolute inset-0 top-10 flex items-center justify-center bg-slate-50">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <Video className="w-8 h-8" />
                    </div>
                    <p className="text-slate-400 font-medium">Your Application Here</p>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -right-8 top-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-left-4 duration-1000 delay-700 hidden lg:block hover:scale-105 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Upload Complete</div>
                    <div className="text-xs text-slate-500">Just now</div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-8 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-1000 delay-1000 hidden lg:block hover:scale-105 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Link Copied</div>
                    <div className="text-xs text-slate-500">Ready to share</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Everything you need to share context.</h2>
              <p className="text-slate-500 text-lg">Detailed features packed into a simple, intuitive interface designed for modern teams.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">High Quality Recording</h3>
                <p className="text-slate-500 leading-relaxed">
                  Capture crystal clear 1080p/4k video with system audio and microphone support automatically synced.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Precision Trimming</h3>
                <p className="text-slate-500 leading-relaxed">
                  Remove the awkward start and end moments with our server-side trimming engine. No re-encoding lag.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Instant View Links</h3>
                <p className="text-slate-500 leading-relaxed">
                  Share a public link that anyone can view without signing up. Analytics included for every video.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container px-4 mx-auto">
            <div className="bg-slate-900 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to start recording?</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 relative z-10">
                Join thousands of developers and designers who use ClipFlow to communicate faster.
              </p>
              <Link
                href="/record"
                className="relative z-10 inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-bold text-slate-900 shadow-xl hover:bg-blue-50 transition-colors"
              >
                Start Recording Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-white border-t border-slate-100 text-center">
        <p className="text-slate-500 text-sm">© 2026 ClipFlow Inc. Crafted with care.</p>
      </footer>
    </div>
  );
}
