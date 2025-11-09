import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useProducts } from '../hooks/useProducts';
import { Order, OrderStatus, OrderType, OrderItem } from '../types';
import { PhoneIcon } from './icons/PhoneIcon';
import { LocationIcon } from './icons/LocationIcon';
import { OrderStatusTracker } from './OrderStatusTracker';
import { ChickenIcon } from './icons/ChickenIcon';
import { FishIcon } from './icons/FishIcon';
import { BottleIcon } from './icons/BottleIcon';
import { RaitaIcon } from './icons/RaitaIcon';
import { RotiIcon } from './icons/RotiIcon';

export const CustomerForm: React.FC = () => {
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [activeOrderId, setActiveOrderId] = useLocalStorage<string | null>('activeOrderId', null);
  const { products } = useProducts();
  
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [orderType, setOrderType] = useState<OrderType>(OrderType.PICKUP);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialQuantities = useMemo(() => {
    const quantities: Record<string, number> = {};
    products.forEach(p => {
        quantities[p.name] = p.name.includes('Sajji') ? 1 : 0;
    });
    return quantities;
  }, [products]);

  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities);
  
  useEffect(() => {
    setQuantities(initialQuantities);
  }, [initialQuantities]);


  const handleQuantityChange = (productName: string, change: number) => {
    setQuantities(prev => {
      const newQuantity = (prev[productName] || 0) + change;
      return {
        ...prev,
        [productName]: Math.max(0, newQuantity),
      };
    });
    if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
  };

  const orderedItems: OrderItem[] = useMemo(() => {
    return products
      .map(p => ({ ...p, quantity: quantities[p.name] || 0 }))
      .filter(item => item.quantity > 0);
  }, [products, quantities]);

  const totalPrice = useMemo(() => {
    return orderedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [orderedItems]);

  const resetForm = () => {
    setName('');
    setContact('');
    setAddress('');
    setQuantities(initialQuantities);
    setOrderType(OrderType.PICKUP);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (orderedItems.length === 0) {
      newErrors.general = 'Please add at least one item to your order.';
    }
    if (!name.trim()) {
      newErrors.name = 'Full Name is required.';
    }
    if (!contact.trim()) {
      newErrors.contact = 'Contact Number is required.';
    }
    if (orderType === OrderType.DELIVERY && !address.trim()) {
      newErrors.address = 'Delivery Address is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: new Date().getTime().toString(),
      orderCode: Math.floor(10000 + Math.random() * 90000).toString(),
      customerName: name,
      contactNumber: contact,
      orderType,
      items: orderedItems,
      totalPrice,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      ...(orderType === OrderType.DELIVERY && { address }),
    };

    setTimeout(() => {
      setOrders(prevOrders => [...prevOrders, newOrder]);
      setActiveOrderId(newOrder.id);
      setIsSubmitting(false);
      resetForm();
    }, 1000);
  };
  
  const handleClearOrder = () => {
    setActiveOrderId(null);
  };
  
  const quantityButtonClasses = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors";
  const plusButtonClasses = "bg-primary text-white hover:bg-secondary";
  const minusButtonClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";
  const inputClasses = "w-full px-4 py-2 border border-gray-300 bg-white text-text rounded-md shadow-sm focus:ring-primary focus:border-primary";
  const errorTextClasses = "text-sm text-red-600 mt-1";

  const productIcons: Record<string, React.ReactNode> = {
    'Full Chicken Sajji': <ChickenIcon />,
    'Fish per KG': <FishIcon />,
    '1.5L Cold Drink': <BottleIcon />,
    'Raita': <RaitaIcon />,
    'Roti': <RotiIcon />,
    'Regular Bottle': <BottleIcon />,
  };


  if (activeOrderId) {
    return <OrderStatusTracker orderId={activeOrderId} onClearOrder={handleClearOrder} />;
  }

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-primary">Order Your Delicious Sajji</h2>
            <p className="text-gray-500 mt-2">Freshly prepared for you in Kashmir Chakswari.</p>
            <div className="mt-4 text-gray-800 flex justify-center items-center space-x-4 text-base sm:text-lg">
                <span className="font-semibold">Pickup</span>
                <span className="text-secondary">&bull;</span>
                <span className="font-semibold">Dine-In</span>
                <span className="text-secondary">&bull;</span>
                <span className="font-semibold">Home Delivery</span>
            </div>
        </div>
        
        <div className="text-center mb-8 p-4 bg-slate-100 rounded-lg space-y-4">
            <div className="flex items-center justify-center space-x-3">
                <PhoneIcon className="w-6 h-6 text-primary" />
                <div>
                    <span className="text-sm text-gray-600">For Questions Call Afzal:</span>
                    <a href="tel:03016615845" className="block font-bold text-lg text-primary hover:underline">03016615845</a>
                </div>
            </div>
             <div className="flex items-center justify-center space-x-3">
                <LocationIcon className="w-6 h-6 text-primary" />
                <div>
                    <span className="text-sm text-gray-600">Our Location:</span>
                    <p className="block font-bold text-lg text-primary">Kashmir Chakswari, opposite Ismail Hospital</p>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Items Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Choose Your Items</h3>
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 text-primary flex-shrink-0 flex items-center justify-center">
                        {productIcons[product.name] || <div className="w-8 h-8 bg-gray-200 rounded-full" />}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">Rs. {product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <button type="button" onClick={() => handleQuantityChange(product.name, -1)} disabled={(quantities[product.name] || 0) === 0} className={`${quantityButtonClasses} ${minusButtonClasses}`}>-</button>
                    <span className="text-lg font-bold w-8 text-center tabular-nums">{quantities[product.name] || 0}</span>
                    <button type="button" onClick={() => handleQuantityChange(product.name, 1)} className={`${quantityButtonClasses} ${plusButtonClasses}`}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Order</h3>
            {orderedItems.length > 0 ? (
              orderedItems.map(item => (
                <div key={item.name} className="flex justify-between items-center text-gray-700 mb-1">
                    <span><span className="font-semibold">{item.quantity}x</span> {item.name}</span>
                    <span className="font-medium">Rs. {item.price * item.quantity}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-2">Your cart is empty.</p>
            )}
            {errors.general && <p className={`${errorTextClasses} text-center font-semibold`}>{errors.general}</p>}
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-primary">Rs. {totalPrice}</span>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Order Type</span>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-200 p-1">
              {Object.values(OrderType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    orderType === type
                      ? 'bg-primary text-white shadow'
                      : 'text-gray-600 hover:bg-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({...prev, name: ''}));
                }}
                className={inputClasses}
                required
              />
              {errors.name && <p className={errorTextClasses}>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                id="contact"
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                  if (errors.contact) setErrors(prev => ({...prev, contact: ''}));
                }}
                className={inputClasses}
                required
              />
              {errors.contact && <p className={errorTextClasses}>{errors.contact}</p>}
            </div>
            {orderType === OrderType.DELIVERY && (
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors(prev => ({...prev, address: ''}));
                  }}
                  rows={3}
                  className={inputClasses}
                  required
                />
                {errors.address && <p className={errorTextClasses}>{errors.address}</p>}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || orderedItems.length === 0}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-lg"
            >
              {isSubmitting ? 'Placing Order...' : 'Place My Order'}
            </button>
          </div>
        </form>
    </div>
  );
};