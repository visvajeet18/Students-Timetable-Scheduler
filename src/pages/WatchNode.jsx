import React, { useState, useEffect, useRef } from 'react';
import { useStudy } from '../context/StudyContext';
import Card from '../components/Card';
import { Play, Pause, Square, Link2, Tv, Upload } from 'lucide-react';

const WatchNode = () => {
    const { subjects, logStudySession } = useStudy();
    const [selectedSubId, setSelectedSubId] = useState('');
    const [selectedTopId, setSelectedTopId] = useState('');
    
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null);

    // Video Source States
    const [sourceType, setSourceType] = useState('URL'); // 'URL' | 'LOCAL'
    const [videoUrl, setVideoUrl] = useState('');
    const [embeddedUrl, setEmbeddedUrl] = useState('');
    const [localFileUrl, setLocalFileUrl] = useState('');

    const iframeRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if(videoUrl.includes('youtube.com/watch?v=')) {
            const vidId = videoUrl.split('v=')[1]?.split('&')[0];
            setEmbeddedUrl(`https://www.youtube.com/embed/${vidId}?enablejsapi=1&autoplay=0`);
        } else if (videoUrl.includes('youtu.be/')) {
            const vidId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
            setEmbeddedUrl(`https://www.youtube.com/embed/${vidId}?enablejsapi=1&autoplay=0`);
        } else {
            setEmbeddedUrl(videoUrl);
        }
    }, [videoUrl]);

    const handleLocalUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLocalFileUrl(URL.createObjectURL(file));
        }
    };

    const handleToggleTracking = () => {
        const nextState = !isRunning;
        setIsRunning(nextState);

        // Auto-play / pause the linked media
        if (sourceType === 'URL' && iframeRef.current) {
            const command = nextState ? 'playVideo' : 'pauseVideo';
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command }), '*');
        } else if (sourceType === 'LOCAL' && videoRef.current) {
            if (nextState) videoRef.current.play();
            else videoRef.current.pause();
        }
    };

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else if (!isRunning && timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const formatTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStopAndSave = () => {
        setIsRunning(false);
        const minutes = (seconds / 60);
        if (minutes > 0 && selectedSubId && selectedTopId) {
            logStudySession(selectedSubId, selectedTopId, minutes, 'Watch');
            alert(`Saved ${minutes.toFixed(1)} minutes to Neural Memory.`);
            setSeconds(0);
        } else {
            alert('Please select a Node and Topic first, or watch for at least some time before saving.');
        }
    };

    const selectedSubject = subjects.find(s => s.id === selectedSubId);
    const hasActiveMedia = (sourceType === 'URL' && embeddedUrl) || (sourceType === 'LOCAL' && localFileUrl);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <h1 className="text-4xl font-black text-white">Video Hub</h1>
            
            {/* Video Input Controls */}
            <Card className="flex flex-wrap md:flex-nowrap gap-4 items-center !p-4 bg-slate-900/50">
                <div className="flex gap-2">
                    <button onClick={() => setSourceType('URL')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap uppercase tracking-widest ${sourceType === 'URL' ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        <Link2 size={16} className="inline mr-2" /> Web Link
                    </button>
                    <button onClick={() => setSourceType('LOCAL')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap uppercase tracking-widest ${sourceType === 'LOCAL' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        <Upload size={16} className="inline mr-2" /> Local File
                    </button>
                </div>

                <div className="flex-1 w-full relative">
                    {sourceType === 'URL' ? (
                        <input 
                            type="text" 
                            placeholder="Paste YouTube or Web Video URL..." 
                            className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                    ) : (
                        <input 
                            type="file" 
                            accept="video/*"
                            onChange={handleLocalUpload}
                            className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-400 file:bg-emerald-500 file:border-0 file:rounded-lg file:px-4 file:py-1 file:mr-4 file:text-white file:font-bold file:cursor-pointer hover:file:opacity-90"
                        />
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <Card className="xl:col-span-2 flex flex-col p-0 overflow-hidden relative shadow-2xl shadow-blue-500/5">
                    <div className="w-full bg-black aspect-video flex-shrink-0 flex items-center justify-center relative border-b border-white/5 group">
                        
                        {/* Native Rendering Fallback */}
                        {sourceType === 'URL' && embeddedUrl ? (
                            <iframe 
                                ref={iframeRef}
                                className="absolute inset-0 w-full h-full"
                                src={embeddedUrl} 
                                title="Video Player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            />
                        ) : sourceType === 'LOCAL' && localFileUrl ? (
                            <video 
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full outline-none"
                                src={localFileUrl} 
                                controls 
                                onPlay={() => setIsRunning(true)}
                                onPause={() => setIsRunning(false)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-500 opacity-30 select-none">
                                <Tv size={96} className="mb-6" />
                                <span className="text-xl font-black tracking-widest uppercase">No Source Active</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Control Panel */}
                <div className="space-y-6">
                    <Card className="flex flex-col items-center justify-center border-emerald-500/20 bg-emerald-950/10 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-2 mt-4">
                           {isRunning ? "🔴 TRACKING WORK" : "TIMER SESSION"}
                        </div>
                        <h2 className={`text-7xl font-black tabular-nums tracking-tighter mb-8 transition-colors ${isRunning ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-slate-400'}`}>
                            {formatTime(seconds)}
                        </h2>
                        
                        {hasActiveMedia && (
                            <>
                                <div className="flex gap-4 w-full px-8 mb-4">
                                    <button 
                                        onClick={handleToggleTracking} 
                                        className={`flex-1 py-3 justify-center rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer border ${isRunning ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'}`}
                                    >
                                        {isRunning ? <><Pause size={18} /> PAUSE TIMER & VIDEO</> : <><Play size={18} /> START TRACKING & PLAY</>}
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={handleStopAndSave}
                                    disabled={!isRunning && seconds === 0}
                                    className="w-full py-4 justify-center bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 rounded-xl font-bold flex items-center gap-3 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Square size={20} /> SAVE FOCUS TRACE
                                </button>
                            </>
                        )}
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-white mb-6">Target Node Binding</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Subject</label>
                                <select 
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 cursor-pointer"
                                    value={selectedSubId}
                                    onChange={(e) => { setSelectedSubId(e.target.value); setSelectedTopId(''); }}
                                >
                                    <option value="">-- No Assignment --</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {selectedSubject && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block mt-6">Topic</label>
                                    <select 
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 cursor-pointer"
                                        value={selectedTopId}
                                        onChange={(e) => setSelectedTopId(e.target.value)}
                                    >
                                        <option value="">-- No Topic --</option>
                                        {selectedSubject.topics.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default WatchNode;
