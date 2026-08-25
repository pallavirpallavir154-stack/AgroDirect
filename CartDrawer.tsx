import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../../shared/i18n';

interface CartDrawerProps {
  onOrderSuccess: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOrderSuccess }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    productSubtotal,
    platformFee,
    deliveryFee,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { user, language } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NET_BANKING' | 'CARD' | 'ESCROW' | 'CASH_ON_DELIVERY'>('UPI');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.fullName || 'Ananya Sharma',
    street: '14/B, 1st Cross, Farm Road',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    pincode: '560038',
  });

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in or switch user to complete checkout.');
      return;
    }
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: user.id,
          items,
          shippingAddress,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Checkout failed');
        return;
      }

      const order = await res.json();
      clearCart();
      setIsCartOpen(false);
      onOrderSuccess(order.id);
    } catch (e) {
      console.error('Checkout error', e);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#faf8f5] text-stone-900 h-full shadow-2xl flex flex-col justify-between border-l border-stone-300">
        {/* Drawer Header */}
        <div className="p-5 bg-gradient-to-r from-[#1a4329] to-[#255f3a] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">{t.nav.cart}</h3>
              <p className="text-xs text-emerald-200">
                {items.length} {items.length === 1 ? 'Produce Item' : 'Produce Items'}
              </p>
            </div>
          </div>
          <button
            id="cart-drawer-close"
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-stone-500">
              <ShoppingBag className="w-12 h-12 mx-auto text-stone-400 mb-3 opacity-50" />
              <p className="font-medium text-stone-700">Your basket is currently empty.</p>
              <p className="text-xs text-stone-500 mt-1">Browse our direct farmer marketplace to add harvests.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="p-3.5 bg-white border border-stone-200 rounded-2xl shadow-xs flex items-center gap-3"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-900 text-sm truncate">{item.productName}</h4>
                  <p className="text-xs text-stone-500">
                    Farmer: <span className="text-emerald-800 font-medium">{item.farmerName}</span>
                  </p>
                  <p className="text-xs font-semibold text-stone-900 mt-0.5">
                    ₹{item.pricePerUnit}/{item.unit}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-semibold px-2">{item.quantity} {item.unit}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-emerald-900 block">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="mt-2 text-stone-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-3 text-xs">
              <h5 className="font-semibold text-stone-900 text-sm">Delivery Address</h5>
              <input
                type="text"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                placeholder="Recipient Name"
                className="w-full p-2 border border-stone-300 rounded-lg text-xs"
              />
              <input
                type="text"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                placeholder="Street Address / Location"
                className="w-full p-2 border border-stone-300 rounded-lg text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  placeholder="City / District"
                  className="p-2 border border-stone-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  placeholder="Pincode"
                  className="p-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <h5 className="font-semibold text-stone-900 text-sm pt-2">Payment Method</h5>
              <div className="grid grid-cols-2 gap-2">
                {(['UPI', 'NET_BANKING', 'CARD', 'ESCROW', 'CASH_ON_DELIVERY'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2 rounded-lg border text-[11px] font-medium transition ${
                      paymentMethod === method
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {method.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Financials */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-stone-300 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Produce Subtotal:</span>
                <span className="font-semibold text-stone-900">₹{productSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AgroDirect Platform Fee:
                </span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Transport Delivery:</span>
                <span className="font-semibold text-stone-900">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-bold text-stone-900">
                <span>Total Amount:</span>
                <span className="text-emerald-800 font-serif text-lg">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              id="cart-checkout-btn"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm shadow-md transition active:scale-95 disabled:opacity-50"
            >
              {isCheckingOut ? (
                t.common.loading
              ) : (
                <>
                  <span>Place Order & Direct Settle</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
