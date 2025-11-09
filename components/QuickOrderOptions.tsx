import React from 'react';
import { ChickenIcon } from './icons/ChickenIcon';
import { BottleIcon } from './icons/BottleIcon';
import { RaitaIcon } from './icons/RaitaIcon';

interface QuickOrderOptionsProps {
    onQuickAdd: (itemName: string) => void;
}

const OptionBox: React.FC<{ icon: React.ReactNode; label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button 
        type="button" 
        onClick={onClick} 
        className="flex flex-col items-center justify-center w-32 h-32 bg-white rounded-lg shadow-md border border-gray-200 text-center hover:shadow-lg hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
        aria-label={`Add ${label} to order`}
    >
        <div className="w-12 h-12 text-primary">
            {icon}
        </div>
        <span className="mt-2 font-semibold text-gray-700">{label}</span>
    </button>
);

export const QuickOrderOptions: React.FC<QuickOrderOptionsProps> = ({ onQuickAdd }) => {
    return (
        <div className="my-6">
            <div className="flex justify-center items-center flex-wrap gap-4 sm:gap-8">
                <OptionBox icon={<ChickenIcon />} label="Chicken Sajji" onClick={() => onQuickAdd('Full Chicken Sajji')} />
                <OptionBox icon={<BottleIcon />} label="1.5L Drink" onClick={() => onQuickAdd('1.5L Cold Drink')} />
                <OptionBox icon={<RaitaIcon />} label="Raita" onClick={() => onQuickAdd('Raita')} />
            </div>
        </div>
    );
};