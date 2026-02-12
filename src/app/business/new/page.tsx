'use client'

import { createBusiness } from "@/actions/business"
import { Loader2 } from "lucide-react"
import { useFormStatus, useFormState } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
      {pending ? <Loader2 className="animate-spin" /> : 'Create Business'}
    </button>
  )
}

export default function NewBusinessPage() {
  const [state, formAction] = useFormState(createBusiness, null)

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Register Your Business</h1>
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input name="name" type="text" required className="w-full border rounded-lg p-2 bg-background text-foreground" placeholder="e.g. Joe's Coffee" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" className="w-full border rounded-lg p-2 bg-background text-foreground" placeholder="What does your business do?" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input name="address" type="text" className="w-full border rounded-lg p-2 bg-background text-foreground" placeholder="City, State" />
        </div>
        <div className="flex justify-end">
            <SubmitButton />
        </div>
      </form>
    </div>
  )
}
