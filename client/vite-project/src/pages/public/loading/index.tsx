import React from "react";
import { LoaderOne } from "@/components/ui/loader";
import { AuroraBackground } from "@/components/ui/aurora-background";

export function LoaderOneDemo() {
  return <LoaderOne />;
}

export default function LoadingPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <AuroraBackground className="aurora-background--public" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="brand-wordmark text-4xl sm:text-5xl font-bold tracking-widest text-white drop-shadow-md">
            S.H.E.Y
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 uppercase tracking-widest">
            Salon & Spa Experience
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md shadow-2xl flex items-center justify-center">
          <LoaderOne />
        </div>

        <p className="text-sm text-neutral-300 font-medium animate-pulse">
          Preparing your luxurious experience...
        </p>
      </div>
    </div>
  );
}
