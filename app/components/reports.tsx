import { FileText, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import { type Order } from '../utils/db';
import { useState } from 'react';

interface ReportsProps {
  orders: Order[];
}

type FilterType = 'all' | 'today' | 'week' | 'month' | 'custom-month';

export function Reports({ orders }: ReportsProps) {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  // Filter orders based on selected filter
  const getFilteredOrders = () => {
    const now = new Date();
    
    switch (filterType) {
      case 'today': {
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const todayEnd = todayStart + 24 * 60 * 60 * 1000;
        return orders.filter(order => order.timestamp >= todayStart && order.timestamp < todayEnd);
      }
      case 'week': {
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
        return orders.filter(order => order.timestamp >= weekStart);
      }
      case 'month': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        return orders.filter(order => order.timestamp >= monthStart);
      }
      case 'custom-month': {
        const [year, month] = selectedMonth.split('-').map(Number);
        const monthStart = new Date(year, month - 1, 1).getTime();
        const monthEnd = new Date(year, month, 1).getTime();
        return orders.filter(order => order.timestamp >= monthStart && order.timestamp < monthEnd);
      }
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  // Calculate statistics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const totalItems = filteredOrders.reduce((sum, order) => sum + order.items.length, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Category breakdown
  const categoryStats = filteredOrders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.category]) {
        acc[item.category] = { count: 0, revenue: 0 };
      }
      acc[item.category].count++;
      acc[item.category].revenue += item.price + item.increment;
    });
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const categoryArray = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      ...stats,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="flex-1 overflow-y-auto p-8 pl-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-[#2c3e50]">Reports</h1>
            <p className="text-[#6c757d]">Sales analytics and insights</p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white shadow-md'
                  : 'bg-white border border-[#e9ecef] text-[#495057] hover:bg-[#f8f9fa]'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilterType('today')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'today'
                  ? 'bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white shadow-md'
                  : 'bg-white border border-[#e9ecef] text-[#495057] hover:bg-[#f8f9fa]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilterType('week')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'week'
                  ? 'bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white shadow-md'
                  : 'bg-white border border-[#e9ecef] text-[#495057] hover:bg-[#f8f9fa]'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilterType('month')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'month'
                  ? 'bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white shadow-md'
                  : 'bg-white border border-[#e9ecef] text-[#495057] hover:bg-[#f8f9fa]'
              }`}
            >
              This Month
            </button>
            <div className="flex items-center gap-2">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setFilterType('custom-month');
                }}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  filterType === 'custom-month'
                    ? 'border-[#6c5ce7] bg-[#f5f3ff] text-[#6c5ce7]'
                    : 'border-[#e9ecef] bg-white text-[#495057]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9ecef]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#e3f2fd] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#2196f3]" />
              </div>
              <p className="text-[#6c757d]">Total Revenue</p>
            </div>
            <p className="text-[#2c3e50]">AED {totalRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9ecef]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#f3e5f5] flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-[#9c27b0]" />
              </div>
              <p className="text-[#6c757d]">Total Orders</p>
            </div>
            <p className="text-[#2c3e50]">{totalOrders}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9ecef]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#4caf50]" />
              </div>
              <p className="text-[#6c757d]">Avg Order Value</p>
            </div>
            <p className="text-[#2c3e50]">AED {averageOrderValue.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9ecef]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#fff3e0] flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-[#ff9800]" />
              </div>
              <p className="text-[#6c757d]">Total Items</p>
            </div>
            <p className="text-[#2c3e50]">{totalItems}</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9ecef]">
          <h3 className="text-[#2c3e50] mb-6">Category Breakdown</h3>
          
          {categoryArray.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#adb5bd]">
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p>No data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryArray.map((item) => (
                <div key={item.category} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#495057]">{item.category}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-[#6c757d]">{item.count} items</span>
                        <span className="text-[#6c5ce7]">AED {item.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-[#f8f9fa] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] rounded-full transition-all"
                        style={{
                          width: `${totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}