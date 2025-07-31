import UserFooter from "@/components/user/UserFooter/UserFooter";
import UserHeader from "@/components/user/UserHeader/UserHeader";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserHeader />
      <main>{children}</main>
      <UserFooter />
    </>
  );
}
