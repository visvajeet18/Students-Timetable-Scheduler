import React, { useState, useEffect, useRef } from 'react';
import { useStudy } from '../context/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw, Layers, CheckCircle2, Circle, Timer } from 'lucide-react';
import Card from '../components/Card';

const Revision = () => {
    const { subjects, setSubjects, logStudySession, toggleTopicCompletion } = useStudy();
    const [activeTab, setActiveTab] = useState('ALL');
    const [zenMode, setZenMode] = useState(false);

    // Pomodoro Engine States
    const POMODORO_TIME = 25 * 60; // 25 mins
    const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
    const [isPomoRunning, setIsPomoRunning] = useState(false);
    const [activeSubjectForPomo, setActiveSubjectForPomo] = useState(null);
    const [activeTopicForPomo, setActiveTopicForPomo] = useState(null);
    const pomoTimerRef = useRef(null);

    // Pomodoro Tick Lifecycle
    useEffect(() => {
        if (isPomoRunning && timeLeft > 0) {
            pomoTimerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPomoRunning) {
            // Timer Finished Successfully
            clearInterval(pomoTimerRef.current);
            setIsPomoRunning(false);
            
            if (activeSubjectForPomo && activeTopicForPomo) {
                logStudySession(activeSubjectForPomo, activeTopicForPomo, 25, 'Pomodoro (Workstation)');
                alert('Pomodoro Complete! 25 Minutes Saved to Neural Memory.');
            }
            setTimeLeft(POMODORO_TIME);
            setActiveSubjectForPomo(null);
            setActiveTopicForPomo(null);
        } else {
            clearInterval(pomoTimerRef.current);
        }
        return () => clearInterval(pomoTimerRef.current);
    }, [isPomoRunning, timeLeft]);

    const formatPomoTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const abortPomo = () => {
        if(confirm("Abort current Pomodoro session? Time will NOT be saved.")) {
            setIsPomoRunning(false);
            setTimeLeft(POMODORO_TIME);
            setActiveSubjectForPomo(null);
            setActiveTopicForPomo(null);
        }
    };

    const activatePomoForTopic = (subId, topId) => {
        if(isPomoRunning) {
            if(confirm("A Pomodoro tracker is already running. Reset it to target this new node?")) {
                setActiveSubjectForPomo(subId);
                setActiveTopicForPomo(topId);
                setTimeLeft(POMODORO_TIME);
                setIsPomoRunning(false);
            }
        } else {
            setActiveSubjectForPomo(subId);
            setActiveTopicForPomo(topId);
            setTimeLeft(POMODORO_TIME);
            setIsPomoRunning(false);
        }
    };

    const allTopics = subjects.flatMap(sub => 
        sub.topics.map(t => ({ ...t, subjectName: sub.name, subjectId: sub.id, subDiff: sub.difficulty, method: sub.methodology }))
    );

    const filteredTopics = allTopics.filter(t => {
        if (activeTab === 'ACTIVE') return !t.completed;
        if (activeTab === 'DONE') return t.completed;
        return true;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-12">
            <header className="flex justify-between items-end flex-wrap gap-4 mb-6">
                <div>
                    <h1 className="text-4xl font-black text-white">Focus Workstation</h1>
                    <p className="text-slate-400 mt-2">Iterative spaced-repetition and deeply immersive execution tracker.</p>
                </div>

                <div className="flex bg-slate-900 border border-white/5 rounded-xl p-1 gap-1">
                    {['ALL', 'ACTIVE', 'DONE'].map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                                activeTab === t 
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Workstation Queue */}
                <Card className="xl:col-span-2 !p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Layers className="text-purple-500" /> Pending Queue
                    </h3>
                    
                    {filteredTopics.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 bg-white/5 rounded-xl border border-white/5">
                            No topics found. Shift tabs or populate Strategy Engine.
                        </div>
                    ) : (
                        <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredTopics.map((t, i) => {
                                const isActive = t.id === activeTopicForPomo;
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: Math.min(i * 0.05, 0.5) }}
                                        key={t.id}
                                        onClick={() => {
                                            if (!t.completed) activatePomoForTopic(t.subjectId, t.id);
                                        }}
                                        className={`flex items-center gap-4 p-5 rounded-xl border text-left transition-all cursor-pointer ${isActive ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)] ring-1 ring-blue-500 shadow-inner' : t.completed ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 opacity-60' : 'bg-slate-900/50 border-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className="flex-1 min-w-0 pointer-events-none">
                                            <p className={`font-bold truncate ${t.completed ? 'text-emerald-300' : isActive ? 'text-white' : 'text-slate-200'}`}>
                                                {t.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] uppercase tracking-widest ${isActive ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>{t.subjectName}</span>
                                                {t.method && <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-blue-400 border border-blue-500/20">{t.method}</span>}
                                            </div>
                                        </div>
                                        
                                        {isActive ? (
                                            <span className="px-3 py-1 text-[10px] font-black uppercase rounded-lg border bg-blue-500/20 text-blue-400 border-blue-500/50 animate-pulse">
                                                LOCKED
                                            </span>
                                        ) : !t.completed && (
                                            <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-lg border bg-white/5 text-slate-400 border-white/10">
                                                SELECT
                                            </span>
                                        )}

                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleTopicCompletion(t.subjectId, t.id); }}
                                            className={`p-2 rounded-lg transition-colors border ${t.completed ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
                                            title="Mark Topic as Mathematically Completed"
                                        >
                                            <CheckCircle2 size={18} />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* Pomodoro Timer Hub / 3D Flashcard */}
                <div className="space-y-6">
                    <AnimatePresence>
                        {(zenMode ? true : true) /* Always render but change absolute pos when Zen */}
                    </AnimatePresence>
                    <div className={`${zenMode ? 'fixed inset-0 z-[100] bg-black flex items-center justify-center backdrop-blur-3xl p-12' : 'h-[400px] relative'} perspective-[2000px] transition-all duration-700`}>
                        <motion.div
                            animate={{ rotateY: isPomoRunning ? 180 : 0 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className={`${zenMode ? 'w-full max-w-2xl h-[600px]' : 'w-full h-full'} relative preserve-3d`}
                        >
                            {/* Card Front (Idle State) */}
                            <div 
                                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                                className="absolute inset-0 w-full h-full bg-slate-900/30 backdrop-blur-2xl border border-blue-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.1)] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/40 transition-colors"
                                onClick={() => {
                                    // Base Card Click
                                }}
                            >
                                <Layers size={48} className="mb-6 text-blue-500 opacity-50" />
                                <div className="text-[10px] uppercase font-bold tracking-widest text-blue-500 mb-4">
                                   Awaiting Neural Hook
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-black mb-4 px-8 text-white">
                                    {activeSubjectForPomo ? 
                                        subjects.find(s => s.id === activeSubjectForPomo)?.topics.find(t=>t.id === activeTopicForPomo)?.name 
                                        : 'Idle Deck'}
                                </h2>
                                <p className="text-xs text-slate-400 font-bold max-w-[250px] mb-8">
                                    {activeSubjectForPomo ? 'Ready. Click to Initialize.' : 'Select a topic from the Workstation Queue to prime the deck.'}
                                </p>

                                <div className="flex gap-4">
                                    <button 
                                        disabled={!activeSubjectForPomo}
                                        onClick={(e) => { e.stopPropagation(); setIsPomoRunning(true); }}
                                        className="px-6 py-3 rounded-xl bg-orange-500 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-600 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
                                    >
                                        Initiate Trace
                                    </button>
                                    <button 
                                        disabled={!activeSubjectForPomo && !zenMode}
                                        onClick={(e) => { e.stopPropagation(); setZenMode(!zenMode); }}
                                        className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-all cursor-pointer shadow-lg"
                                    >
                                        {zenMode ? 'Exit Zen Mode' : 'Enter Zen'}
                                    </button>
                                </div>
                            </div>

                            {/* Card Back (Active State) */}
                            <div 
                                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                className="absolute inset-0 w-full h-full bg-slate-900/30 backdrop-blur-2xl border border-orange-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] flex flex-col items-center justify-center text-center"
                            >
                                <Timer size={zenMode ? 96 : 48} className={`mb-6 ${isPomoRunning ? 'text-orange-500 animate-pulse' : 'text-slate-600'}`} />
                                
                                <div className="text-[10px] uppercase font-bold tracking-widest text-orange-500 mb-2">
                                   🔴 POMODORO ACTIVE
                                </div>
                                
                                <h2 className={`${zenMode ? 'text-[12rem]' : 'text-7xl'} font-black tabular-nums tracking-tighter mb-4 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all`}>
                                    {formatPomoTime(timeLeft)}
                                </h2>

                                <p className={`${zenMode ? 'text-xl' : 'text-xs'} text-slate-400 min-h-[40px] px-4 font-bold`}>
                                    {subjects.find(s => s.id === activeSubjectForPomo)?.topics.find(t=>t.id === activeTopicForPomo)?.name || 'Unknown'}
                                </p>

                                <div className="flex gap-4 w-full px-8 mt-4 max-w-sm mx-auto">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setIsPomoRunning(false); }} 
                                        className="flex-1 py-3 justify-center rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer border bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 opacity-80 backdrop-blur-md"
                                    >
                                        <Pause size={18} /> PAUSE
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setZenMode(!zenMode); }} 
                                        className="flex-1 py-3 justify-center rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer border bg-slate-800 text-white border-slate-700 hover:bg-slate-700 opacity-80 backdrop-blur-md"
                                    >
                                         {zenMode ? 'EXIT ZEN' : 'ENTER ZEN'}
                                    </button>
                                </div>
                                
                                {isPomoRunning && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); abortPomo(); setZenMode(false); }}
                                        className="mt-6 text-[10px] font-bold uppercase tracking-widest text-red-500/70 hover:text-red-400 transition-colors cursor-pointer"
                                    >
                                        Abort Sequence & Exit
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <Card>
                        <h3 className="text-lg font-bold text-white mb-4">Pomodoro Ruleset</h3>
                        <ul className="text-sm text-slate-400 space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-500 shrink-0">1.</span>
                                <span>Lock onto a pending node from the Queue.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-orange-500 shrink-0">2.</span>
                                <span>Click the flashcard to flip and initiate absolute isolation.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-emerald-500 shrink-0">3.</span>
                                <span>Clock auto-syncs duration directly into your organic Mastery chart.</span>
                            </li>
                        </ul>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default Revision;
