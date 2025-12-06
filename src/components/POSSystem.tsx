import { useState } from 'react';
import type { Product, Sale, SaleItem, Vendor } from '../types';
import productsData from '../data/products.json';
import vendorsData from '../data/vendors.json';
import { ShoppingCart, Search, X, Printer, Receipt } from 'lucide-react';

export default function POSSystem() {
  const [products] = useState<Product[]>(productsData as Product[]);
  const [vendors] = useState<Vendor[]>(vendorsData as Vendor[]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [notes, setNotes] = useState('');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        alert('Not enough stock!');
        return;
      }
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price,
      }]);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && quantity > product.quantity) {
      alert('Not enough stock!');
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!selectedVendor) {
      alert('Please select a vendor!');
      return;
    }

    const vendor = vendors.find(v => v.id === selectedVendor);
    if (!vendor) return;

    const sale: Sale = {
      id: `SALE${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString(),
      vendorId: selectedVendor,
      vendorName: vendor.businessName,
      items: cart,
      subtotal,
      tax: 0,
      discount,
      total,
      paymentMethod,
      notes,
    };

    setCurrentSale(sale);
    setShowReceipt(true);
    
    // Clear cart
    setCart([]);
    setDiscount(0);
    setSelectedVendor('');
    setSearchTerm('');
    setNotes('');
  };

  const clearCart = () => {
    if (confirm('Clear all items from cart?')) {
      setCart([]);
      setDiscount(0);
    }
  };

  return (
    <div className="pos-system">
      <h1><ShoppingCart className="inline" size={32} /> Wholesale Sales (Vendor)</h1>

      <div className="pos-layout">
        {/* Products Section */}
        <div className="products-section">
          <div className="pos-search">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search by name, SKU or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="pos-products-grid">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={`pos-product-card ${product.quantity === 0 ? 'out-of-stock' : ''}`}
                onClick={() => product.quantity > 0 && addToCart(product)}
              >
                <h4>{product.name}</h4>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0' }}>{product.sku}</p>
                <p className="product-price">Rs. {product.price}</p>
                <p className="product-stock">
                  Stock: {product.quantity}
                  {product.quantity === 0 && ' (Out of Stock)'}
                  {product.quantity <= product.lowStockThreshold && product.quantity > 0 && ' (Low)'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <div className="cart-header">
            <h2><ShoppingCart size={24} className="inline" /> Cart</h2>
            {cart.length > 0 && (
              <button className="btn-clear" onClick={clearCart}>Clear</button>
            )}
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <p className="empty-cart">Cart is empty</p>
            ) : (
              cart.map(item => (
                <div key={item.productId} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.productName}</h4>
                    <p>Rs. {item.price} × {item.quantity}</p>
                  </div>
                  
                  <div className="cart-item-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="cart-item-total">
                    Rs. {item.total.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="form-group">
                <label>Select Vendor *</label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  required
                >
                  <option value="">Choose Vendor</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.businessName} - {v.name}</option>
                  ))}
                </select>
              </div>

              <div className="payment-method">
                <label>Payment Method:</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
                  <option value="cash">Cash</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

              <div className="discount-input">
                <label>Discount (Rs.):</label>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Add notes..."
                />
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount:</span>
                    <span>- Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button className="btn-checkout" onClick={handleCheckout}>
                <Receipt size={20} className="inline" /> Complete Sale
              </button>
            </div>
          )}
        </div>
      </div>

      {showReceipt && currentSale && (
        <div className="modal-overlay" onClick={() => setShowReceipt(false)}>
          <div className="modal receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="receipt">
              <h2><Receipt className="inline" size={28} /> Sale Receipt</h2>
              <div className="receipt-header">
                <p><strong>Sale ID:</strong> {currentSale.id}</p>
                <p><strong>Date:</strong> {new Date(currentSale.date).toLocaleString()}</p>
                <p><strong>Vendor:</strong> {currentSale.vendorName}</p>
                <p><strong>Payment:</strong> {currentSale.paymentMethod.toUpperCase()}</p>
                {currentSale.notes && <p><strong>Notes:</strong> {currentSale.notes}</p>}
              </div>

              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSale.items.map(item => (
                    <tr key={item.productId}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>Rs. {item.price}</td>
                      <td>Rs. {item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="receipt-summary">
                <p>Subtotal: <span>Rs. {currentSale.subtotal.toLocaleString()}</span></p>
                {currentSale.discount > 0 && (
                  <p>Discount: <span>- Rs. {currentSale.discount.toLocaleString()}</span></p>
                )}
                <p className="receipt-total">Total: <span>Rs. {currentSale.total.toLocaleString()}</span></p>
              </div>

              <div className="receipt-footer">
                <p>Thank you for your business!</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={() => window.print()}>
                <Printer size={20} className="inline" /> Print
              </button>
              <button className="btn-secondary" onClick={() => setShowReceipt(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
