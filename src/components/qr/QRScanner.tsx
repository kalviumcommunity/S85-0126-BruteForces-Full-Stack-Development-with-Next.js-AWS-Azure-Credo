'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { vouchForBusiness } from '@/actions/vouch';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn UI component exists
import { cn } from '@/lib/utils';

// Placeholder for Button if it doesn't exist
const DefaultButton = ({ className, children, onClick, disabled }: any) => (
    <button 
        className={cn("px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50", className)}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
);

export const QRScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Element ID for the scanner
    const scannerId = "reader";

    // Initialize scanner
    // Note: Html5QrcodeScanner might need to be imported dynamically if SSR issues occur, 
    // but typically works in useEffect.
    const scanner = new Html5QrcodeScanner(
      scannerId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        handleScan(decodedText);
      },
      (errorMessage) => {
        // parse error, ignore it.
      }
    );

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5-qr-code scanner. ", error);
      });
    };
  }, []);

  const handleScan = async (decodedText: string) => {
    if (isProcessing) return;
    
    // Pause scanning
    if (scannerRef.current) {
        scannerRef.current.pause();
    }
    
    setIsProcessing(true);
    setScanResult(decodedText);

    try {
      let businessIdentifier = '';
      
      if (decodedText.startsWith('http')) {
          const url = new URL(decodedText);
          const pathParts = url.pathname.split('/');
          
          let slugIndex = pathParts.indexOf('business');
          if (slugIndex === -1) slugIndex = pathParts.indexOf('p');
          
          if (slugIndex !== -1 && pathParts[slugIndex + 1]) {
              businessIdentifier = pathParts[slugIndex + 1];
          } else {
             throw new Error("Invalid Credo QR Code URL");
          }
      } else {
          // Assume raw slug/id
          businessIdentifier = decodedText;
      }

      console.log(`Scanned: ${businessIdentifier}`);
      
      const res = await vouchForBusiness(businessIdentifier);
      
      if (res.success) {
        setMessage({ type: 'success', text: res.message || 'Vouch recorded!' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Error processing vouch.' });
      }

    } catch (err) {
      setMessage({ type: 'error', text: "Invalid QR Code format" });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => {
      setScanResult(null);
      setMessage(null);
      if (scannerRef.current) {
          scannerRef.current.resume();
      }
  }

  const Btn = (globalThis as any).Button || DefaultButton;

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">Scan to Vouch</h3>
      
      {!scanResult ? (
        <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
            {message?.type === 'success' ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
            ) : (
                <XCircle className="w-16 h-16 text-red-500" />
            )}
            <p className={cn("text-lg font-medium", message?.type === 'success' ? "text-green-700" : "text-red-700")}>
                {message?.text}
            </p>
            <Btn onClick={resetScan} className="mt-4">
                Scan Another
            </Btn>
        </div>
      )}

      {isProcessing && (
          <div className="flex items-center justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-slate-600">Processing...</span>
          </div>
      )}
    </div>
  );
};
