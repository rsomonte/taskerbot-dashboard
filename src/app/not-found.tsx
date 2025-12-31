import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4 text-center">
      <h2 className="text-4xl font-bold text-white mb-4">404</h2>
      <p className="text-xl text-gray-400 mb-8">Page Not Found</p>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-2 px-6 rounded transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
