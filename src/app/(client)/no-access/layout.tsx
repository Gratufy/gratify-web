import React from 'react';

export default async function NoAccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col">
      {/* <PublicHeader /> */}
      <main className="flex flex-1 flex-col">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
