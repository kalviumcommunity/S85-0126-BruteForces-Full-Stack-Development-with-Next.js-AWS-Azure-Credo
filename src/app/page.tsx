"use client";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function Home() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUI();

  return (
    <main className={`min-h-screen p-8 transition-colors duration-300 ${
      theme === "dark" ? "bg-slate-900 text-white" : "bg-gray-50 text-black"
    }`}>
      <h1 className="text-3xl font-bold mb-8">Global State Demo</h1>

      {/* Grid Layout for Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Authentication Card */}
        <section className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white shadow-sm'}`}>
          <h2 className="text-xl font-semibold mb-4 text-blue-500">🔐 Auth Context</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${isAuthenticated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isAuthenticated ? "AUTHENTICATED" : "GUEST"}
              </span>
            </div>
            
            {isAuthenticated ? (
              <div className="space-y-3">
                <p>Welcome back, <strong>{user}</strong>!</p>
                <button 
                  onClick={logout} 
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm opacity-75">Please log in to continue.</p>
                <button 
                  onClick={() => login("KalviumStudent")} 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Login as Student
                </button>
              </div>
            )}
          </div>
        </section>

        {/* UI Controls Card */}
        <section className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white shadow-sm'}`}>
          <h2 className="text-xl font-semibold mb-4 text-purple-500">🎨 UI Context</h2>
          
          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme Mode</p>
                <p className="text-sm opacity-70">Current: {theme.toUpperCase()}</p>
              </div>
              <button 
                onClick={toggleTheme} 
                className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-300 hover:bg-gray-100'}`}
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            <hr className={`border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`} />

            {/* Sidebar Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sidebar</p>
                <p className="text-sm opacity-70">State: {sidebarOpen ? "Open" : "Closed"}</p>
              </div>
              <button 
                onClick={toggleSidebar} 
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${sidebarOpen ? 'bg-green-500' : 'bg-gray-400'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}