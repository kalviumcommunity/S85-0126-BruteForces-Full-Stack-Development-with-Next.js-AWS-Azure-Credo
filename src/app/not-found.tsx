import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
            <FileQuestion size={40} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-slate-600">The page you are looking for doesn't exist or has been moved.</p>
        <div>
            <Link 
                href="/" 
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
                Return Home
            </Link>
        </div>
      </div>
    </div>
  )
}
