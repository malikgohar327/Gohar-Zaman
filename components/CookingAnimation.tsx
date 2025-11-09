import React from 'react';

export const CookingAnimation: React.FC = () => {
    return (
        <div className="cooking-animation-container" aria-hidden="true">
            <svg viewBox="0 0 200 150" className="w-56 h-auto">
                {/* Spit and stands */}
                <path d="M 20 110 L 20 80 L 30 80 C 30 75 25 75 20 80" fill="#4A3737" />
                <path d="M 180 110 L 180 80 L 170 80 C 170 75 175 75 180 80" fill="#4A3737" />
                <line x1="10" y1="85" x2="190" y2="85" stroke="#a1a1aa" strokeWidth="5" strokeLinecap="round" />

                {/* Chicken group, for rotation */}
                <g className="sajji-chicken">
                    {/* Body */}
                    <ellipse cx="100" cy="85" rx="45" ry="30" stroke="#4A3737" strokeWidth="3" />
                    {/* Legs */}
                    <path d="M 70 105 C 60 125, 80 125, 75 110" stroke="#4A3737" strokeWidth="3" fill="transparent" />
                    <path d="M 130 105 C 140 125, 120 125, 125 110" stroke="#4A3737" strokeWidth="3" fill="transparent" />
                </g>

                {/* Heat Waves */}
                <g transform="translate(0, 120)">
                    <path d="M 70 0 Q 80 -10 90 0 T 110 0 T 130 0" strokeWidth="2.5" fill="none" className="heat-wave"/>
                    <path d="M 60 5 Q 70 -5 80 5 T 100 5 T 120 5 T 140 5" strokeWidth="2.5" fill="none" className="heat-wave delay-1"/>
                    <path d="M 75 10 Q 85 0 95 10 T 115 10" strokeWidth="2.5" fill="none" className="heat-wave delay-2"/>
                </g>
            </svg>
        </div>
    );
};