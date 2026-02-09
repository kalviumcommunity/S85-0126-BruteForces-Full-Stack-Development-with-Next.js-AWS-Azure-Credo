import Link from 'next/link';
import { ShieldCheck, Search, ArrowRight, Users, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
               <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Credo</span>
          </div>
          <nav className="flex gap-4">
             <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2">
                Merchant Login
             </Link>
             <Link href="/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
                Get Verified
             </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-14 lg:px-8 overflow-hidden">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>

          <div className="mx-auto max-w-4xl py-20 sm:py-32 lg:py-40 text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20">
                Building trust for the local economy. <Link href="#" className="font-semibold text-blue-600"><span className="absolute inset-0" aria-hidden="true" />Read the manifesto <span aria-hidden="true">&rarr;</span></Link>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
              Reputation is earned,<br />
              <span className="text-gradient">not bought.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Replace expensive background checks with community vouchers. 
              Credo verifies small businesses through real relationships.
            </p>
            
            <div className="mt-10 mx-auto max-w-2xl">
                <form action="/search" className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Search size={22} />
                    </div>
                    <input 
                        name="q"
                        type="search" 
                        placeholder="Search for a plumber, tutor, or local business..."
                        className="block w-full rounded-2xl border-0 py-4 pl-12 pr-40 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-lg sm:leading-6 transition-all"
                    />
                    <div className="absolute inset-y-2 right-2 flex">
                        <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                            Search
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="bg-slate-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">How it works</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A simple path to verification
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                
                <div className="flex flex-col items-start">
                  <div className="rounded-xl bg-white p-3 shadow-md ring-1 ring-slate-900/10 mb-6">
                    <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-slate-900">
                    1. Invite Vouchers
                  </dt>
                  <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Create a profile and invite 3 trusted community leaders or existing verified businesses to vouch for you.</p>
                  </dd>
                </div>

                <div className="flex flex-col items-start">
                  <div className="rounded-xl bg-white p-3 shadow-md ring-1 ring-slate-900/10 mb-6">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-slate-900">
                    2. Get Verified
                  </dt>
                  <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Once you reach 3 unique vouches, your business earns the "Community Verified" badge automatically.</p>
                  </dd>
                </div>

                <div className="flex flex-col items-start">
                  <div className="rounded-xl bg-white p-3 shadow-md ring-1 ring-slate-900/10 mb-6">
                    <ArrowRight className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-slate-900">
                    3. Grow Repuation
                  </dt>
                  <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">Accumulate trust points over time. High trust scores appear at the top of local search results.</p>
                  </dd>
                </div>

              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-slate-500">
              &copy; 2024 LocalTrust platform. Built for the community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
