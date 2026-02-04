'use client';

import { useState } from 'react';
import { vouchForBusiness } from '@/actions/vouch';
import { Loader2, Check } from 'lucide-react';

// Fallback Basic Button
const UI_Button = (props: any) => <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 bg-white text-slate-900 hover:bg-slate-100 h-10 px-4 py-2 w-full ${props.className || ''}`} {...props} />;

export function VouchButton({ receiverId }: { receiverId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVouch = async () => {
    setLoading(true);
    setError(null);
    try {
        const result = await vouchForBusiness(receiverId);
        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.message || "Something went wrong");
        }
    } catch (e) {
        setError("Failed to connect");
    } finally {
        setLoading(false);
    }
  };

  if (success) {
      return (
          <div className="w-full bg-green-600/20 text-green-100 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border border-green-500/30">
              <Check className="w-4 h-4" /> Vouched
          </div>
      )
  }

  return (
    <div className='w-full'>
        <UI_Button onClick={handleVouch} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Vouch Now'}
        </UI_Button>
        {error && <p className="text-xs text-red-300 mt-2 text-center">{error}</p>}
    </div>
  );
}
