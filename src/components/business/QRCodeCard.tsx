"use client";

import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";

export function QRCodeCard({ url, title }: { url: string; title: string }) {
  return (
    <Card className="p-6 flex flex-col items-center gap-4 bg-card text-card-foreground border-border shadow-sm">
      <div className="bg-white p-2 rounded-xl border border-slate-100">
        <QRCode value={url} size={120} className="w-full h-auto" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Scan to Vouch</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate">{title}</p>
      </div>
    </Card>
  );
}
