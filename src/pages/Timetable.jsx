import React, { useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { generateSchedule } from '../utils/scheduler';
import { Calendar as CalendarIcon, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const Timetable = () => {
    const { subjects, preferences } = useStudy();

    const scheduleData = useMemo(() => {
        if (!subjects || subjects.length === 0) return null;
        return generateSchedule(subjects, null, preferences);
    }, [subjects, preferences]);

    if (!scheduleData) {
        return (
            <div className="p-8 flex items-center justify-center h-[80vh]">
                <div className="text-center max-w-sm">
                    <CalendarIcon className="mx-auto text-slate-500 mb-4 opacity-30" size={48} />
                    <h2 className="text-xl font-bold text-slate-300 mb-2">No Schedule Generated</h2>
                    <p className="text-slate-500 text-sm mb-4">Go to "Strategy Engine" and add nodes to execute the dynamic solver.</p>
                </div>
            </div>
        );
    }

    const { calendar, daysRemaining } = scheduleData;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <header className="flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white">Dynamic Timetable</h1>
                    <p className="text-slate-400 mt-2">Multi-factor allocation model spanning {daysRemaining} days remaining.</p>
                </div>
                <div className="bg-slate-900/50 px-6 py-3 rounded-2xl border border-white/5 shadow-2xl flex items-center gap-3">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Daily Load: {preferences.dailyHours}h</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {calendar.map((day, index) => (
                    <Card
                        key={index}
                        delay={index * 0.03}
                        className="relative overflow-hidden group p-6 !pt-6 border-white/5 hover:border-white/10 transition-colors"
                    >
                        <div className={`absolute top-0 left-0 w-1 h-full ${
                             day.difficulty >= 4 ? 'bg-red-500' : 'bg-emerald-500'
                        }`} />
                        
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="font-bold text-white text-sm">{day.dayName}, {day.date.split('-')[2]}</h4>
                                <p className="text-[10px] text-slate-500 font-mono mt-1">{day.date}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-md font-bold border ${
                                day.difficulty >= 4 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                                Diff: {day.difficulty}
                            </span>
                        </div>

                        <div className="space-y-3 mt-4">
                             <div className="flex items-center gap-3 text-slate-200 font-semibold text-sm">
                                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <BookOpen size={14} className="text-blue-400 flex-shrink-0" />
                                 </div>
                                 <span className="truncate">{day.subject}</span>
                             </div>
                             <div className="flex items-start gap-3 text-slate-400 text-xs">
                                 <AlertCircle size={14} className="text-slate-500 mt-0.5 flex-shrink-0 opacity-50" />
                                 <span className="line-clamp-2 leading-relaxed">{day.task}</span>
                             </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                             <span className="text-slate-500">Duration</span>
                             <span className="text-white bg-white/5 px-2 py-1 rounded">{day.hours}h Block</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Timetable;
