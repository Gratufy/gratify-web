export default async function AdminBusinessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex h-full w-full flex-1 flex-col">{children}</main>;
}
