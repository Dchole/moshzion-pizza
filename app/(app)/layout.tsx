import Header from "@/components/Header";
import { FloatingCartButton } from "@/components/FloatingCartButton";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-primary pt-16">
      <Header variant="app" />
      <main
        id="main-content"
        className="relative z-50 bg-white shadow-2xl overflow-x-hidden"
      >
        {children}
        <FloatingCartButton />
      </main>
      <ScrollToTopButton />
    </div>
  );
}
