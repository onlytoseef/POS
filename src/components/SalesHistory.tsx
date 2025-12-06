import { useState } from 'react';
import type { Sale } from '../types';
import salesData from '../data/sales.json';
import { BarChart3, Search, Eye, Receipt, Printer } from 'lucide-react';

export default function SalesHistory() {
  const [sales] = useState<Sale[]>(salesData as Sale[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.vendorName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = filterPayment === 'all' || sale.paymentMethod === filterPayment;
    return matchesSearch && matchesPayment;
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todayRevenue = sales
    .filter(sale => sale.date.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="sales-history">
      <h1><BarChart3 className="inline" size={32} /> Sales History (Vendors)</h1>

      <div className="sales-stats">
        <div className="stat-card blue">
          <h3>Total Revenue</h3>
          <p className="stat-value">Rs. {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="stat-card green">
          <h3>Today's Revenue</h3>
          <p className="stat-value">Rs. {todayRevenue.toLocaleString()}</p>
        </div>
        <div className="stat-card purple">
          <h3>Total Sales</h3>
          <p className="stat-value">{sales.length}</p>
        </div>
      </div>

      <div className="sales-filters">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by Sale ID or Vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
          <option value="all">All Payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="credit">Credit</option>
        </select>
      </div>

      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Date & Time</th>
              <th>Vendor</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map(sale => (
              <tr key={sale.id}>
                <td><strong>{sale.id}</strong></td>
                <td>{new Date(sale.date).toLocaleString()}</td>
                <td>{sale.vendorName}</td>
                <td>{sale.items.length} items</td>
                <td>
                  <span className={`payment-badge ${sale.paymentMethod}`}>
                    {sale.paymentMethod.toUpperCase()}
                  </span>
                </td>
                <td><strong>Rs. {sale.total.toLocaleString()}</strong></td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => setSelectedSale(sale)}
                  >
                    <Eye size={16} className="inline" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSale && (
        <div className="modal-overlay" onClick={() => setSelectedSale(null)}>
          <div className="modal receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="receipt">
              <h2><Receipt className="inline" size={28} /> Sale Details</h2>
              <div className="receipt-header">
                <p><strong>Sale ID:</strong> {selectedSale.id}</p>
                <p><strong>Date:</strong> {new Date(selectedSale.date).toLocaleString()}</p>
                <p><strong>Vendor:</strong> {selectedSale.vendorName}</p>
                <p><strong>Payment:</strong> {selectedSale.paymentMethod.toUpperCase()}</p>
                {selectedSale.notes && <p><strong>Notes:</strong> {selectedSale.notes}</p>}
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
                  {selectedSale.items.map(item => (
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
                <p>Subtotal: <span>Rs. {selectedSale.subtotal.toLocaleString()}</span></p>
                {selectedSale.discount > 0 && (
                  <p>Discount: <span>- Rs. {selectedSale.discount.toLocaleString()}</span></p>
                )}
                <p className="receipt-total">Total: <span>Rs. {selectedSale.total.toLocaleString()}</span></p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={() => window.print()}>
                <Printer size={20} className="inline" /> Print
              </button>
              <button className="btn-secondary" onClick={() => setSelectedSale(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
