import AdminFooter from "@/components/admin/AdminFooter/AdminFooter";
import AdminHeader from "@/components/admin/AdminHeader/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminHeader />
      <main>{children}</main>
      <AdminFooter />
    </>
  );
}
