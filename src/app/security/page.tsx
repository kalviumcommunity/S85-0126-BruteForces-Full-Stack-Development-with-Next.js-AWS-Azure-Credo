"use client";
import { useState } from "react";

export default function SecurityDemo() {
  const [input, setInput] = useState("<script>alert('HACKED')</script>");
  const [result, setResult] = useState<any>(null);

  const testSanitization = async () => {
    const res = await fetch("/api/sanitize-demo", {
      method: "POST",
      body: JSON.stringify({ content: input }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔐 Security: XSS Sanitization</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Enter Malicious Input:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border p-2 rounded h-24 font-mono text-sm"
          />
        </div>

        <button 
          onClick={testSanitization}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Test Sanitization
        </button>

        {result && (
          <div className="bg-gray-100 p-4 rounded mt-6 space-y-4">
            <div>
              <p className="font-bold text-red-600">❌ Before (What Hacker Sent):</p>
              <code className="block bg-white p-2 border mt-1">{result.original}</code>
            </div>
            <div>
              <p className="font-bold text-green-600">✅ After (What We Stored):</p>
              <code className="block bg-white p-2 border mt-1">{result.sanitized}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}