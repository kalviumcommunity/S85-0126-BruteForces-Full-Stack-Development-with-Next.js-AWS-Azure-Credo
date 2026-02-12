'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface FileUploaderProps {
  bucketName?: string;
  folderPath?: string;
  onUploadComplete: (url: string) => void;
  label?: string;
  accept?: string;
  type?: 'image' | 'document';
  defaultValue?: string;
}

export function FileUploader({ 
  bucketName = 'business-assets', 
  folderPath = 'uploads', 
  onUploadComplete, 
  label = "Upload File",
  accept = "image/*",
  type = 'image',
  defaultValue
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(defaultValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      
      setFileUrl(data.publicUrl);
      onUploadComplete(data.publicUrl);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFileUrl(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      
      {!fileUrl ? (
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept={accept}
            disabled={uploading}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          />
          <label 
            htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-input bg-card hover:bg-accent/50 cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-sm text-foreground">{uploading ? 'Uploading...' : 'Choose File'}</span>
          </label>
        </div>
      ) : (
        <div className="relative group rounded-lg border bg-card w-full max-w-md overflow-hidden">
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X className="w-4 h-4" />
          </button>
          
          {type === 'image' ? (
            <div className="relative h-48 w-full bg-muted/20">
              <Image 
                src={fileUrl} 
                alt="Uploaded preview" 
                fill 
                className="object-contain" 
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">{fileUrl.split('/').pop()}</p>
                <p className="text-xs text-muted-foreground">Document uploaded</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
