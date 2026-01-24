"use client";

import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // 👈 Import Toast

export default function ReviewForm({ businessId }: { businessId: number }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    // 1. Trigger "Loading" Toast
    const toastId = toast.loading("Verifying review on-chain...");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, rating, comment }),
      });

      if (res.ok) {
        setComment("");
        setRating(0);
        router.refresh();
        // 2. Trigger "Success" Toast
        toast.success("Review Verified & Posted!", { id: toastId }); 
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      // 3. Trigger "Error" Toast
      toast.error("Verification failed. Try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel p-6 rounded-2xl mt-8 border border-white/10 relative overflow-hidden">
      <h3 className="text-lg font-bold mb-4 text-white">Verify this Business</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={`transition hover:scale-110 focus:outline-none ${
                rating >= star ? "text-yellow-400 fill-yellow-400" : "text-slate-600"
              }`}
            >
              <Star className="w-6 h-6" />
            </button>
          ))}
        </div>

        {/* Comment Box */}
        <textarea
          required
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none"
          rows={3}
        />

        {/* Submit Button with Loader State */}
        <button
          disabled={loading || rating === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            // 4. Visual Loader Feedback
            <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
          ) : (
            <><Send className="w-4 h-4" /> Post Review</>
          )}
        </button>
      </form>
    </div>
  );
}