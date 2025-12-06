import { useState } from 'react';
import type { Vendor, Sale } from '../types';
import vendorsData from '../data/vendors.json';
import salesData from '../data/sales.json';
import { Users, Plus, Search, Edit2, Trash2, Phone, Mail, MapPin, CreditCard, DollarSign, FileText, X } from 'lucide-react';

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(vendorsData as Vendor[]);
  const [sales] = useState<Sale[]>(salesData as Sale[]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    businessName: '',
    contact: '',
    email: '',
    address: '',
    paymentTerms: 'cash',
    creditLimit: 0,
    balance: 0,
    totalSales: 0,
    cashSales: 0,
    creditSales: 0,
  });

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.contact.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVendor) {
      setVendors(vendors.map(v =>
        v.id === editingVendor.id ? { ...formData as Vendor, id: editingVendor.id } : v
      ));
    } else {
      const newVendor: Vendor = {
        ...formData as Vendor,
        id: `V${String(vendors.length + 1).padStart(3, '0')}`,
      };
      setVendors([...vendors, newVendor]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      businessName: '',
      contact: '',
      email: '',
      address: '',
      paymentTerms: 'cash',
      creditLimit: 0,
      balance: 0,
      totalSales: 0,
      cashSales: 0,
      creditSales: 0,
    });
    setEditingVendor(null);
    setShowAddModal(false);
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData(vendor);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  const getVendorSales = (vendorId: string) => {
    return sales.filter(s => s.vendorId === vendorId);
  };

  const showVendorDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  return (
    <div className="vendor-management">
      <div className="page-header">
        <h1><Users className="inline" size={32} /> Vendor Management</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} className="inline" /> Add Vendor
        </button>
      </div>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search vendors by name, business or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="suppliers-grid">
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className="supplier-card" onClick={() => showVendorDetails(vendor)} style={{ cursor: 'pointer' }}>
            <div className="supplier-header">
              <div>
                <h3>{vendor.businessName}</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{vendor.name}</p>
              </div>
              <span className={`payment-badge ${vendor.paymentTerms}`}>
                {vendor.paymentTerms.toUpperCase()}
              </span>
            </div>

            <div className="supplier-details">
              <p><strong>ID:</strong> {vendor.id}</p>
              <p><Phone size={16} className="inline" /> <strong>Contact:</strong> {vendor.contact}</p>
              <p><Mail size={16} className="inline" /> <strong>Email:</strong> {vendor.email}</p>
              <p><MapPin size={16} className="inline" /> <strong>Address:</strong> {vendor.address}</p>
              
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '8px' }}>
                <p style={{ margin: '0.25rem 0' }}><strong>Total Sales:</strong> Rs. {vendor.totalSales?.toLocaleString()}</p>
                <p style={{ margin: '0.25rem 0', color: '#10b981' }}><strong>Cash:</strong> Rs. {vendor.cashSales?.toLocaleString()}</p>
                <p style={{ margin: '0.25rem 0', color: '#f59e0b' }}><strong>Credit:</strong> Rs. {vendor.creditSales?.toLocaleString()}</p>
              </div>

              {vendor.paymentTerms === 'credit' && (
                <>
                  <p style={{ marginTop: '0.75rem' }}><CreditCard size={16} className="inline" /> <strong>Credit Limit:</strong> Rs. {vendor.creditLimit?.toLocaleString()}</p>
                  <p><DollarSign size={16} className="inline" /> <strong>Balance:</strong> 
                    <span className={vendor.balance! > 0 ? 'text-warning' : ''}>
                      {' '}Rs. {vendor.balance?.toLocaleString()}
                    </span>
                  </p>
                </>
              )}
            </div>

            <div className="supplier-actions" onClick={(e) => e.stopPropagation()}>
              <button className="btn-edit" onClick={() => handleEdit(vendor)}>
                <Edit2 size={16} className="inline" /> Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(vendor.id)}>
                <Trash2 size={16} className="inline" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="+92-300-1234567"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label>Payment Terms *</label>
                <select
                  required
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    paymentTerms: e.target.value as 'cash' | 'credit' 
                  })}
                >
                  <option value="cash">Cash</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

              {formData.paymentTerms === 'credit' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Credit Limit (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.creditLimit}
                      onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Current Balance (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.balance}
                      onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingVendor ? 'Update' : 'Add'} Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Account Ledger Modal */}
      {selectedVendor && (
        <div className="modal-overlay" onClick={() => setSelectedVendor(null)}>
          <div className="modal" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h2><FileText className="inline" size={28} /> Vendor Account Ledger</h2>
                <h3 style={{ margin: '0.5rem 0', color: '#3b82f6' }}>{selectedVendor.businessName}</h3>
                <p style={{ margin: 0, color: '#6b7280' }}>{selectedVendor.name}</p>
              </div>
              <button 
                className="btn-secondary" 
                onClick={() => setSelectedVendor(null)}
                style={{ padding: '0.5rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ margin: '0.25rem 0' }}><Phone size={16} className="inline" /> {selectedVendor.contact}</p>
                  <p style={{ margin: '0.25rem 0' }}><Mail size={16} className="inline" /> {selectedVendor.email}</p>
                  <p style={{ margin: '0.25rem 0' }}><MapPin size={16} className="inline" /> {selectedVendor.address}</p>
                </div>
                <div>
                  <p style={{ margin: '0.25rem 0' }}><strong>Payment Terms:</strong> <span className={`payment-badge ${selectedVendor.paymentTerms}`}>{selectedVendor.paymentTerms.toUpperCase()}</span></p>
                  {selectedVendor.paymentTerms === 'credit' && (
                    <>
                      <p style={{ margin: '0.25rem 0' }}><strong>Credit Limit:</strong> Rs. {selectedVendor.creditLimit?.toLocaleString()}</p>
                      <p style={{ margin: '0.25rem 0' }}><strong>Outstanding Balance:</strong> <span style={{ color: selectedVendor.balance! > 0 ? '#dc2626' : '#10b981', fontWeight: 600 }}>Rs. {selectedVendor.balance?.toLocaleString()}</span></p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af' }}>Total Sales</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 700, color: '#1e40af' }}>Rs. {selectedVendor.totalSales?.toLocaleString()}</p>
              </div>
              <div style={{ background: '#d1fae5', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#065f46' }}>Cash Sales</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 700, color: '#065f46' }}>Rs. {selectedVendor.cashSales?.toLocaleString()}</p>
              </div>
              <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>Credit Sales</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 700, color: '#92400e' }}>Rs. {selectedVendor.creditSales?.toLocaleString()}</p>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Sales History</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Sale ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {getVendorSales(selectedVendor.id).map(sale => (
                    <tr key={sale.id}>
                      <td><strong>{sale.id}</strong></td>
                      <td>{new Date(sale.date).toLocaleDateString()}</td>
                      <td>
                        {sale.items.map(item => (
                          <div key={item.productId} style={{ fontSize: '0.875rem' }}>
                            {item.productName} × {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td><strong>Rs. {sale.total.toLocaleString()}</strong></td>
                      <td>
                        <span className={`payment-badge ${sale.paymentMethod}`}>
                          {sale.paymentMethod.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getVendorSales(selectedVendor.id).length === 0 && (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No sales history found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
