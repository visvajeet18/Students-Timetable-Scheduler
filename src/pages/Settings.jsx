import React from 'react';
import { useStudy } from '../context/StudyContext';
import Card from '../components/Card';
import { Trash2, AlertTriangle, Target, Clock, Calendar } from 'lucide-react';

const Settings = () => {
    const { subjects, setSubjectExamDate, preferences, updatePrefs, setSubjects } = useStudy();

    const handlePurge = () => {
        if (confirm('WARNING: This will permanently delete all Neural Memory, Subjects, and Tracking Data from your Hard Drive. Proceed?')) {
            fetch('http://localhost:3001/api/purge', { method: 'DELETE' })
                .then(() => {
                    localStorage.clear(); // clear any residual browser storage just in case
                    window.location.reload();
                })
                .catch(() => alert('Failed to contact Neural Node Server.'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <header className="mb-6">
                <h1 className="text-4xl font-black text-white">System Settings</h1>
                <p className="text-slate-400 mt-2">Adjust core engine parameters and data persistence layers.</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Calendar size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Target Node Milestones</h3>
                            <p className="text-sm text-slate-400">Set independent deadlines per subject for algorithm optimization.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {subjects.length === 0 ? (
                            <p className="text-slate-500 text-sm border border-white/5 p-4 rounded-xl bg-white/5">No tracking nodes found. Go to Strategy Engine to populate Neural Memory.</p>
                        ) : (
                            subjects.map(sub => (
                                <div key={sub.id} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${sub.difficulty >= 4 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                        <span className="font-bold text-slate-200">{sub.name}</span>
                                    </div>
                                    <input 
                                        type="date"
                                        className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
                                        value={sub.examDate || ''}
                                        onChange={(e) => setSubjectExamDate(sub.id, e.target.value)}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <Clock size={24} className="text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Capacity Boundaries</h3>
                            <p className="text-sm text-slate-400">Set absolute execution hours allowed per active day.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold tracking-widest text-slate-500">Max Daily Engine Load</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="range" 
                                min="1" max="14" 
                                value={preferences.dailyHours || 4} 
                                onChange={(e) => updatePrefs({ dailyHours: Number(e.target.value) })}
                                className="w-full accent-emerald-500"
                            />
                            <span className="font-black text-2xl text-white w-16">{preferences.dailyHours}h</span>
                        </div>
                    </div>
                </Card>

                <Card className="border-red-500/20 bg-red-950/20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                            <AlertTriangle size={24} className="text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-red-500">Evaluation Mode & Data Reset</h3>
                            <p className="text-sm text-red-400/70">Wipe all structural models, or inject fake data to simulate algorithm.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                            onClick={() => {
                                if(subjects.length === 0) { alert('You must define at least one Target Node to simulate activity on!'); return; }
                                const mockData = [];
                                const mockSubjects = [...subjects];
                                const today = new Date();
                                
                                for(let i=0; i<30; i++) {
                                    // Make 60% of the days active
                                    if(Math.random() > 0.4) {
                                        const dateOffset = new Date(today);
                                        dateOffset.setDate(today.getDate() - i);
                                        const s = mockSubjects[Math.floor(Math.random() * mockSubjects.length)];
                                        const baseTopId = s.topics.length > 0 ? s.topics[0].id : 'temp';
                                        
                                        // Massive random durations to hit heatmap limits
                                        const dur = Math.floor(Math.random() * 150) + 15; 
                                        
                                        mockData.push({
                                            id: Date.now() + i,
                                            subjectId: s.id,
                                            topicId: baseTopId,
                                            duration: dur,
                                            type: 'Simulation',
                                            timestamp: dateOffset.toISOString()
                                        });

                                        // Apply to mock subjects to fake Mastery progress too
                                        s.topics = s.topics.map(t => t.id === baseTopId ? { ...t, watchTime: (t.watchTime || 0) + dur } : t);
                                    }
                                }
                                forceSetStudyHistory(mockData);
                                setSubjects(mockSubjects);
                                alert('Successfully injected 30 days of randomized activity traces into the Heatmap & Dashboard!');
                            }}
                            className="w-full py-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            Simulate 30 Day Activity
                        </button>

                        <button 
                            onClick={handlePurge}
                            className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            <Trash2 size={20} /> Purge Neural Memory
                        </button>
                    </div>
                </Card>
                <Card className="border-indigo-500/20 bg-indigo-950/20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <Target size={24} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-indigo-400">Local Neural Backup (JSON)</h3>
                            <p className="text-sm text-indigo-200/70">Export your local database to your hardware or upload a previous backup.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                            onClick={() => {
                                const payload = {
                                    subjects: JSON.parse(localStorage.getItem('np_v5_subjects') || '[]'),
                                    history: JSON.parse(localStorage.getItem('np_v5_history') || '[]'),
                                    prefs: JSON.parse(localStorage.getItem('np_v5_prefs') || '{"dailyHours":4}')
                                };
                                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `neuroplan_backup_${new Date().toISOString().split('T')[0]}.json`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}
                            className="w-full py-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            Export Backup (.json)
                        </button>

                        <label className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer text-center">
                            Upload JSON Backup
                            <input 
                                type="file" 
                                accept=".json" 
                                className="hidden" 
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if(!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        try {
                                            const data = JSON.parse(event.target.result);
                                            if(!data.subjects || !data.history) throw new Error("Invalid structure.");
                                            
                                            localStorage.setItem('np_v5_subjects', JSON.stringify(data.subjects));
                                            localStorage.setItem('np_v5_history', JSON.stringify(data.history));
                                            if(data.prefs) localStorage.setItem('np_v5_prefs', JSON.stringify(data.prefs));
                                            
                                            alert("Neural Backup restored successfully! Rebooting systems...");
                                            window.location.reload();
                                        } catch (err) {
                                            alert("Error: Invalid NeuroPlan JSON file format.");
                                        }
                                    };
                                    reader.readAsText(file);
                                }}
                            />
                        </label>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
