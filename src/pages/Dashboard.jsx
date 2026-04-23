import React, { useMemo, useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import Card from '../components/Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Zap, Lightbulb, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TECH_FACTS = [
    "The first computer bug was an actual real-life moth.",
    "The domain name www.symbolics.com was the first to be registered, in 1985.",
    "The QWERTY keyboard was designed to slow you down.",
    "The first 1GB hard drive weighed over 500 pounds.",
    "More than 500 hours of video are uploaded to YouTube every minute.",
    "The word 'robot' comes from the Czech word 'robota' meaning forced labor.",
    "Email has been around longer than the World Wide Web.",
    "The first webcam was created to check a coffee pot at Cambridge University.",
    "Margaret Hamilton wrote the code that got humans to the moon and coined the term 'software engineering'.",
    "A single Google query uses enough energy to power a 60W lightbulb for 17 seconds."
];

const AiAnalystWidget = ({ stats, subjects }) => {
    const [typedStr, setTypedStr] = useState('');
    
    const analysis = useMemo(() => {
        if (subjects.length === 0) return "Awaiting configuration. Define strategy nodes to begin neural synchronization.";
        if (stats.progress === 100) return "Optimal state achieved. Absolute mastery acquired across all mapped arrays.";
        if (stats.progress > 70) return "High-velocity tracking. You are dominating the knowledge graph. Maintain current flow.";
        if (stats.totalMinutes > 1000 && stats.progress < 30) return "Warning: High cognitive load detected with low mastery output. Recommend utilizing 'Active Recall' methodology.";
        return "Systems nominal. Cognitive architecture is expanding. Engage Pomodoro workstations for maximum retention.";
    }, [stats, subjects]);

    useEffect(() => {
        let i = 0;
        let currentStr = '';
        const interval = setInterval(() => {
            if(i < analysis.length) {
                currentStr += analysis.charAt(i);
                setTypedStr(currentStr);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [analysis]);

    return (
        <Card className="border-indigo-500/30 bg-indigo-950/20 shadow-[0_0_50px_rgba(79,70,229,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 animate-[pulse_2s_infinite]" />
            <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shrink-0">
                    <Cpu size={24} className="text-indigo-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-[10px] font-black text-indigo-400 tracking-widest uppercase mb-1 flex items-center gap-2">
                        <Zap size={10} className="animate-pulse" /> Neural Link Analyst
                    </h3>
                    <p className="text-sm font-mono text-indigo-100 min-h-[40px] flex">
                        <span className="text-indigo-500 mr-2">{'>'}</span> 
                        {typedStr}
                        <span className="w-2 h-4 bg-indigo-400 ml-1 mt-1 animate-pulse" />
                    </p>
                </div>
            </div>
        </Card>
    );
};

const Dashboard = () => {
    const { stats, subjects, studyHistory } = useStudy();
    const [factPopupVisible, setFactPopupVisible] = useState(false);
    const [currentFact, setCurrentFact] = useState('');

    const showRandomFact = () => {
        let newFact;
        do {
            newFact = TECH_FACTS[Math.floor(Math.random() * TECH_FACTS.length)];
        } while (newFact === currentFact && TECH_FACTS.length > 1);
        setCurrentFact(newFact);
        setFactPopupVisible(true);
    };
    
    const chartData = useMemo(() => {
        if (!studyHistory || studyHistory.length === 0) {
             return [{ date: 'No Data', duration: 0 }];
        }
        const grouping = {};
        studyHistory.forEach(ev => {
             const day = new Date(ev.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
             grouping[day] = (grouping[day] || 0) + (ev.duration || 0);
        });
        
        // Ensure some baseline so chart draws
        const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return order.map(d => ({ date: d, duration: grouping[d] || 0 }));
    }, [studyHistory]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <header className="flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white">Welcome back, Visva.</h1>
                    <p className="text-slate-400 mt-2 font-bold tracking-widest text-xs uppercase flex items-center gap-2">
                        <span>Current Synchronization:</span> 
                        <span className={`px-2 py-0.5 rounded ${stats.rank.color} bg-opacity-20 border`}>{stats.rank.title} Rank</span>
                    </p>
                </div>
                <div className="bg-slate-900/50 px-6 py-3 rounded-2xl border border-white/5 shadow-2xl">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Efficiency</p>
                    <p className="text-xl font-black text-white">{stats.progress}%</p>
                </div>
            </header>

            <AiAnalystWidget stats={stats} subjects={subjects} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { l: 'Focus Mins', v: stats.totalMinutes, c: 'border-blue-500' }, 
                    { l: 'Nodes Done', v: stats.done + '/' + stats.total, c: 'border-emerald-500' }, 
                    { l: 'Peak', v: '09:30', c: 'border-orange-500' }, 
                    { l: 'Streak', v: '12D', c: 'border-purple-500' }
                ].map((s, i) => (
                    <Card key={i} className={`border border-solid border-t-[1px] border-r-[1px] border-b-[1px] border-l-4 ${s.c} !p-6`}>
                        <p className="text-xs font-bold text-slate-500 uppercase">{s.l}</p>
                        <h2 className="text-3xl font-black text-white mt-2">{s.v}</h2>
                    </Card>
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 min-h-[350px]">
                    <h3 className="text-xl font-bold text-white mb-8">Neuro-Load Trend (Minutes)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <XAxis dataKey="date" hide /> 
                                <YAxis hide />
                                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                <Area type="monotone" dataKey="duration" stroke="#3b82f6" fill="#3b82f622" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                <Card>
                    <h3 className="text-xl font-bold text-white mb-6">Mastery Distribution</h3>
                    <div className="space-y-4">
                        {subjects.slice(0, 5).map(s => {
                            const p = s.topics.length > 0 ? (s.topics.filter(t => t.completed).length / s.topics.length) * 100 : 0;
                            return (
                                <div key={s.id} className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-slate-300 truncate pr-4">{s.name}</span>
                                        <span className="text-blue-500">{Math.round(p)}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${p}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                        {subjects.length === 0 && (
                            <p className="text-slate-600 italic text-sm py-10 text-center">Zero nodes active.</p>
                        )}
                    </div>
                </Card>
            </div>

            {/* Fact Popup & Button */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                <AnimatePresence>
                    {factPopupVisible && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-indigo-900/90 backdrop-blur-xl border border-indigo-500/50 p-4 rounded-2xl shadow-2xl max-w-xs"
                        >
                            <div className="flex justify-between items-start mb-2 gap-4">
                                <div className="flex items-center gap-2 text-indigo-300 font-bold text-[10px] uppercase tracking-widest">
                                    <Lightbulb size={12} className="text-yellow-400" /> Tech Fact
                                </div>
                                <button onClick={() => setFactPopupVisible(false)} className="text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full p-1 border border-white/10 hover:bg-white/10 shrink-0">
                                    <X size={12} />
                                </button>
                            </div>
                            <p className="text-white text-sm font-medium leading-relaxed">{currentFact}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button 
                    onClick={showRandomFact}
                    className="flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-indigo-300 text-white font-bold py-3 px-6 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-95 border border-indigo-400/30"
                >
                    <Lightbulb size={18} fill="currentColor" className="text-yellow-300" />
                    <span className="tracking-wide">Learn New Facts</span>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
