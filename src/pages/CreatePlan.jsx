import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Target, PlusCircle, LayoutList, ChevronRight, Settings2 } from 'lucide-react';
import Card from '../components/Card';

const CreatePlan = () => {
    const { subjects, addSubject, setSubjects } = useStudy();
    const [subName, setSubName] = useState('');
    const [difficulty, setDifficulty] = useState(3);
    const [targetGrade, setTargetGrade] = useState('A');
    const [methodology, setMethodology] = useState('Deep Work');
    
    const [bulkTopics, setBulkTopics] = useState('');
    const [activeId, setActiveId] = useState(null);

    const handleAdd = () => {
        if (!subName.trim()) return;
        addSubject(subName, difficulty, targetGrade, methodology);
        setSubName('');
        setDifficulty(3);
        setTargetGrade('A');
        setMethodology('Deep Work');
    };

    const handleBulkAdd = () => {
        if (!bulkTopics.trim() || !activeId) return;
        const newTopics = bulkTopics.split('\n').filter(t => t.trim()).map(t => ({
            id: Math.random().toString(36).substr(2, 9),
            name: t.trim(),
            completed: false,
            watchTime: 0
        }));
        setSubjects(subjects.map(s => s.id === activeId ? { ...s, topics: [...s.topics, ...newTopics] } : s));
        setBulkTopics('');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <header className="mb-6">
                <h1 className="text-4xl font-black text-white">Strategy Engine</h1>
                <p className="text-slate-400 mt-2">Initialize semantic nodes and configure neural progression parameters.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Node Creation UI */}
                <Card>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Target size={24} className="text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Define Target Node</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Node Identifier (Subject)</label>
                            <input 
                                type="text"
                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g., Quantum Physics"
                                value={subName}
                                onChange={e => setSubName(e.target.value)}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Target Goal</label>
                                <select 
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                    value={targetGrade}
                                    onChange={e => setTargetGrade(e.target.value)}
                                >
                                    <option value="A+">A+ (Perfect Mastery)</option>
                                    <option value="A">A (Excellence)</option>
                                    <option value="B">B (Moderate Competence)</option>
                                    <option value="Pass">Pass (Minimum Viable)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Methodology</label>
                                <select 
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                                    value={methodology}
                                    onChange={e => setMethodology(e.target.value)}
                                >
                                    <option value="Deep Work">Deep Work (Theory)</option>
                                    <option value="Pomodoro">Pomodoro (Spaced)</option>
                                    <option value="Active Recall">Active Recall</option>
                                    <option value="Practical">Practical / Coding</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                                Cognitive Load Weight 
                                <span className={`font-bold ${difficulty >= 4 ? 'text-red-500' : 'text-emerald-500'}`}>Level {difficulty}</span>
                            </label>
                            <input 
                                type="range" 
                                min="1" max="5" 
                                className="w-full accent-blue-500"
                                value={difficulty}
                                onChange={e => setDifficulty(Number(e.target.value))}
                            />
                            <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-bold uppercase tracking-widest">
                                <span>Trivial</span>
                                <span>Critical</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleAdd}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                            disabled={!subName.trim()}
                        >
                            <PlusCircle size={20} /> Deploy Node
                        </button>
                    </div>
                </Card>

                {/* Sub-node Addition UI */}
                <Card delay={0.1}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <LayoutList size={24} className="text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Neural Parser</h3>
                    </div>

                    <div className="space-y-6 flex flex-col h-[calc(100%-80px)]">
                        <div className="flex-1">
                            {subjects.length === 0 ? (
                                <div className="h-full border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-slate-500 text-sm p-8 text-center bg-white/5">
                                    Deploy a Target Node first to unlock the sub-topic array parser.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        {subjects.map(s => (
                                            <div 
                                                key={s.id}
                                                onClick={() => setActiveId(s.id)}
                                                className={`p-4 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${activeId === s.id ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/5 bg-slate-900/40 hover:bg-white/5'}`}
                                            >
                                                <span className="font-bold text-slate-200 truncate">{s.name}</span>
                                                <span className="text-[10px] text-slate-500 font-mono">{s.topics.length} topics • {s.methodology || 'Deep Work'}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {activeId && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Paste Syllabus (New line delineated)</label>
                                            <textarea 
                                                className="w-full h-32 bg-slate-900 border border-white/10 rounded-xl p-4 text-sm text-slate-300 outline-none focus:border-purple-500"
                                                placeholder="1. Introduction to Syntax&#10;2. Advanced Routines&#10;3. API Interfaces"
                                                value={bulkTopics}
                                                onChange={e => setBulkTopics(e.target.value)}
                                            />
                                            <button 
                                                onClick={handleBulkAdd}
                                                className="w-full py-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                                                disabled={!bulkTopics.trim()}
                                            >
                                                Parse & Inject Topics
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CreatePlan;
