"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReviewForm({ businessId }: { businessId: number }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ businessId, rating, comment }),
    });

    setComment("");
    setRating(0);
    setLoading(false);
    router.refresh(); // Reloads the page data instantly
  }

  return (
    <div className="glass-panel p-6 rounded-2xl mt-8">
      <h3 className="text-lg font-bold mb-4">Add your Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={`transition hover:scale-110 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`}
            >
              <Star className="w-6 h-6" />
            </button>
          ))}
        </div>
        <textarea
          required
          placeholder="What was your experience?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          rows={3}
        />
        <button
          disabled={loading || rating === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition"
        >
          {loading ? "Posting..." : <><Send className="w-4 h-4" /> Post Review</>}
        </button>
      </form>
    </div>
  );
}