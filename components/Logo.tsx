import Image from "next/image";

export default function Logo({
  className = "w-12 h-12",
  variant = "landing"
}: {
  className?: string;
  variant?: "landing" | "app";
}) {
  const logoSrc =
    variant === "app" ? "/assets/logo_app.svg" : "/assets/logo.svg";

  return (
    <Image
      src={logoSrc}
      alt="Moshzion Pizza Logo"
      width={48}
      height={48}
      className={className}
      priority
    />
  );
}
