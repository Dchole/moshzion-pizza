import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pizza not found
        </h1>
        <Link
          href="/store"
          className="text-brown-medium hover:text-brown-dark hover:underline transition-colors"
        >
          Return to store
        </Link>
      </div>
    </div>
  );
}
