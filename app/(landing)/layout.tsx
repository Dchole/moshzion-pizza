import Header from "@/components/Header";

export default function LandingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
    </>
  );
}
