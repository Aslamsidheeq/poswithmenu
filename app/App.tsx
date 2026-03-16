import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { CategorySection } from './components/category-section';
import { BillingSummary } from './components/billing-summary';
import { SideMenu } from './components/side-menu';
import { PreviousOrders } from './components/previous-orders';
import { Reports } from './components/reports';
import { SuccessIndicator } from './components/success-indicator';
import { initDB, saveOrder, type Order } from './utils/db';

interface CartItem {
  id: string;
  category: string;
  price: number;
  increment: number;
}

type View = 'pos' | 'previous-orders' | 'reports';

const categories = [
  { name: 'Dairy Products', prices: [1, 2, 3, 4, 5] },
  { name: 'Snacks', prices: [1, 2, 3, 4, 5] },
  { name: 'Drinks', prices: [1, 2, 3, 4, 5] },
  { name: 'Bakery', prices: [1, 2, 3, 4, 5] },
  { name: 'Fruits & Vegetables', prices: [1, 2, 3, 4, 5] },
  { name: 'Frozen Foods', prices: [1, 2, 3, 4, 5] },
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('pos');
  const [orders, setOrders] = useState<Order[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    initDB();
  }, []);

  const addToCart = (category: string, price: number) => {
    const newItem: CartItem = {
      id: `${Date.now()}-${Math.random()}`,
      category,
      price,
      increment: 0,
    };
    setCart([...cart, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const addIncrement = (id: string) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newIncrement = item.increment + 0.25;
        return { ...item, increment: newIncrement };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price + item.increment, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    const order: Order = {
      id: `order-${Date.now()}`,
      items: [...cart],
      total,
      date: new Date().toLocaleString(),
      timestamp: Date.now(),
    };

    try {
      await saveOrder(order);
      setOrders([order, ...orders]);
      clearCart();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order');
    }
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    setMenuOpen(false);
  };

  return (
    <div className="size-full flex bg-[#f8f9fa]">
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-6 left-6 z-50 p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all border border-[#e9ecef] text-[#495057] hover:text-[#6c5ce7]"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Side Menu */}
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* Main Content */}
      {currentView === 'pos' && (
        <>
          {/* Left Side - Categories & Products */}
          <div className="flex-1 overflow-y-auto p-8 pl-24">
            <h1 className="mb-8 text-[#2c3e50]">Grocery POS</h1>
            <div className="grid grid-cols-2 gap-6">
              {categories.map((category) => (
                <CategorySection
                  key={category.name}
                  category={category}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Billing Summary */}
          <BillingSummary
            cart={cart}
            total={total}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onAddIncrement={addIncrement}
            onPlaceOrder={handlePlaceOrder}
          />
        </>
      )}

      {currentView === 'previous-orders' && (
        <PreviousOrders orders={orders} setOrders={setOrders} />
      )}

      {currentView === 'reports' && (
        <Reports orders={orders} />
      )}

      {showSuccess && <SuccessIndicator onClose={() => setShowSuccess(false)} />}
    </div>
  );
}