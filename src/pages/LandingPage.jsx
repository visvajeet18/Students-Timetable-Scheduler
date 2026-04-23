import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Brain, Zap, Shield } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
            {/* Navigation */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold tracking-tight text-slate-900">NeuroPlan</div>
                <div className="space-x-8 hidden md:block text-sm font-medium text-slate-600">
                    <a href="#philosophy" className="hover:text-blue-600 transition-colors">Philosophy</a>
                    <a href="#features" className="hover:text-blue-600 transition-colors">System</a>
                    <a href="#pricing" className="hover:text-blue-600 transition-colors">Research</a>
                </div>
                <Link to="/dashboard" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition-transform">
                    Launch Planner
                </Link>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            v3.0 Stable Release
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                            Rule-Based <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Academic Intelligence.</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-lg mt-6 leading-relaxed">
                            Stop scheduling randomly. NeuroPlan uses cognitive load theory, spaced repetition, and difficulty-weighted algorithms to build the perfect study strategy.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="flex gap-4 pt-4"
                    >
                        <Link to="/dashboard" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2">
                            Start Optimization <ArrowRight size={18} />
                        </Link>
                        <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:border-slate-300 transition-colors">
                            Read the Research
                        </button>
                    </motion.div>

                    <div className="pt-8 border-t border-slate-200 flex gap-8">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-900">3yr</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Development</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-900">14+</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Logic Rules</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-900">100%</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Algorithmic</span>
                        </div>
                    </div>
                </div>

                {/* Visual / Screenshot Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-60"></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                        <div className="bg-slate-50 rounded-xl overflow-hidden h-[500px] border border-slate-100 relative">
                            {/* Mock UI Elements for Landing Page decoration */}
                            <div className="absolute top-0 left-0 right-0 h-10 bg-slate-900 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="pt-14 px-6 space-y-4">
                                <div className="flex gap-4 mb-8">
                                    <div className="h-32 w-1/3 bg-blue-50 rounded-xl border border-blue-100"></div>
                                    <div className="h-32 w-1/3 bg-white rounded-xl border border-slate-100"></div>
                                    <div className="h-32 w-1/3 bg-white rounded-xl border border-slate-100"></div>
                                </div>
                                <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-12 w-full bg-slate-50 rounded-lg border border-slate-100"></div>
                                    <div className="h-12 w-full bg-slate-50 rounded-lg border border-slate-100"></div>
                                    <div className="h-12 w-full bg-slate-50 rounded-lg border border-slate-100"></div>
                                    <div className="h-12 w-full bg-slate-50 rounded-lg border border-slate-100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Feature Grid */}
            <section id="features" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Why Rule-Based Scheduling?</h2>
                        <p className="mt-4 text-slate-500 max-w-2xl mx-auto">AI hallucinates. Rules don't. Our deterministic engine ensures every minute is accounted for based on proven cognitive science.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: Brain, title: "Cognitive Load Theory", text: "Prevents burnout by capping daily intense sessions and distributing difficulty evenly." },
                            { icon: Zap, title: "Spaced Repetition", text: "Automatically schedules revision blocks at optimal forgetting intervals." },
                            { icon: Shield, title: "Burnout Protection", text: "Mandatory rest periods and weighted weekends to ensure long-term consistency." }
                        ].map((feature, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
