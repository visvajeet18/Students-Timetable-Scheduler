import React, { useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import Card from '../components/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Analytics = () => {
    const { studyHistory } = useStudy();

    const graphData = useMemo(() => {
        if (!studyHistory || studyHistory.length === 0) {
            return [{ date: 'No Data', minutes: 0 }];
        }
        const grouping = {};
        studyHistory.forEach(event => {
            const evDate = new Date(event.timestamp);
            const dateStr = `${evDate.getFullYear()}-${String(evDate.getMonth() + 1).padStart(2, '0')}-${String(evDate.getDate()).padStart(2, '0')}`;
            const load = event.duration || 0;
            grouping[dateStr] = (grouping[dateStr] || 0) + load;
        });

        return Object.entries(grouping).map(([date, mins]) => ({
             date: date.split('-')[2], 
             minutes: mins
        })).sort((a,b) => a.date - b.date);

    }, [studyHistory]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <header className="mb-6">
                <h1 className="text-4xl font-black text-white">Analytics Dashboard</h1>
                <p className="text-slate-400 mt-2">Audit execution trails relative to static allocation models.</p>
            </header>

            <Card className="min-h-[450px]">
                <h3 className="text-xl font-bold text-white mb-8">Daily Watch History Execution Graph (Minutes)</h3>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={graphData}>
                              <defs>
                                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', color: '#fff' }} />
                              <Area type="monotone" dataKey="minutes" stroke="#10B981" fill="url(#colorMin)" strokeWidth={3} />
                         </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default Analytics;
