import React from 'react';
import { useStudy } from '../context/StudyContext';
import { Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const Progress = () => {
    const { subjects } = useStudy();

    // Calculate global tracking based on mastery percentage
    const TARGET_MASTERY_MINS = 60; // 1 hour per topic is fully mastered

    const totalTopics = subjects.reduce((acc, sub) => acc + sub.topics.length, 0);
    
    // Instead of boolean completed, we aggregate mastery percentage (cap at 100% per topic)
    const aggregatedMastery = subjects.reduce((acc, sub) => {
        const subMastery = sub.topics.reduce((tAcc, t) => {
            const perc = Math.min((t.watchTime || 0) / TARGET_MASTERY_MINS, 1);
            return tAcc + perc;
        }, 0);
        return acc + subMastery;
    }, 0);

    const completionPercentage = totalTopics > 0 ? Math.round((aggregatedMastery / totalTopics) * 100) : 0;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-12">
            <header className="mb-6">
                <h1 className="text-4xl font-black text-white">Mastery Tracker</h1>
                <p className="text-slate-400 mt-2">Organic execution tracking linked directly to video session durations.</p>
            </header>

            {/* Achievement/Percent Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl flex items-center justify-between border border-white/10">
                <div>
                     <span className="text-blue-200 text-xs font-bold uppercase tracking-wider">Overall Organic Completion</span>
                     <div className="text-5xl font-extrabold mt-1">{completionPercentage}%</div>
                     <p className="text-blue-100 text-sm mt-2">Calculated from total node watch-time traces</p>
                </div>
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
                        <circle cx="48" cy="48" r="40" stroke="white" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * completionPercentage) / 100} className="transition-all duration-500 ease-in-out"/>
                    </svg>
                    <Award size={32} className="text-white" />
                </div>
            </motion.div>

            {/* Subject Detail Progress Arrays */}
            <div className="space-y-6">
                {subjects.map(subject => {
                    const subjectTopics = subject.topics.length;
                    const subMasteryScore = subject.topics.reduce((acc, t) => acc + Math.min((t.watchTime || 0) / TARGET_MASTERY_MINS, 1), 0);
                    const subjectPercent = subjectTopics > 0 ? Math.round((subMasteryScore / subjectTopics) * 100) : 0;

                    return (
                        <Card key={subject.id} className="space-y-6 !p-6">
                            <div className="flex justify-between items-center bg-transparent">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${subjectPercent >= 100 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`} />
                                    <h3 className="text-xl font-bold text-white tracking-wide">{subject.name}</h3>
                                </div>
                                <span className="text-sm font-bold text-slate-400">{subjectPercent}% Mastery</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {subject.topics.map(topic => {
                                    const rawMins = topic.watchTime || 0;
                                    const rawPerc = (rawMins / TARGET_MASTERY_MINS) * 100;
                                    const cappedPerc = Math.min(rawPerc, 100);
                                    const isMastered = cappedPerc === 100;

                                    return (
                                        <div key={topic.id} className="bg-slate-950/50 border border-white/5 p-4 rounded-xl relative overflow-hidden group">
                                            {/* Background ambient fill bar */}
                                            <div className="absolute top-0 left-0 h-full bg-emerald-500/10 transition-all duration-1000 ease-out" style={{ width: `${cappedPerc}%` }} />
                                            
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`font-bold truncate text-sm flex-1 pr-2 ${isMastered ? 'text-emerald-400' : 'text-slate-200'}`}>
                                                        {topic.name}
                                                    </span>
                                                    {isMastered && <Zap size={14} className="text-amber-400 flex-shrink-0" />}
                                                </div>
                                                
                                                <div className="flex justify-between items-end mt-4">
                                                    <span className="text-[10px] font-mono text-slate-500">{rawMins.toFixed(1)} / {TARGET_MASTERY_MINS}m</span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isMastered ? 'text-amber-400' : 'text-blue-500'}`}>
                                                        {Math.round(rawPerc)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default Progress;
