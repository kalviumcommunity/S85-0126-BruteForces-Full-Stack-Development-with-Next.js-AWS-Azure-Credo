import Link from "next/link";

export default function Sidebar() {
  const links = [
    { href: "/dashboard", label: "📊 Overview" },
    { href: "/users", label: "👥 Users" },
    { href: "/settings", label: "⚙️ Settings" },
  ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-gray-200 hidden md:block h-full">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Navigation
        </h2>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}