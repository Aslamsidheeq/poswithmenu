import { useEffect } from 'react';
import { ShoppingBag, Trash2, Calendar } from 'lucide-react';
import { getAllOrders, deleteOrder, type Order } from '../utils/db';

interface PreviousOrdersProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

export function PreviousOrders({ orders, setOrders }: PreviousOrdersProps) {
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id);
        setOrders(orders.filter(order => order.id !== id));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 pl-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-[#2c3e50]">Previous Orders</h1>
            <p className="text-[#6c757d]">{orders.length} total orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#adb5bd]">
            <ShoppingBag className="w-20 h-20 mb-4 opacity-50" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9ecef] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#6c757d]" />
                    <div>
                      <p className="text-[#495057]">{order.date}</p>
                      <p className="text-[#6c757d] mt-1">Order #{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[#6c757d]">Total</p>
                      <p className="text-[#6c5ce7]">AED {order.total.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-2 rounded-lg hover:bg-[#fee] text-[#6c757d] hover:text-[#dc3545] transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#e9ecef] pt-4">
                  <p className="text-[#6c757d] mb-3">{order.items.length} items</p>
                  <div className="grid grid-cols-2 gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9fa]"
                      >
                        <span className="text-[#495057]">{item.category}</span>
                        <span className="text-[#6c5ce7]">
                          {(item.price + item.increment).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
