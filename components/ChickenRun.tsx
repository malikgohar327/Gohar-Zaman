import React, { useState, useEffect, useRef } from 'react';

export const ChickenRun: React.FC = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isFalling, setIsFalling] = useState(false);
    const hasRunRef = useRef(false);
    const isFallingRef = useRef(false);

    useEffect(() => {
        const triggerRun = (event: MouseEvent) => {
            if (hasRunRef.current) return;

            const target = event.target as HTMLElement;
            // Don't trigger on interactive elements
            if (target.closest('button, a, input, textarea, label')) {
                return;
            }

            hasRunRef.current = true;
            setIsRunning(true);
        };

        // Add listener after a short delay to avoid triggering on initial render clicks
        const timeoutId = setTimeout(() => {
            window.addEventListener('click', triggerRun);
        }, 500);

        let runTimeoutId: number;
        if (isRunning) {
            runTimeoutId = window.setTimeout(() => {
                setIsRunning(false); // The component will unmount after the run
            }, 8000); // Animation duration
        }

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('click', triggerRun);
            if (runTimeoutId) {
                clearTimeout(runTimeoutId);
            }
        };
    }, [isRunning]);

    const handleChickenClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFallingRef.current) return;
        
        isFallingRef.current = true;
        setIsFalling(true);

        setTimeout(() => {
            setIsFalling(false);
            isFallingRef.current = false;
        }, 800); // duration of fall animation
    };

    if (!isRunning) {
        return null;
    }

    return (
        <div
            className={`chicken-runner ${isFalling ? 'falling' : ''}`}
            onClick={handleChickenClick}
            aria-hidden="true" // It's decorative
        >
            <svg viewBox="0 0 100 100" className="chicken-svg w-full h-full">
                {/* Body */}
                <path d="M 85,50 C 85,69.33 69.33,85 50,85 C 30.67,85 15,69.33 15,50 C 15,30.67 30.67,15 50,15 C 69.33,15 85,30.67 85,50 Z" fill="#fff" stroke="#4A3737" strokeWidth="3"/>
                {/* Wing */}
                <path d="M 60,50 C 60,58.28 53.28,65 45,65 C 40,65 35,60 35,50" fill="#f0f0f0" stroke="#4A3737" strokeWidth="2" />
                {/* Head */}
                <circle cx="80" cy="30" r="15" fill="#fff" stroke="#4A3737" strokeWidth="3"/>
                {/* Comb */}
                <path d="M 75,15 Q 80 10, 85 15 T 95 15" fill="#c026d3" stroke="#4A3737" strokeWidth="2"/>
                {/* Beak */}
                <polygon points="95,30 105,35 95,40" fill="#f59e0b" stroke="#4A3737" strokeWidth="2"/>
                {/* Eye */}
                <circle cx="83" cy="28" r="2.5" fill="#000" />
                {/* Legs */}
                <g transform="translate(40, 80)">
                    <line x1="0" y1="0" x2="10" y2="20" stroke="#f59e0b" strokeWidth="4" className="leg back" />
                </g>
                <g transform="translate(60, 80)">
                    <line x1="0" y1="0" x2="10" y2="20" stroke="#f59e0b" strokeWidth="4" className="leg" />
                </g>
            </svg>
        </div>
    );
};
