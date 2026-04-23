import React, { useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const Heatmap = () => {
    const { studyHistory } = useStudy();

    const activityData = useMemo(() => {
        const getLocalDateStr = (d) => {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        const days = [];
        const today = new Date();
        today.setHours(0,0,0,0);
        
        for (let i = 34; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            days.push({
                dateObj: d,
                dateStr: getLocalDateStr(d),
                totalMinutes: 0
            });
        }

        if (studyHistory && studyHistory.length > 0) {
            studyHistory.forEach(ev => {
                const evDate = new Date(ev.timestamp);
                const pureDateString = getLocalDateStr(evDate);
                const match = days.find(d => d.dateStr === pureDateString);
                if (match) {
                    match.totalMinutes += (ev.duration || 0);
                }
            });
        }
        return days;
    }, [studyHistory]);

    const getColorIntensity = (mins) => {
        if (mins >= 120) return 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] border-blue-400 text-white font-black';
        if (mins >= 60)  return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-400 text-white font-black';
        if (mins >= 30)  return 'bg-emerald-500/70 border-emerald-500/50 text-white font-bold';
        if (mins > 0)    return 'bg-emerald-500/40 border-emerald-500/40 text-emerald-100 font-bold';
        return 'bg-white/5 border-white/10 text-slate-700'; // 0 mins
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-12">
            <header className="mb-6">
                <h1 className="text-4xl font-black text-white">Execution Matrix</h1>
                <p className="text-slate-400 mt-2">Organic activity heatmap derived from absolute Focus Engine tracking durations.</p>
            </header>

            <Card className="p-8 pb-10 overflow-x-auto">
                <div className="min-w-[700px]">
                    <div className="flex gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest pl-10">
                        {/* Just a slight spacer offset hack */}
                    </div>
                    
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-3 text-[10px] font-bold text-slate-500 uppercase justify-between py-2">
                             <span>Mon</span>
                             <span>Wed</span>
                             <span>Fri</span>
                             <span>Sun</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 flex-col h-[180px]">
                            {activityData.map((day, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.01 }}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all hover:scale-110 shadow-lg border ${getColorIntensity(day.totalMinutes)}`}
                                    title={`${day.dateStr}: ${Math.round(day.totalMinutes)} mins`}
                                >
                                    {day.dateStr.split('-')[2]}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex gap-6 items-center flex-wrap text-xs font-bold uppercase tracking-widest text-slate-400 mt-4 px-2">
                <span className="text-slate-600">Intensity Legend:</span>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white/5 border border-white/10"/> Inactive</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500/40 border border-emerald-500/40"/> Light (&lt;30m)</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500/70 border border-emerald-500/50"/> Moderate (30m+)</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-400"/> Heavy (60m+)</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-600 border border-blue-400"/> Critical (120m+)</div>
            </div>
        </div>
    );
};

export default Heatmap;
