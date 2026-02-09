"use client";

import { cn } from "@/lib/utils";
import { Shield, Medal, Trophy, Star } from "lucide-react";

export type TrustTier = "UNVERIFIED" | "BRONZE" | "SILVER" | "GOLD";

interface TrustBadgeProps {
  tier: TrustTier;
  className?: string;
  showLabel?: boolean;
}

const TIER_CONFIG = {
  UNVERIFIED: {
    label: "Unverified",
    color: "bg-slate-100 text-slate-500 border-slate-200",
    icon: Shield,
    textColor: "text-slate-500"
  },
  BRONZE: {
    label: "Bronze Tier",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Medal,
    textColor: "text-amber-700"
  },
  SILVER: {
    label: "Silver Tier",
    color: "bg-slate-100 text-slate-700 border-slate-300 ring-2 ring-slate-100",
    icon: Star,
    textColor: "text-slate-700"
  },
  GOLD: {
    label: "Gold Tier",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200 ring-2 ring-yellow-400/30",
    icon: Trophy,
    textColor: "text-yellow-700"
  },
};

export function TrustBadge({ tier, className, showLabel = true }: TrustBadgeProps) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.UNVERIFIED;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border transition-all",
        config.color,
        className
      )}
    >
      <Icon size={14} className="shrink-0" />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
