import React, { useState } from 'react';
import { Order, OrderStatus, OrderType } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { LocationIcon } from './icons/LocationIcon';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onUpdateTime: (id: string, time: string) => void;
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-amber-100 text-amber-800',
  [OrderStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
};

const typeColors: Record<OrderType, string> = {
    [OrderType.PICKUP]: 'border-blue-500',
    [OrderType.DINE_IN]: 'border-purple-500',
    [OrderType.DELIVERY]: 'border-green-500',
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, onUpdateTime }) => {
  const [time, setTime] = useState(order.assignedTime || '');

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleTimeBlur = () => {
    onUpdateTime(order.id, time);
  };

  return (
    <div className={`bg-surface rounded-lg shadow-md p-4 border-l-4 ${typeColors[order.orderType]} flex flex-col space-y-4`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="font-bold text-lg">{order.customerName}</h3>
            {order.orderCode && (
                <p className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                    #{order.orderCode}
                </p>
            )}
          </div>
          <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${statusColors[order.status]} mt-2`}>
            {order.status}
          </span>
        </div>
        <div className="text-right">
            <p className="font-semibold text-primary text-lg">Rs. {order.totalPrice}</p>
            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
        <div className="flex items-center space-x-2 text-gray-700">
          <PhoneIcon className="w-4 h-4 text-gray-500" />
          <span>{order.contactNumber}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
            <span className={`font-bold text-sm`}>{order.orderType}</span>
        </div>
        {order.orderType === OrderType.DELIVERY && (
          <div className="flex items-start space-x-2 text-gray-700">
            <LocationIcon className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>{order.address}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="font-semibold mb-1">Items:</p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {order.items.map((item, index) => (
            <li key={index}>
              <span className="font-semibold">{item.quantity}x</span> {item.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <ClockIcon className="w-5 h-5 text-gray-500" />
          <input
            type="time"
            value={time}
            onChange={handleTimeChange}
            onBlur={handleTimeBlur}
            className="border border-primary bg-primary text-white rounded-md px-2 py-1 text-sm focus:ring-secondary focus:border-secondary placeholder-white"
            aria-label="Assigned time"
          />
        </div>

        <div className="flex items-center space-x-2">
          {order.status === OrderStatus.PENDING && (
            <button
              onClick={() => onUpdateStatus(order.id, OrderStatus.IN_PROGRESS)}
              className="w-full sm:w-auto bg-blue-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600 transition-colors"
            >
              Start Cooking
            </button>
          )}
          {order.status === OrderStatus.IN_PROGRESS && (
            <button
              onClick={() => onUpdateStatus(order.id, OrderStatus.COMPLETED)}
              className="w-full sm:w-auto bg-green-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-green-600 transition-colors"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};