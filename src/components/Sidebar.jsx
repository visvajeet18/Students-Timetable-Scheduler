import React, { useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Brain, LayoutDashboard, Target, RefreshCw, Settings, Calendar, Activity, PieChart, TrendingUp, LineChart, PlayCircle, Network, Headphones, PauseCircle } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

const Sidebar = ({ isOpen, toggle }) => {
    const location = useLocation();
    const { stats } = useStudy();
    const [lofiPlaying, setLofiPlaying] = useState(false);
    const audioRef = useRef(null);
    
    const items = [
        { n: 'Dashboard', p: '/dashboard', icon: LayoutDashboard },
        { n: 'Neural Graph', p: '/knowledge-tree', icon: Network },
        { n: 'Strategy', p: '/create-plan', icon: Target },
        { n: 'Video Hub', p: '/watch', icon: PlayCircle },
        { n: 'Timetable', p: '/timetable', icon: Calendar },
        { n: 'Heatmap', p: '/heatmap', icon: Activity },
        { n: 'Workstation', p: '/revision', icon: RefreshCw },
        { n: 'Allocation', p: '/allocation', icon: PieChart },
        { n: 'Progress', p: '/progress', icon: TrendingUp },
        { n: 'Analytics', p: '/analytics', icon: LineChart },
        { n: 'System', p: '/settings', icon: Settings },
    ];

    const toggleLofi = () => {
        if (!audioRef.current) return;
        if (lofiPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setLofiPlaying(!lofiPlaying);
    };

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#020617] border-r border-white/5 transition-transform duration-500 flex flex-col lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <audio ref={audioRef} loop src="https://stream.zeno.fm/f3wvbbqmdg8uv" />
            
            <div className="flex flex-col px-6 flex-1 min-h-0">
                <div className="h-24 flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                        <Brain className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter uppercase">
                        Neuro<span className="text-blue-500">Plan</span>
                    </span>
                </div>
                
                <nav className="flex-1 space-y-2 py-4 overflow-y-auto custom-scrollbar">
                    {items.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.p);
                        return (
                            <NavLink 
                                key={item.p} 
                                to={item.p}
                                onClick={() => { if (window.innerWidth < 1024) toggle(); }} 
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${isActive ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Icon size={20} className={isActive ? 'text-blue-500' : ''} />
                                {item.n}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
            
            {/* Global Lofi Player & Rank HUD */}
            <div className="p-6 shrink-0 border-t border-white/5 flex flex-col gap-4">
                <button 
                    onClick={toggleLofi}
                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${lofiPlaying ? 'bg-purple-900/20 border-purple-500/30 text-purple-400' : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-white/5'}`}
                >
                    <div className="flex items-center gap-3">
                        {lofiPlaying ? <PauseCircle size={20} className="animate-pulse" /> : <Headphones size={20} />}
                        <span className="text-xs font-bold uppercase tracking-widest">{lofiPlaying ? 'Lofi Ambient ON' : 'Focus Stream OFF'}</span>
                    </div>
                    {lofiPlaying && (
                        <div className="flex items-end gap-1 h-3">
                            <div className="w-1 bg-purple-500 animate-[bounce_1s_infinite_0ms] h-full" />
                            <div className="w-1 bg-purple-500 animate-[bounce_1s_infinite_200ms] h-2/3" />
                            <div className="w-1 bg-purple-500 animate-[bounce_1s_infinite_400ms] h-full" />
                        </div>
                    )}
                </button>

                <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${stats.rank.color}`}>
                    <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center font-black">
                        {stats.rank.title.charAt(0)}
                    </div>
                    <div>
                        <p className={`text-[10px] uppercase font-black tracking-widest ${stats.rank.iconColor}`}>Level &bull; <span className="text-white">{stats.rank.rawMins} XP</span></p>
                        <p className="text-xs font-black truncate">{stats.rank.title}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
