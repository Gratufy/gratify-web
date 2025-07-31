import BusinessFooter from "@/components/business/BusinessFooter/BusinessFooter";
import BusinessHeader from "@/components/business/BusinessHeader/BusinessHeader";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BusinessHeader />
      <main>{children}</main>
      <BusinessFooter />
    </>
  );
}
