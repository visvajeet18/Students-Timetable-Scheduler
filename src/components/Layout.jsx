import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden">
            {/* Animated Spatial Background Mesh */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-900/20 rounded-full blur-[120px] mix-blend-screen animate-[spin_20s_linear_infinite]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[150px] mix-blend-screen animate-[spin_25s_linear_infinite_reverse]" />
            </div>

            <div className="relative z-10 flex">
                <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
                
                <div className="lg:pl-72 min-h-screen flex flex-col w-full">
                    <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#020617]/50 backdrop-blur-3xl z-40">
                        <button 
                            onClick={() => setSidebarOpen(true)} 
                            className="lg:hidden p-2 text-slate-400 bg-white/5 rounded-xl"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-6 ml-auto lg:ml-0 lg:w-full lg:justify-end">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Active Stream</p>
                                <p className="text-sm font-bold text-white italic">Neural Flow Enabled</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white italic shadow-lg">
                                V
                            </div>
                        </div>
                    </header>
                    
                    <main className="p-4 md:p-8 flex-1 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
