import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <nav className="container flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold tracking-tight">
          wheels2deals
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/listings" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Listings
          </Link>
          <Link href="/sell" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Sell
          </Link>
          <Link href="/about" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
