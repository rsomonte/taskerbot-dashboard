"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Something went wrong!</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        We encountered an unexpected error. Please try again later.
      </p>
      <button
        onClick={() => reset()}
        className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2 px-6 rounded transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
