'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ThreeDCard, CardBody, CardContent } from '@/components/ui/ThreeDCard'
import { Quote } from 'lucide-react'

const TESTIMONIALS = [
    {
        name: "Sarah Chen",
        role: "Small Business Owner",
        text: "Credo helped me build trust with new clients instantly. The verification badge is a game changer.",
        rating: 5,
        color: "bg-amber-100"
    },
    {
        name: "James Wilson",
        role: "Procurement Manager",
        text: "We only source from Credo-verified suppliers now. It cuts our vetting time by 90%.",
        rating: 5,
        color: "bg-blue-100"
    },
    {
        name: "Elena Rodriguez",
        role: "Freelance Designer",
        text: "Getting vouched for by industry leaders gave my portfolio the credibility it needed.",
        rating: 5,
        color: "bg-rose-100"
    }
]

export function TestimonialsSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        Trusted by the <span className="text-blue-600">Community</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                        Join thousands of businesses building their reputation on the verifiable web.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                        >
                            <ThreeDCard className="h-full" containerClassName="py-4">
                                <CardBody className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl">
                                    <div className="absolute top-6 right-8 opacity-10">
                                        <Quote size={64} />
                                    </div>
                                    <CardContent translateZ={30}>
                                        <div className="flex gap-4 items-center mb-6">
                                            <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-lg font-bold text-slate-700`}>
                                                {t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{t.name}</h4>
                                                <p className="text-sm text-slate-500">{t.role}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    
                                    <CardContent translateZ={20}>
                                         <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                            "{t.text}"
                                         </p>
                                    </CardContent>

                                    <CardContent translateZ={40} className="mt-6 flex gap-1">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <div key={i} className="w-2 h-2 rounded-full bg-yellow-400" />
                                        ))}
                                    </CardContent>
                                </CardBody>
                            </ThreeDCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
