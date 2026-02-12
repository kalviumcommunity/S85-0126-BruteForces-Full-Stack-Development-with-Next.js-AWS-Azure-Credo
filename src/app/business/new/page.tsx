'use client'

import { createBusiness } from "@/actions/business"
import { Loader2 } from "lucide-react"
import { useFormStatus, useFormState } from "react-dom"
import { FileUploader } from "@/components/business/FileUploader"
import { useState } from "react"
import { Button } from "@/components/ui/button"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin mr-2" /> : null}
      {pending ? 'Creating...' : 'Create Business'}
    </Button>
  )
}

export default function NewBusinessPage() {
  const [state, formAction] = useFormState(createBusiness, null)
  const [profileImage, setProfileImage] = useState<string>("")
  const [documents, setDocuments] = useState<string[]>([])

  const handleDocumentUpload = (url: string) => {
        if (url) {
            setDocuments(prev => [...prev, url])

        }
    }

    const removeDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    }
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Register Your Business</h1>
      {state?.error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-sm font-medium border border-destructive/20">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-6">
        <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input name="name" type="text" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. Joe's Coffee" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="What does your business do?" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input name="address" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="City, State" />
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
                <label className="block text-sm font-medium mb-2">Profile Image</label>
                <div className="bg-card border rounded-xl p-4">
                    <FileUploader 
                        onUploadComplete={setProfileImage} 
                        label="Upload Logo" 
                        type="image" 
                    />
                    <input type="hidden" name="profileImage" value={profileImage} />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium mb-2">Business Documents</label>
                <div className="bg-card border rounded-xl p-4">
                    <FileUploader 
                        onUploadComplete={handleDocumentUpload} 
                        label="Upload License/Permit" 
                        type="document" 
                        accept=".pdf,.doc,.docx"
                    />
                    <input type="hidden" name="documents" value={JSON.stringify(documents)} />
                    
                    {documents.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">{documents.length} document(s) added:</p>
                            {documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-muted/50 p-2 rounded-lg text-xs">
                                    <span className="truncate max-w-[200px]">{doc.split('/').pop()}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => removeDocument(idx)}
                                        className="text-destructive hover:text-destructive/80"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-4">
            <SubmitButton />
        </div>
      </form>
    </div>
  )
}
