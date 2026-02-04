'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  slug: string;
  size?: number;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ slug, size = 200 }) => {
  // Construct the public profile URL
  // Assuming the app is hosted at process.env.NEXT_PUBLIC_APP_URL or window.location.origin
  // For static generation, we use a placeholder or env variable
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://credo.app';
  const profileUrl = `${baseUrl}/p/${slug}`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
      <QRCodeSVG
        value={profileUrl}
        size={size}
        level={'H'} // High error correction
        includeMargin={true}
        className="border-2 border-slate-100 rounded-md"
      />
      <p className="mt-2 text-xs text-slate-500 font-mono">{slug}</p>
    </div>
  );
};
