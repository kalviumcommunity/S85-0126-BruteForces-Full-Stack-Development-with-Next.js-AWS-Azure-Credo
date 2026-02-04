import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">404 Not Found</h2>
        <p className="mt-2 text-slate-600">Could not find requested resource</p>
        <div className="mt-6">
            <Link
                href="/"
                className="rounded-md bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
            >
                Return Home
            </Link>
        </div>
      </div>
    </div>
  )
}
