import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Order, OrderStatus } from '../types';
import { CookingAnimation } from './CookingAnimation';
import { OrderCompleteIcon } from './OrderCompleteIcon';
import { ClockIcon } from './icons/ClockIcon';

interface OrderStatusTrackerProps {
    orderId: string;
    onClearOrder: () => void;
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ orderId, onClearOrder }) => {
    const [orders] = useLocalStorage<Order[]>('orders', []);
    const order = orders.find(o => o.id === orderId);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        if (!order?.assignedTime || order.status === OrderStatus.COMPLETED) {
            setTimeLeft(null);
            return;
        }

        const calculateTime = () => {
            const orderDate = new Date(order.createdAt);
            const [hours, minutes] = order.assignedTime!.split(':').map(Number);
            const targetTime = new Date(
                orderDate.getFullYear(),
                orderDate.getMonth(),
                orderDate.getDate(),
                hours,
                minutes
            );
            const now = new Date();
            const difference = targetTime.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft('Ready for pickup!');
                return true; // Indicates timer should stop
            } else {
                const totalSeconds = Math.floor(difference / 1000);
                const displayMinutes = Math.floor(totalSeconds / 60);
                const displaySeconds = totalSeconds % 60;
                setTimeLeft(
                    `${String(displayMinutes).padStart(2, '0')}:${String(
                        displaySeconds
                    ).padStart(2, '0')}`
                );
                return false; // Indicates timer should continue
            }
        };

        if (calculateTime()) {
            return; // Stop if time is already up on initial render
        }

        const intervalId = setInterval(() => {
            if (calculateTime()) {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [order?.id, order?.assignedTime, order?.createdAt, order?.status]);


    if (!order) {
        // Order might have been cleared or not found, go back to form
        onClearOrder();
        return null; 
    }

    const renderContent = () => {
        switch (order.status) {
            case OrderStatus.PENDING:
                return (
                    <>
                        <CookingAnimation />
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You! Your Sajji is Cooking!</h2>
                        <p className="text-lg text-gray-600">We've received your order and will start preparing it soon.</p>
                    </>
                );
            case OrderStatus.IN_PROGRESS:
                return (
                    <>
                        <CookingAnimation />
                        <h2 className="text-3xl font-bold text-blue-700 mb-4">Your Sajji is on the Grill!</h2>
                        <p className="text-lg text-gray-600">Our chefs are preparing your delicious meal. It'll be ready shortly!</p>
                    </>
                );
            case OrderStatus.COMPLETED:
                return (
                    <>
                        <OrderCompleteIcon />
                        <h2 className="text-3xl font-bold text-green-700 mb-4">Your Order is Ready!</h2>
                        <p className="text-lg text-gray-600 mb-8">Thank you for choosing us! Please visit again soon.</p>
                        <button
                            onClick={onClearOrder}
                            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-secondary transition-colors text-lg"
                        >
                            Place Another Order
                        </button>
                    </>
                );
            default:
                return <p>Loading order status...</p>;
        }
    };

    return (
        <div className="text-center p-8 bg-slate-50 rounded-lg shadow-md max-w-lg mx-auto">
            <div className="mb-6 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-base text-gray-600 mb-1">Your 5-Digit Order Code is:</p>
                <p className="text-5xl font-bold text-primary tracking-widest">{order.orderCode}</p>
                <p className="text-sm text-gray-500 mt-2">Status: <span className="font-semibold">{order.status}</span></p>
            </div>
            
            {timeLeft && (
                <div className="mb-6 p-4 bg-amber-50 rounded-lg border-2 border-dashed border-amber-300">
                    <div className="flex justify-center items-center space-x-3">
                        <ClockIcon className="w-8 h-8 text-amber-600 animate-pulse" />
                        <div>
                            <p className="text-base text-amber-800 mb-1">
                                {timeLeft.includes(':') ? 'Ready in approximately:' : 'Status:'}
                            </p>
                            <p className="text-4xl font-bold text-amber-700 tracking-wider font-mono">{timeLeft}</p>
                        </div>
                    </div>
                </div>
            )}

            {renderContent()}
        </div>
    );
};