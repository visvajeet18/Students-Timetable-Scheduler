import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const StudyContext = createContext();

export const useStudy = () => useContext(StudyContext);

export const StudyProvider = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [preferences, setPreferences] = useState({ dailyHours: 4 });
    const [examDate, setExamDate] = useState('2026-06-15');
    const [studyHistory, setStudyHistory] = useState([]);

    // Hydrate from Disk on mount
    useEffect(() => {
        fetch('http://localhost:3001/api/sync')
            .then(res => res.json())
            .then(data => {
                setSubjects(data.subjects || []);
                setPreferences(data.prefs || { dailyHours: 4 });
                setExamDate(data.examDate || '2026-06-15');
                setStudyHistory(data.history || []);
                setIsLoaded(true);
            })
            .catch(err => {
                console.error("Neural Node Server OFF. Please verify 'npm run dev' includes backend.");
                setIsLoaded(true); // fall through so user isn't stuck
            });
    }, []);

    // Network Sync triggers (replacing localStorage)
    useEffect(() => {
        if (!isLoaded) return;
        fetch('http://localhost:3001/api/subjects', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subjects)
        }).catch(() => {});
    }, [subjects, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        fetch('http://localhost:3001/api/prefs', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(preferences)
        }).catch(() => {});
    }, [preferences, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        fetch('http://localhost:3001/api/exam', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ examDate })
        }).catch(() => {});
    }, [examDate, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        fetch('http://localhost:3001/api/history', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(studyHistory)
        }).catch(() => {});
    }, [studyHistory, isLoaded]);

    const addSubject = (name, difficulty = 3, targetGrade = 'A', methodology = 'Deep Work') => {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30); // 30 days default
        
        const newSub = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            difficulty: Number(difficulty),
            topics: [],
            examDate: defaultDate.toISOString().split('T')[0],
            targetGrade,
            methodology,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        };
        setSubjects([...subjects, newSub]);
    };

    const setSubjectExamDate = (subjectId, dateStr) => {
        setSubjects(prev => prev.map(s => s.id === subjectId ? { ...s, examDate: dateStr } : s));
    };

    const toggleTopicCompletion = (subjectId, topicId) => {
        setSubjects(prev => prev.map(s => 
            s.id === subjectId ? { ...s, topics: s.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t) } : s
        ));
    };

    const logStudySession = (subjectId, topicId, durationMinutes, type = 'Watch') => {
        const newEvent = {
            id: Date.now(),
            subjectId,
            topicId,
            duration: durationMinutes,
            type,
            timestamp: new Date().toISOString()
        };
        setStudyHistory([...studyHistory, newEvent]);

        // auto-save duration into subject.topics array for Progress.jsx tracking
        setSubjects(prev => prev.map(s => s.id === subjectId ? {
            ...s, topics: s.topics.map(t => t.id === topicId ? { ...t, watchTime: (t.watchTime || 0) + durationMinutes } : t)
        } : s));
    };

    const forceSetStudyHistory = (newHistoryData) => {
        setStudyHistory(newHistoryData);
    };

    const stats = useMemo(() => {
        const total = subjects.reduce((acc, s) => acc + s.topics.length, 0);
        const done = subjects.reduce((acc, s) => acc + s.topics.filter(t => t.completed).length, 0);
        const totalMinutes = Math.round(studyHistory.reduce((acc, ev) => acc + (ev.duration || 0), 0));
        
        // Calculate Rank Gamification
        let rankObj = { title: "Novice Observer", color: "text-slate-400 border-slate-500/30", iconColor: "text-slate-500", rawMins: totalMinutes };
        if (totalMinutes > 6000) rankObj = { title: "Neural Architect", color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10", iconColor: "text-emerald-400", rawMins: totalMinutes };
        else if (totalMinutes > 2000) rankObj = { title: "Deep Scholar", color: "text-purple-400 border-purple-500/40 bg-purple-500/10", iconColor: "text-purple-400", rawMins: totalMinutes };
        else if (totalMinutes > 600) rankObj = { title: "Cognitive Initiate", color: "text-blue-400 border-blue-500/40 bg-blue-500/10", iconColor: "text-blue-400", rawMins: totalMinutes };
        else if (totalMinutes > 120) rankObj = { title: "Active Synapse", color: "text-orange-400 border-orange-500/40 bg-orange-500/10", iconColor: "text-orange-400", rawMins: totalMinutes };

        return { total, done, progress: total > 0 ? Math.round((done / total) * 100) : 0, totalMinutes, rank: rankObj };
    }, [subjects, studyHistory]);

    return (
        <StudyContext.Provider value={{
            subjects, setSubjects, addSubject, toggleTopicCompletion, setSubjectExamDate,
            studyHistory, logStudySession, forceSetStudyHistory, stats, preferences,
            updatePrefs: (p) => setPreferences(prev => ({ ...prev, ...p }))
        }}>
            {isLoaded ? children : (
                <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-white fixed inset-0 z-[999]">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h2 className="text-xl font-bold tracking-widest text-slate-300">SYSTEM BOOT</h2>
                    <p className="text-slate-500 text-sm font-mono mt-2 animate-pulse">Mounting Local FileSystem API...</p>
                </div>
            )}
        </StudyContext.Provider>
    );
};
