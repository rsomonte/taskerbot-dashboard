export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#5865F2] border-t-transparent"></div>
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
