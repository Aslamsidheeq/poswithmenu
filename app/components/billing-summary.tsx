import { ShoppingCart, Trash2, X, Plus, Printer } from 'lucide-react';

interface CartItem {
  id: string;
  category: string;
  price: number;
  increment: number;
}

interface BillingSummaryProps {
  cart: CartItem[];
  total: number;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onAddIncrement: (id: string) => void;
  onPlaceOrder: () => void;
}

const SHOP_NAME = 'Grocery POS';

export function BillingSummary({ cart, total, onRemoveItem, onClearCart, onAddIncrement, onPlaceOrder }: BillingSummaryProps) {
  const subtotal = total;

  return (
    <>
      <div className="w-[400px] bg-white border-l border-[#e9ecef] flex flex-col print:hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#e9ecef]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-[#2c3e50]">Current Order</h2>
                <p className="text-[#6c757d] mt-0.5">{cart.length} items</p>
              </div>
            </div>
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="p-2 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#6c757d] hover:text-[#dc3545]"
                title="Clear all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#adb5bd]">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
              <p>No items added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const itemTotal = item.price + item.increment;
                
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-3 rounded-xl bg-[#f8f9fa] hover:bg-[#e9ecef] transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="text-[#495057]">{item.category}</p>
                      <p className="mt-1 text-[#6c5ce7]">
                        {itemTotal.toFixed(2)}
                        {item.increment > 0 && (
                          <span className="text-[#6c757d] ml-1">
                            ({item.price} + {item.increment.toFixed(2)})
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => onAddIncrement(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] text-white hover:shadow-md transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>.25</span>
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-[#dc3545] text-[#6c757d] hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Total & Checkout */}
        <div className="p-6 border-t border-[#e9ecef] bg-[#f8f9fa]">
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[#6c757d]">Subtotal</span>
              <span className="text-[#495057]">AED {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-baseline justify-between pt-3 border-t border-[#dee2e6]">
              <span className="text-[#2c3e50]">Total</span>
              <span className="text-[#6c5ce7]">AED {total.toFixed(2)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={cart.length === 0}
              onClick={() => window.print()}
              className="py-4 rounded-xl bg-white border-2 border-[#6c5ce7] text-[#6c5ce7] hover:bg-[#6c5ce7] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
            <button
              disabled={cart.length === 0}
              onClick={onPlaceOrder}
              className="py-4 rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Order
            </button>
          </div>
        </div>
      </div>

      <div id="receipt-print" aria-hidden="true">
        <div className="receipt-shop-name">{SHOP_NAME}</div>
        <div className="receipt-divider" />
        <div className="receipt-items">
          {cart.map((item) => {
            const itemTotal = item.price + item.increment;

            return (
              <div key={item.id} className="receipt-item-row">
                <span className="receipt-item-name">{item.category}</span>
                <span className="receipt-item-price">{itemTotal.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
        <div className="receipt-divider" />
        <div className="receipt-summary-row">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="receipt-summary-row receipt-total-row">
          <span>Total</span>
          <span>{total.toFixed(2)}</span>
        </div>
      </div>
    </>
  );
}
