import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', delay = 0, onClick }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, type: 'spring', stiffness: 50 }}
            whileHover={onClick ? { scale: 1.02 } : { scale: 1.005 }}
            onClick={onClick}
            className={`bg-slate-900/30 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default Card;
