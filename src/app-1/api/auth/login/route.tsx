"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar"; // Ensure you have this component

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [`> ${msg}`, ...prev]);

  async function login() {
    addLog("Attempting Login...");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@credo.com", password: "password" }),
    });
    const data = await res.json();
    if (data.accessToken) {
      setToken(data.accessToken);
      addLog("✅ Login Success! Access Token received.");
    } else {
      addLog("❌ Login Failed.");
    }
  }

  async function testProtected() {
    addLog("Testing Protected Route...");
    let res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Handle Token Expiry (Auto-Refresh)
    if (res.status === 401) {
      addLog("⚠️ Token Expired! Refreshing...");
      const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
      const refreshData = await refreshRes.json();

      if (refreshData.accessToken) {
        setToken(refreshData.accessToken);
        addLog("🔄 Token Refreshed! Retrying request...");
        // Retry original request with new token
        res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${refreshData.accessToken}` },
        });
      } else {
        addLog("❌ Session Expired. Please login again.");
        return;
      }
    }

    const data = await res.json();
    addLog(`🎉 Result: ${JSON.stringify(data)}`);
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-32 px-6 text-white">
      <Navbar />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold">JWT Manager</h1>
        <button onClick={login} className="w-full bg-blue-600 p-3 rounded font-bold">1. Login</button>
        <button onClick={testProtected} disabled={!token} className="w-full bg-green-600 p-3 rounded font-bold disabled:opacity-50">2. Test Auth</button>
        
        <div className="bg-slate-900 p-4 rounded h-64 overflow-auto font-mono text-xs">
          {logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
        </div>
      </div>
    </div>
  );
}