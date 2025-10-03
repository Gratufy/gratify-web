export default function LoadingBusinessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-xl animate-pulse space-y-4">
        <div className="h-8 w-2/3 rounded bg-gray-200" />
        <div className="h-6 w-1/2 rounded bg-gray-200" />
        <div className="h-6 w-3/4 rounded bg-gray-200" />
        <div className="h-40 w-full rounded bg-gray-100" />
      </div>
    </div>
  );
}
