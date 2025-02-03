import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-indigo-500 mb-4">404</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Oops! Page not found
          </h2>
          <p className="text-gray-600">
            The page you&apos;re looking for has slipped through our photo
            frames.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg max-w-md mx-auto text-gray-600">
            <p>Here are a few suggestions:</p>
            <ul className="mt-2 text-left list-disc list-inside">
              <li>Check the URL for typos</li>
              <li>The page might have been moved or deleted</li>
              <li>Return home and try navigating to your destination</li>
            </ul>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-50 transition-colors"
            >
              <Search className="w-4 h-4" />
              Browse Photos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
