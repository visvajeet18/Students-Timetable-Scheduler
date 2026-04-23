import React, { useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { generateSchedule } from '../utils/scheduler';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from '../components/Card';

const Allocation = () => {
    const { subjects, preferences } = useStudy();

    const scheduleData = useMemo(() => {
        if (!subjects || subjects.length === 0) return null;
        return generateSchedule(subjects, null, preferences);
    }, [subjects, preferences]);

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    if (!scheduleData) {
        return (
            <div className="p-8 flex items-center justify-center h-[80vh]">
                <div className="text-center text-slate-500">
                    <h2 className="text-xl font-bold text-slate-300 mb-2">No Allocation Data</h2>
                    <p className="text-sm">Please define subject scores and exam dates to trigger optimizer execution.</p>
                </div>
            </div>
        );
    }

    const { allocation } = scheduleData;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="mb-6">
                <h1 className="text-4xl font-black text-white">Smart Allocation Engine</h1>
                <p className="text-slate-400 mt-2">Weighted distribution of target available hours based on cognitive load indexers.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="font-semibold text-white mb-4">Proportional Volume %</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={allocation}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="allocatedHours"
                                    nameKey="name"
                                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                                >
                                    {allocation.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card delay={0.1}>
                    <h3 className="font-semibold text-white mb-4">Calculated Intensity Score vs Allocation</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={allocation}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', color: '#fff' }} />
                                <Bar dataKey="coreScore" fill="#475569" name="Input Score Index" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="allocatedHours" fill="#3B82F6" name="Allocated Hours" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-xs font-bold text-slate-500 uppercase">
                                <th className="p-4">Subject</th>
                                <th className="p-4">Difficulty Weight</th>
                                <th className="p-4">Topics Count</th>
                                <th className="p-4">Final Score index</th>
                                <th className="p-4">Allocated Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocation.map((sub, i) => (
                                <tr key={sub.id} className="border-b border-white/5 bg-transparent hover:bg-white/5 text-sm transition-colors">
                                    <td className="p-4 font-semibold text-white">{sub.name}</td>
                                    <td className="p-4 text-slate-400">{sub.difficulty}x</td>
                                    <td className="p-4 text-slate-400">{sub.topicsCount}</td>
                                    <td className="p-4 text-slate-400">{(sub.coreScore || 0).toFixed(1)}</td>
                                    <td className="p-4 font-bold text-blue-500">{sub.allocatedHours}h</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Allocation;
