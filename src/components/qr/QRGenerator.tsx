'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  slug: string;
  size?: number;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ slug, size = 200 }) => {
  // Construct the public profile URL
  // Prioritize environment variable, fallback to localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const profileUrl = `${baseUrl}/business/${slug}`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-card text-card-foreground rounded-lg shadow-sm border">
      <div className="bg-white p-2 rounded-md">
        <QRCodeSVG
          value={profileUrl}
          size={size}
          level={'H'} // High error correction
          includeMargin={true}
          className="border-2 border-slate-100 rounded-md"
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground font-mono">{slug}</p>
    </div>
  );
};
