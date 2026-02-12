'use client';

import { ShieldCheck, ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WorkInProgress({ title = "Coming Soon", message = "We're working hard to bring this feature to life." }: { title?: string, message?: string }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
        <Construction className="w-12 h-12 text-primary" />
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        {message} <br/> Check back later for updates!
      </p>

      <div className="flex gap-4">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button className="gap-2">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
