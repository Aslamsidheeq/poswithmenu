import { X, ShoppingBag, FileText, LayoutGrid } from 'lucide-react';

type View = 'pos' | 'previous-orders' | 'reports';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
  currentView: View;
}

export function SideMenu({ isOpen, onClose, onNavigate, currentView }: SideMenuProps) {
  const menuItems = [
    { id: 'pos' as View, label: 'POS', icon: LayoutGrid },
    { id: 'previous-orders' as View, label: 'Previous Orders', icon: ShoppingBag },
    { id: 'reports' as View, label: 'Reports', icon: FileText },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#e9ecef] flex items-center justify-between">
          <h2 className="text-[#2c3e50]">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#6c757d]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all mb-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white shadow-md'
                    : 'hover:bg-[#f8f9fa] text-[#495057]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
