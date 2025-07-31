import PublicFooter from "@/components/public/PublicFooter/PublicFooter";
import PublicHeader from "@/components/public/PublicHeader/PublicHeader";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
