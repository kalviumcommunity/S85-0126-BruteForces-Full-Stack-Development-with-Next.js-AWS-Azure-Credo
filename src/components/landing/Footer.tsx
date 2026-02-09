'use client'

import Link from 'next/link'
import { ShieldCheck, Twitter, Github, Linkedin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                     <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <ShieldCheck size={24} />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">Credo</span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            The decentralized reputation layer for the modern web. Verify, vouch, and build trust without intermediaries.
                        </p>
                     </div>
                     
                     <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Platform</h3>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link href="/search" className="hover:text-blue-600 transition-colors">Search Businesses</Link></li>
                            <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Merchant Dashboard</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Trust Protocol</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">API Access</Link></li>
                        </ul>
                     </div>
                     
                     <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers (Hiring!)</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Legal & Privacy</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                        </ul>
                     </div>

                     <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Connect</h3>
                        <div className="flex gap-4 text-slate-400">
                             <a href="#" className="hover:text-blue-600 hover:scale-110 transition-all"><Twitter size={20} /></a>
                             <a href="#" className="hover:text-slate-900 dark:hover:text-white hover:scale-110 transition-all"><Github size={20} /></a>
                             <a href="#" className="hover:text-blue-700 hover:scale-110 transition-all"><Linkedin size={20} /></a>
                        </div>
                     </div>
                </div>
                
                <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">&copy; 2024 Credo Protocol Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
