import Link from "next/link";
import { ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-100 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <ShieldCheck className="text-blue-600" />
            Credo
          </div>
          <div className="space-x-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Trust is the new currency for <br/>
          <span className="text-blue-600">Entrepreneurship</span>
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
          Credo builds a digital identity for your business based on community vouches, not just government papers. Prove your trustworthiness and grow.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Claim Your Business Profile
          </Link>
          <Link href="/p/demo" className="bg-slate-100 text-slate-900 px-8 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
            View Demo Profile
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <ShieldCheck className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Verified Identity</h3>
            <p className="text-slate-600">Get a unique QR code and public profile that proves you are a legitimate, verified business.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Users className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Community Vouches</h3>
            <p className="text-slate-600">Accumulate trust points when other businesses and customers vouch for your service.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="text-purple-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Trust Score</h3>
            <p className="text-slate-600">Level up from Basic to Community Verified. Higher tiers unlock better financial opportunities.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
