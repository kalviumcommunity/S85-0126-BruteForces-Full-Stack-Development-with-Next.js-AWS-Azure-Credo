import { config } from "../lib/config";

export default function Home() {
  // This log prints in your VS CODE TERMINAL, not the browser
  console.log("✅ TEST: Server is reading config:", config);

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold">Environment Check</h1>
      <p className="mb-4">Check your VS Code Terminal for the "✅ TEST" message.</p>
      
      <div className="p-4 bg-gray-100 rounded border">
        <p><strong>API Base URL (Client Side):</strong></p>
        {/* This proves the public variable works in the browser */}
        <code className="text-blue-600">
          {process.env.NEXT_PUBLIC_API_BASE_URL || "Not Found"}
        </code>
      </div>
    </div>
  );
}