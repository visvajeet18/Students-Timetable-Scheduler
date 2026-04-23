/**
 * AI Academic Planner - Multi-Milestone & Fair-Share Scheduling Algorithm
 */

export const generateSchedule = (subjects, dummyGlobalExamUnused, preferences) => {
    if (!subjects || subjects.length === 0) return null;

    const today = new Date();
    today.setHours(0,0,0,0);

    let maxDaysOverall = 1;

    // 1. Calculate Core Urgency Parameters per subject
    let totalScore = 0;
    const prioritizedSubjects = subjects.map(sub => {
        const diffWeight = sub.difficulty; 
        const topicCount = sub.topics.length || 1; 
        const completionRate = sub.topics.filter(t => t.completed).length / topicCount;

        const selfTarget = sub.examDate ? new Date(sub.examDate) : new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        selfTarget.setHours(0,0,0,0);
        let msDiff = selfTarget - today;
        let daysRem = Math.max(1, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));

        if (daysRem > maxDaysOverall) maxDaysOverall = daysRem;

        const baseScore = (diffWeight * 3) + (topicCount * 2);
        
        // Critical urgencies multipliers
        let urgencyMultiplier = 1;
        if (daysRem <= 7) urgencyMultiplier = 3.0;
        else if (daysRem <= 14) urgencyMultiplier = 1.8;
        else if (daysRem <= 30) urgencyMultiplier = 1.2;

        const adjustedScore = (baseScore * urgencyMultiplier) * (1 - (completionRate * 0.8)); 

        return { ...sub, coreScore: adjustedScore, topicsCount: topicCount, daysRemaining: daysRem };
    });

    prioritizedSubjects.forEach(s => totalScore += s.coreScore);

    // 2. Compute Allocation pools
    const dailyHours = preferences.dailyHours || 4;
    const totalSystemHours = maxDaysOverall * dailyHours;

    const allocation = prioritizedSubjects.map(sub => {
        const percentage = totalScore > 0 ? sub.coreScore / totalScore : 0;
        let tentativeHours = Math.round(totalSystemHours * percentage);
        const maxLimit = sub.daysRemaining * dailyHours; 
        const allocatedHours = Math.min(tentativeHours, maxLimit);
        
        return {
            ...sub,
            allocatedHours: Math.max(1, allocatedHours), 
            percentage: (percentage * 100).toFixed(1)
        };
    });

    // 3. Round-Robin / Interleaving Calendar Loop
    const calendar = [];
    
    let trackingPool = allocation.map(s => ({ ...s, poolHours: s.allocatedHours, daysSinceLastStudied: 100 }));

    for (let i = 0; i < maxDaysOverall; i++) {
        const currentDate = new Date();
        currentDate.setDate(today.getDate() + i);
        
        let validSubjects = trackingPool.filter(s => i < s.daysRemaining && s.poolHours > 0);
        
        if (validSubjects.length === 0) {
            // Loop ran dry, loop back for pure interleaving
            validSubjects = trackingPool.filter(s => i < s.daysRemaining);
            if(validSubjects.length === 0) break; 
        }

        // Apply interleaving booster to dynamic score.
        // A high coreScore makes you naturally heavy, BUT not having been studied 
        // recently massively inflates your dynamic weight, forcing you to the top!
        // Fresh subjects sink to the bottom.
        validSubjects.forEach(s => {
             s.dynamicScore = s.coreScore + (s.daysSinceLastStudied * 5); 
        });

        // 1. Sort by dynamic interleaved score instead of coreScore
        validSubjects.sort((a,b) => b.dynamicScore - a.dynamicScore);
        const currentSubject = validSubjects[0];

        // 2. Adjust Pool and Interleave Trackers
        const matchIdx = trackingPool.findIndex(s => s.id === currentSubject.id);
        
        if (matchIdx !== -1) {
             trackingPool[matchIdx].poolHours -= dailyHours;
             trackingPool[matchIdx].daysSinceLastStudied = 0; // Boom! Just assigned. Counter resets.
        }

        // Increment neglect-counter for ALL other subjects
        trackingPool.forEach((s, idx) => {
             if(idx !== matchIdx) s.daysSinceLastStudied += 1;
        });

        calendar.push({
            date: currentDate.toISOString().split('T')[0],
            dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
            subject: currentSubject.name,
            difficulty: currentSubject.difficulty || 1,
            task: currentSubject.topics[i % (currentSubject.topicsCount || 1)]?.name || 'Review core concepts',
            hours: dailyHours
        });
    }

    return { allocation, calendar, daysRemaining: maxDaysOverall };
};
