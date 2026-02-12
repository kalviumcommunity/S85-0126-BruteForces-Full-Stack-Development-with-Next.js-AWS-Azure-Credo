'use client';

import { FileUploader } from "@/components/business/FileUploader";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateBusiness } from "@/actions/business";

interface SettingsFormProps {
  business: {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    profileImage: string | null;
    documents: string[];
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : <Save className="mr-2 w-4 h-4" />}
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function SettingsForm({ business }: SettingsFormProps) {
  const [state, formAction] = useFormState(updateBusiness, null);
  const [profileImage, setProfileImage] = useState<string>(business.profileImage || "");
  const [documents, setDocuments] = useState<string[]>(business.documents || []);

  const handleDocumentUpload = (url: string) => {
    if (url) {
        setDocuments(prev => [...prev, url]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
        <input type="hidden" name="businessId" value={business.id} />
        
        {state?.error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm font-medium border border-destructive/20">
            {state.error}
            </div>
        )}
        {state?.success && (
             <div className="bg-emerald-500/10 text-emerald-600 p-3 rounded-lg text-sm font-medium border border-emerald-500/20">
             {state.success}
             </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Profile Image Section */}
        <div>
          <label className="block text-sm font-medium mb-2">Business Logo</label>
          <div className="bg-card border rounded-xl p-4">
             <div className="flex flex-col items-center gap-4">
                {profileImage ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20">
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-4xl text-muted-foreground font-bold">{business.name.charAt(0)}</span>
                    </div>
                )}
                
                <div className="w-full">
                    <FileUploader 
                        onUploadComplete={setProfileImage} 
                        label={profileImage ? "Change Logo" : "Upload Logo"}
                        type="image" 
                    />
                </div>
                <input type="hidden" name="profileImage" value={profileImage} />
             </div>
          </div>
        </div>

        {/* Main Details Section */}
        <div className="space-y-6">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Business Name</label>
                    <input 
                        name="name" 
                        defaultValue={business.name} 
                        required 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    />
                </div>
                
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                        name="description" 
                        defaultValue={business.description || ''}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    />
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">Address</label>
                    <input 
                        name="address" 
                        defaultValue={business.address || ''}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    />
                </div>
            </div>

            {/* Documents Section */}
            <div className="pt-4 border-t">
                <label className="block text-sm font-medium mb-4">Business Documents & Verification</label>
                <div className="bg-card border rounded-xl p-6">
                    <FileUploader 
                        onUploadComplete={handleDocumentUpload} 
                        label="Upload New Document" 
                        type="document" 
                        accept=".pdf,.doc,.docx"
                    />
                    <input type="hidden" name="documents" value={JSON.stringify(documents)} />
                    
                    {documents.length > 0 ? (
                        <div className="mt-6 space-y-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Uploaded Documents</h4>
                            {documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border text-sm group hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-primary">DOC</span>
                                        </div>
                                        <a href={doc} target="_blank" className="truncate hover:underline text-foreground/80 hover:text-foreground">
                                            {doc.split('/').pop()}
                                        </a>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeDocument(idx)}
                                        className="text-muted-foreground hover:text-destructive p-2 rounded-md hover:bg-destructive/10 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-4 text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg bg-muted/20">
                            No documents uploaded yet
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <SubmitButton />
            </div>
        </div>
      </div>
    </form>
  );
}
