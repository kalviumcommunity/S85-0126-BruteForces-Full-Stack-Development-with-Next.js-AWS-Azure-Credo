'use client';

import { useState } from 'react';
import { vouchForBusiness } from '@/actions/vouch';
import { Loader2, ThumbsUp } from 'lucide-react';

export function VouchButton({ businessId }: { businessId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleVouch = async () => {
    if (!confirm('Are you sure you want to vouch for this business? This action is public.')) return;
    
    setLoading(true);
    const result = await vouchForBusiness(businessId);
    setLoading(false);
    
    if (result.success) {
      setMessage('Vouched!');
      // Optional: Refresh page or update local state
    } else {
      alert(result.message);
    }
  };

  if (message) {
      return (
          <button disabled className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold cursor-default">
            <ThumbsUp size={18} /> {message}
          </button>
      )
  }

  return (
    <button 
      onClick={handleVouch} 
      disabled={loading}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <ThumbsUp size={18} />}
      Vouch for this Business
    </button>
  );
}
