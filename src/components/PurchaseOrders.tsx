import { useState } from 'react';
import type { PurchaseOrder, PurchaseItem, Product, Supplier } from '../types';
import purchasesData from '../data/purchases.json';
import productsData from '../data/products.json';
import suppliersData from '../data/suppliers.json';
import { ShoppingBag, Plus, Search, Eye, Printer, X, Receipt } from 'lucide-react';

export default function PurchaseOrders() {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(purchasesData as PurchaseOrder[]);
  const [products] = useState<Product[]>(productsData as Product[]);
  const [suppliers] = useState<Supplier[]>(suppliersData as Supplier[]);
  const [cart, setCart] = useState<PurchaseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseOrder | null>(null);
  const [filterSupplier, setFilterSupplier] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSupplier = filterSupplier === 'all' || purchase.supplierId === filterSupplier;
    const matchesPayment = filterPayment === 'all' || purchase.paymentMethod === filterPayment;
    return matchesSupplier && matchesPayment;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
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
        price: product.purchasePrice,
        total: product.purchasePrice,
      }]);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
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

  const handleCreatePurchase = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!selectedSupplier) {
      alert('Please select a supplier!');
      return;
    }

    const supplier = suppliers.find(s => s.id === selectedSupplier);
    if (!supplier) return;

    const purchase: PurchaseOrder = {
      id: `PO${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString(),
      supplierId: selectedSupplier,
      supplierName: supplier.name,
      items: cart,
      subtotal,
      tax: 0,
      discount,
      total,
      paymentMethod,
      notes,
    };

    setPurchases([purchase, ...purchases]);
    
    // Clear form
    setCart([]);
    setSelectedSupplier('');
    setDiscount(0);
    setNotes('');
    setSearchTerm('');
    setShowPurchaseForm(false);
    
    alert('Purchase order created successfully!');
  };

  const clearCart = () => {
    if (confirm('Clear all items from cart?')) {
      setCart([]);
      setDiscount(0);
    }
  };

  const totalPurchaseAmount = purchases.reduce((sum, p) => sum + p.total, 0);
  const cashPurchases = purchases.filter(p => p.paymentMethod === 'cash').reduce((sum, p) => sum + p.total, 0);
  const creditPurchases = purchases.filter(p => p.paymentMethod === 'credit').reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="purchase-orders">
      <div className="page-header">
        <h1><ShoppingBag className="inline" size={32} /> Purchase Orders</h1>
        <button className="btn-primary" onClick={() => setShowPurchaseForm(true)}>
          <Plus size={20} className="inline" /> New Purchase
        </button>
      </div>

      <div className="sales-stats">
        <div className="stat-card blue">
          <h3>Total Purchases</h3>
          <p className="stat-value">Rs. {totalPurchaseAmount.toLocaleString()}</p>
        </div>
        <div className="stat-card green">
          <h3>Cash Purchases</h3>
          <p className="stat-value">Rs. {cashPurchases.toLocaleString()}</p>
        </div>
        <div className="stat-card orange">
          <h3>Credit Purchases</h3>
          <p className="stat-value">Rs. {creditPurchases.toLocaleString()}</p>
        </div>
      </div>

      <div className="sales-filters">
        <select value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)}>
          <option value="all">All Suppliers</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
          <option value="all">All Payments</option>
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
        </select>
      </div>

      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>PO ID</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map(purchase => (
              <tr key={purchase.id}>
                <td><strong>{purchase.id}</strong></td>
                <td>{new Date(purchase.date).toLocaleDateString()}</td>
                <td>{purchase.supplierName}</td>
                <td>{purchase.items.length} items</td>
                <td>
                  <span className={`payment-badge ${purchase.paymentMethod}`}>
                    {purchase.paymentMethod.toUpperCase()}
                  </span>
                </td>
                <td><strong>Rs. {purchase.total.toLocaleString()}</strong></td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => setSelectedPurchase(purchase)}
                  >
                    <Eye size={16} className="inline" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Purchase Form Modal */}
      {showPurchaseForm && (
        <div className="modal-overlay" onClick={() => setShowPurchaseForm(false)}>
          <div className="modal" style={{ maxWidth: '1200px', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2><ShoppingBag className="inline" size={28} /> Create Purchase Order</h2>
              <button className="btn-secondary" onClick={() => setShowPurchaseForm(false)} style={{ padding: '0.5rem' }}>
                <X size={20} />
              </button>
            </div>

            <div className="pos-layout" style={{ height: 'auto', maxHeight: '70vh' }}>
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
                      className="pos-product-card"
                      onClick={() => addToCart(product)}
                    >
                      <h4>{product.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0' }}>{product.sku}</p>
                      <p className="product-price">Rs. {product.purchasePrice}</p>
                      <p className="product-stock">Current: {product.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Section */}
              <div className="cart-section">
                <div className="cart-header">
                  <h2>Purchase Items</h2>
                  {cart.length > 0 && (
                    <button className="btn-clear" onClick={clearCart}>Clear</button>
                  )}
                </div>

                <div className="form-group">
                  <label>Select Supplier *</label>
                  <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    required
                  >
                    <option value="">Choose Supplier</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="cart-items" style={{ maxHeight: '250px' }}>
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

                    <button className="btn-checkout" onClick={handleCreatePurchase}>
                      <Receipt size={20} className="inline" /> Create Purchase
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Purchase Details Modal */}
      {selectedPurchase && (
        <div className="modal-overlay" onClick={() => setSelectedPurchase(null)}>
          <div className="modal receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="receipt">
              <h2><Receipt className="inline" size={28} /> Purchase Order Details</h2>
              <div className="receipt-header">
                <p><strong>PO ID:</strong> {selectedPurchase.id}</p>
                <p><strong>Date:</strong> {new Date(selectedPurchase.date).toLocaleString()}</p>
                <p><strong>Supplier:</strong> {selectedPurchase.supplierName}</p>
                <p><strong>Payment:</strong> {selectedPurchase.paymentMethod.toUpperCase()}</p>
                {selectedPurchase.notes && <p><strong>Notes:</strong> {selectedPurchase.notes}</p>}
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
                  {selectedPurchase.items.map(item => (
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
                <p>Subtotal: <span>Rs. {selectedPurchase.subtotal.toLocaleString()}</span></p>
                {selectedPurchase.discount > 0 && (
                  <p>Discount: <span>- Rs. {selectedPurchase.discount.toLocaleString()}</span></p>
                )}
                <p className="receipt-total">Total: <span>Rs. {selectedPurchase.total.toLocaleString()}</span></p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={() => window.print()}>
                <Printer size={20} className="inline" /> Print
              </button>
              <button className="btn-secondary" onClick={() => setSelectedPurchase(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
