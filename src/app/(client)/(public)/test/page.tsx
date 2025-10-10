export default function Page({
  searchParams,
}: {
  searchParams: { test?: string; error?: string };
}) {
  if (searchParams?.error === '1') {
    throw new Error('Test error: render on server');
  }

  return <div>Page test — add ?error=1 to trigger error.tsx</div>;
}
