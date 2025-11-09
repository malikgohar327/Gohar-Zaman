import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useProducts } from '../hooks/useProducts';
import { Order, OrderStatus, Product } from '../types';
import { OrderCard } from './OrderCard';

interface AdminPanelProps {
    onLogout: () => void;
}

const NOTIFICATION_SOUND = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAASAAADbWFweG1wYwAAAAAB/+Fw2XVGYW5nIGZyb20gWW91VHViZSBBdWRpbyBMaWJyYXJ5AP/7AAAAAAAADkF1ZGlvIElEAAAAAAAASW5mbwAAAA8AAAAAAAABA2NzY2NzY2NzY2NzY2NzY2NzY2NzY2NzY25jb2RlciBvZmZzZXQAAAAC/AABVVVXVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVaxgADANIAAAAAAAAAD/8vAZASQAAAAAAAAAADSAAAAAAAAAAAAAAAP/y8BkCKQAAAAAAAAAAANLAAAAAAAAAAAAAAAAD/+XgMgZIAAAAAAAAAAA0gAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZIAAAAAAAAAAA0gAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZA2SAAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSwAAAAAAAAAAAAAAB/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/8vAZBmkAAAAAAAAAAAANIAAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAAP/y8BkGaQAAAAAAAAAAANIAAAAAAAAAAAAAA//LwGQZpAAAAAAAAAAADSAAAAAAAAAAAAAD/+XgMgZpAAAAAAAAAAADSAAAAAAAAAAAAAAD/';

type ActiveTab = OrderStatus | 'PRODUCTS' | 'SALES';

const ProductSettings: React.FC = () => {
    const { products, updateProductPrice } = useProducts();
    const [editedPrices, setEditedPrices] = useState<Record<string, string>>({});
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const initialPrices: Record<string, string> = {};
        products.forEach(p => {
            initialPrices[p.name] = p.price.toString();
        });
        setEditedPrices(initialPrices);
    }, [products]);

    const handlePriceChange = (name: string, value: string) => {
        setEditedPrices(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        Object.entries(editedPrices).forEach(([name, priceStr]) => {
            const price = parseFloat(priceStr);
            if (!isNaN(price)) {
                updateProductPrice(name, price);
            }
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="bg-surface rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Manage Product Prices</h3>
            <div className="space-y-4">
                {products.map(product => (
                    <div key={product.name} className="flex items-center justify-between">
                        <label htmlFor={product.name} className="font-medium text-gray-700">{product.name}</label>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Rs.</span>
                            <input
                                type="number"
                                id={product.name}
                                value={editedPrices[product.name] || ''}
                                onChange={(e) => handlePriceChange(product.name, e.target.value)}
                                className="w-32 px-3 py-1 border border-gray-300 bg-white text-text rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-right">
                <button
                    onClick={handleSave}
                    className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400"
                >
                    Save Prices
                </button>
                {isSaved && <span className="ml-4 text-green-600 font-semibold">Saved!</span>}
            </div>
        </div>
    );
}

const SalesAnalytics: React.FC<{ orders: Order[] }> = ({ orders }) => {
    const salesData = useMemo(() => {
        const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED);
        
        const dataByDay = completedOrders.reduce((acc, order) => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (!acc[date]) {
                acc[date] = { orderCount: 0, totalSales: 0, dateObj: new Date(order.createdAt) };
            }
            acc[date].orderCount++;
            acc[date].totalSales += order.totalPrice;
            return acc;
        }, {} as Record<string, { orderCount: number; totalSales: number; dateObj: Date }>);

        return Object.entries(dataByDay)
            .map(([date, data]) => ({ date, ...data }))
            .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    }, [orders]);

    if (salesData.length === 0) {
        return (
             <div className="text-center py-16 px-4 bg-surface rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">No Sales Data</h3>
              <p className="text-gray-500 mt-2">Complete some orders to see sales analytics.</p>
            </div>
        )
    }
    
    const maxSales = Math.max(...salesData.map(d => d.totalSales));

    return (
        <div className="bg-surface rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Sales Performance</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales (Rs.)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {salesData.map(({ date, orderCount, totalSales }) => (
                            <tr key={date} className={totalSales === maxSales ? 'bg-green-50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orderCount}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${totalSales === maxSales ? 'text-green-700' : 'text-gray-900'}`}>{totalSales.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {salesData.find(d => d.totalSales === maxSales) && (
                <p className="mt-4 text-sm text-gray-600">
                    Your best sales day so far was <strong className="text-green-700">{salesData.find(d => d.totalSales === maxSales)?.date}</strong>!
                </p>
            )}
        </div>
    );
}


export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [activeTab, setActiveTab] = useState<ActiveTab>(OrderStatus.PENDING);
  const [isNewOrder, setIsNewOrder] = useState(false);

  const prevOrderCount = useRef(orders.length);
  const notificationSoundRef = useRef<HTMLAudioElement>(null);
  const titleIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Only trigger on new orders, not on updates or deletions
    if (orders.length > prevOrderCount.current) {
      // Play sound
      notificationSoundRef.current?.play().catch(error => {
        console.log("Audio playback failed. User interaction might be required.", error);
      });
      
      // Visual pulse on "Pending" tab
      setIsNewOrder(true);
      setTimeout(() => setIsNewOrder(false), 4000);

      // Flash title if tab is hidden OR user is on another tab
      if (document.hidden || activeTab !== OrderStatus.PENDING) {
        if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
        titleIntervalRef.current = window.setInterval(() => {
          document.title = document.title === 'Sajji Spot' ? '🔥 New Order! 🔥' : 'Sajji Spot';
        }, 1000);
      }
    }
    // Update the previous count for the next render
    prevOrderCount.current = orders.length;
  }, [orders, activeTab]);

  // Effect to stop title flashing when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current);
        titleIntervalRef.current = null;
        document.title = 'Sajji Spot'; // Reset title
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current);
      }
    };
  }, []);

  // Effect to stop title flashing when 'Pending' tab is selected
  useEffect(() => {
      if (activeTab === OrderStatus.PENDING && titleIntervalRef.current) {
          clearInterval(titleIntervalRef.current);
          titleIntervalRef.current = null;
          document.title = 'Sajji Spot';
      }
  }, [activeTab]);


  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const handleUpdateTime = (id:string, time: string) => {
    setOrders(
        orders.map((order) => 
            order.id === id ? {...order, assignedTime: time} : order
        )
    )
  }

  const filteredOrders = useMemo(() => {
    if (activeTab === 'PRODUCTS' || activeTab === 'SALES') return [];
    return orders
      .filter((order) => order.status === activeTab)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, activeTab]);
  
  const ORDER_TABS = [
      { status: OrderStatus.PENDING, label: 'Pending' },
      { status: OrderStatus.IN_PROGRESS, label: 'In Progress' },
      { status: OrderStatus.COMPLETED, label: 'Completed' },
  ]

  const getTabClass = (tabStatus: ActiveTab) => {
    return `relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tabStatus
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`
  }


  return (
    <div className="max-w-7xl mx-auto">
        <audio ref={notificationSoundRef} src={NOTIFICATION_SOUND} preload="auto" />
        <div className="relative text-center mb-8">
            <h2 className="text-3xl font-extrabold text-primary">Admin Dashboard</h2>
            <p className="text-xl font-semibold text-gray-800 mt-3">Welcome Sir Afzal</p>
            <p className="text-gray-500 mt-1">Manage all incoming orders and settings.</p>
            <button
                onClick={onLogout}
                className="absolute top-0 right-0 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                aria-label="Logout"
            >
                Logout
            </button>
        </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 justify-center" aria-label="Tabs">
            {ORDER_TABS.map(tab => (
                 <button key={tab.status} onClick={() => setActiveTab(tab.status)}
                    className={`${getTabClass(tab.status)} ${isNewOrder && tab.status === OrderStatus.PENDING ? 'animate-pulse text-primary' : ''}`}
                 >
                     {tab.label} ({orders.filter(o => o.status === tab.status).length})
                     {isNewOrder && tab.status === OrderStatus.PENDING && (
                        <span className="absolute top-2 -right-2 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                        </span>
                     )}
                 </button>
            ))}
             <button onClick={() => setActiveTab('PRODUCTS')} className={getTabClass('PRODUCTS')}>
                Products
             </button>
             <button onClick={() => setActiveTab('SALES')} className={getTabClass('SALES')}>
                Sales Analytics
             </button>
        </nav>
      </div>

      {(() => {
        if (activeTab === 'PRODUCTS') {
            return <ProductSettings />;
        }
        if (activeTab === 'SALES') {
            return <SalesAnalytics orders={orders} />;
        }
        if (filteredOrders.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onUpdateStatus={handleUpdateStatus}
                            onUpdateTime={handleUpdateTime}
                        />
                    ))}
                </div>
            );
        }
        return (
            <div className="text-center py-16 px-4 bg-surface rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">No Orders Here</h3>
                <p className="text-gray-500 mt-2">There are currently no {activeTab.toLowerCase()} orders.</p>
            </div>
        );
      })()}
    </div>
  );
};