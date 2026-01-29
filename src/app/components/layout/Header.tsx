import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-slate-900 text-white px-6 py-4 shadow-md z-10">
      <h1 className="text-xl font-bold tracking-tight">🚀 Kalvium App</h1>
      <nav className="flex gap-6 text-sm font-medium">
        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
        <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
        <Link href="/profile" className="hover:text-blue-400 transition-colors">Profile</Link>
      </nav>
    </header>
  );
}