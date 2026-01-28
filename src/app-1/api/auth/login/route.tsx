"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Shield, ShieldAlert, User, Lock, Trash2 } from "lucide-react";

export default function RBACPlayground() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("guest");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [`> ${msg}`, ...prev]);

  async function login(type: "admin" | "viewer") {
    addLog(`Logging in as ${type.toUpperCase()}...`);
    const password = type === "admin" ? "admin123" : "viewer123";
    
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@credo.com", password }),
    });
    const data = await res.json();
    
    if (data.accessToken) {
      setToken(data.accessToken);
      setRole(data.role);
      addLog(`✅ Logged in as [${data.role}]`);
    } else {
      addLog("❌ Login Failed");
    }
  }

  async function tryAdminAction() {
    addLog(`Attempting DELETE action as [${role}]...`);
    const res = await fetch("/api/auth/admin-action", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 403) {
      addLog("⛔ ACCESS DENIED: You do not have permission.");
    } else if (res.status === 200) {
      addLog("🔥 SUCCESS: Resource deleted.");
    } else {
      addLog(`⚠️ Error: ${res.statusText}`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-32 px-6 text-white font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* LEFT: Controls */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="text-indigo-400" /> Authentication
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => login("admin")} className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-xl font-bold text-sm transition flex flex-col items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Admin Login
              </button>
              <button onClick={() => login("viewer")} className="bg-slate-700 hover:bg-slate-600 p-3 rounded-xl font-bold text-sm transition flex flex-col items-center gap-2">
                <User className="w-5 h-5" /> Viewer Login
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock className="text-red-400" /> Protected Actions
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Try to delete a resource. This requires the <code>delete</code> permission (Admin only).
            </p>
            
            {/* UI CONDITIONAL RENDERING EXAMPLE */}
            {role === "admin" && (
              <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-2 rounded">
                UI Note: You see this Delete button because you are an Admin.
              </div>
            )}
            
            <button 
              onClick={tryAdminAction} 
              disabled={!token}
              className={`w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                role === 'admin' ? 'bg-red-600 hover:bg-red-500' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <Trash2 className="w-4 h-4" /> 
              {role === 'admin' ? "Delete Database (Allowed)" : "Try Delete (Should Fail)"}
            </button>
          </div>
        </div>

        {/* RIGHT: Logs */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-[500px]">
          <h2 className="text-xl font-bold mb-4">Security Audit Logs</h2>
          <div className="flex-1 bg-slate-900 rounded-xl p-4 overflow-y-auto font-mono text-xs space-y-2 border border-slate-800">
            {logs.length === 0 && <span className="text-slate-600">Waiting for actions...</span>}
            {logs.map((log, i) => (
              <div key={i} className={log.includes("DENIED") ? "text-red-400" : log.includes("SUCCESS") ? "text-green-400" : "text-slate-300"}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}