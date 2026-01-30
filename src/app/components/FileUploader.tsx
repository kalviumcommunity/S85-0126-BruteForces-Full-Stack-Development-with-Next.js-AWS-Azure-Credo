"use client";

import { useState } from "react";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = e.target.files[0];
      
      // 1. Validation Logic
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(selected.type)) {
        alert("❌ Only JPG and PNG allowed");
        return;
      }
      if (selected.size > maxSize) {
        alert("❌ File too large (Max 2MB)");
        return;
      }

      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage("");

    try {
      // 1. Get the Presigned URL from our API
      const res = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      const { uploadUrl } = await res.json();

      // 2. Upload directly to AWS S3 using that URL
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (uploadRes.ok) {
        setMessage("✅ Upload Successful! Check your S3 Bucket.");
      } else {
        setMessage("❌ Upload Failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-white shadow-sm max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">☁️ S3 File Upload</h2>
      
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="block w-full text-sm text-gray-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload to S3"}
        </button>
      )}

      {message && <p className="mt-4 text-center font-medium">{message}</p>}
    </div>
  );
}