import Header from "@/components/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-primary pt-16">
      <Header variant="app" />
      <main id="main-content" className="relative z-50 bg-white shadow-2xl">
        {children}
      </main>
    </div>
  );
}
