'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ShieldCheck, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SearchClient({ initialBusinesses }: { initialBusinesses: any[] }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${query}`);
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            <Search className="w-3 h-3" /> Explore the Network
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Discover <span className="text-gradient">Trusted</span> Businesses
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Find verified merchants backed by real community vouches.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-2xl mx-auto mb-16 z-20"
        >
          <form onSubmit={handleSearch}>
            <div className={`relative flex items-center bg-card rounded-2xl border-2 transition-all duration-300 shadow-lg ${isFocused ? 'border-primary shadow-primary/10' : 'border-border shadow-black/5'}`}>
              <Search className="ml-5 text-muted-foreground shrink-0" size={20} />
              <input
                type="text"
                placeholder="Try 'Coffee Shop' or 'Web Design'..."
                className="w-full text-base py-4 px-4 bg-transparent outline-none placeholder:text-muted-foreground"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="mr-2 h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <Button type="submit" className="rounded-xl mr-2 px-6 gap-2 shadow-md shadow-primary/10">
                Search
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {initialBusinesses.length > 0 ? `${initialBusinesses.length} Results` : 'Results'}
            </h2>
            <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          <AnimatePresence mode="wait">
            {initialBusinesses.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center"
              >
                <div className="h-16 w-16 rounded-3xl bg-muted mx-auto flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No results found</h3>
                <p className="text-sm text-muted-foreground">Try a different search term to find businesses.</p>
              </motion.div>
            ) : (
              <div className="grid gap-3">
                {initialBusinesses.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <Link href={`/business/${b.id}`}>
                      <div className="group flex items-center gap-5 p-5 rounded-2xl border bg-card hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300">
                        {/* Avatar */}
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary shrink-0 group-hover:shadow-md group-hover:shadow-primary/10 transition-shadow">
                          {b.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{b.name}</h3>
                            {b.is_verified && (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{b.description || 'No description provided.'}</p>
                          {b.address && (
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" /> {b.address}
                            </div>
                          )}
                        </div>

                        {/* Score */}
                        <div className="shrink-0 text-center">
                          <div className="text-2xl font-bold text-gradient">{b.trust_score}</div>
                          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Score</div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
