import React, { useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { motion } from 'framer-motion';

const KnowledgeTree = () => {
    const { subjects } = useStudy();

    // Map the subjects and topics into a radial DAG coordinates
    const nodesAndLinks = useMemo(() => {
        const nodes = [];
        const links = [];
        const centerX = 500;
        const centerY = 500;
        const radiusStep = 180;

        // Core Node
        nodes.push({ id: 'core', x: centerX, y: centerY, label: 'Neural Core', type: 'core', color: '#3B82F6' });

        if (!subjects || subjects.length === 0) return { nodes, links };

        const angleStep = (2 * Math.PI) / subjects.length;
        
        subjects.forEach((sub, i) => {
            const angle = i * angleStep;
            const sx = centerX + Math.cos(angle) * radiusStep;
            const sy = centerY + Math.sin(angle) * radiusStep;
            
            // Sub Node
            nodes.push({ id: sub.id, x: sx, y: sy, label: sub.name, type: 'subject', color: sub.color || '#A855F7' });
            links.push({ id: `link-core-${sub.id}`, x1: centerX, y1: centerY, x2: sx, y2: sy, stroke: sub.color || '#A855F7' });

            if (sub.topics && sub.topics.length > 0) {
                const topAngleStep = (Math.PI * 0.8) / sub.topics.length;
                let startAngle = angle - (Math.PI * 0.4);

                sub.topics.forEach((top, j) => {
                    const tx = sx + Math.cos(startAngle) * (radiusStep * 0.8);
                    const ty = sy + Math.sin(startAngle) * (radiusStep * 0.8);
                    
                    const isLit = top.watchTime > 60 || top.completed;
                    const nodeColor = isLit ? '#10B981' : '#475569';
                    
                    nodes.push({ id: top.id, x: tx, y: ty, label: top.name, type: 'topic', color: nodeColor, isLit });
                    links.push({ id: `link-${sub.id}-${top.id}`, x1: sx, y1: sy, x2: tx, y2: ty, stroke: nodeColor });

                    startAngle += topAngleStep;
                });
            }
        });

        return { nodes, links };
    }, [subjects]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 h-[calc(100vh-100px)] flex flex-col">
            <header className="mb-2 shrink-0">
                <h1 className="text-4xl font-black text-white">Neural Knowledge Graph</h1>
                <p className="text-slate-400 mt-2">Topological mapping of your absolute cognitive expansion framework.</p>
            </header>

            <div className="flex-1 w-full bg-[#020617] rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617] opacity-50" />
                
                <svg viewBox="0 0 1000 1000" className="w-full h-full object-contain drop-shadow-2xl">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Render Links Contextually */}
                    {nodesAndLinks.links.map(link => (
                        <motion.line
                            key={link.id}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            x1={link.x1} y1={link.y1}
                            x2={link.x2} y2={link.y2}
                            stroke={link.stroke}
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    ))}

                    {/* Render Nodes Topologically */}
                    {nodesAndLinks.nodes.map(node => (
                        <motion.g 
                            key={node.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 50, delay: node.type === 'core' ? 0 : node.type === 'subject' ? 0.5 : 1 }}
                        >
                            <circle 
                                cx={node.x} cy={node.y} 
                                r={node.type === 'core' ? 30 : node.type === 'subject' ? 20 : 12}
                                fill={node.type === 'topic' && !node.isLit ? '#1e293b' : node.color}
                                stroke={node.color}
                                strokeWidth={node.type === 'topic' ? 3 : 0}
                                filter={node.type !== 'topic' || node.isLit ? "url(#glow)" : ""}
                                className={`transition-all duration-1000 cursor-pointer ${node.isLit && 'animate-[pulse_3s_ease-in-out_infinite]'}`}
                            />
                            
                            <text
                                x={node.x} 
                                y={node.y + (node.type === 'core' ? 45 : node.type === 'subject' ? 35 : 25)}
                                textAnchor="middle"
                                fill="white"
                                className={`font-bold ${node.type === 'topic' ? 'text-[10px] opacity-70' : 'text-sm'}`}
                            >
                                {node.label}
                            </text>
                        </motion.g>
                    ))}
                </svg>

                {/* Radar Sweep Animation overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0)_0deg,rgba(59,130,246,0.3)_100deg,rgba(16,185,129,0)_110deg)] animate-[spin_4s_linear_infinite]" />
            </div>
        </div>
    );
};

export default KnowledgeTree;
