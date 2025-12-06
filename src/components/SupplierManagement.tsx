import { useState } from 'react';
import type { Supplier } from '../types';
import suppliersData from '../data/suppliers.json';
import { Store, Plus, Search, Edit2, Trash2, Phone, Mail, MapPin, CreditCard, DollarSign } from 'lucide-react';

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(suppliersData as Supplier[]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contact: '',
    email: '',
    address: '',
    paymentTerms: 'cash',
    creditLimit: 0,
    balance: 0,
  });

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSupplier) {
      setSuppliers(suppliers.map(s =>
        s.id === editingSupplier.id ? { ...formData as Supplier, id: editingSupplier.id } : s
      ));
    } else {
      const newSupplier: Supplier = {
        ...formData as Supplier,
        id: `S${String(suppliers.length + 1).padStart(3, '0')}`,
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact: '',
      email: '',
      address: '',
      paymentTerms: 'cash',
      creditLimit: 0,
      balance: 0,
    });
    setEditingSupplier(null);
    setShowAddModal(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  return (
    <div className="supplier-management">
      <div className="page-header">
        <h1><Store className="inline" size={32} /> Supplier Management</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} className="inline" /> Add Supplier
        </button>
      </div>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search suppliers by name or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="suppliers-grid">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="supplier-card">
            <div className="supplier-header">
              <h3>{supplier.name}</h3>
              <span className={`payment-badge ${supplier.paymentTerms}`}>
                {supplier.paymentTerms.toUpperCase()}
              </span>
            </div>

            <div className="supplier-details">
              <p><strong>ID:</strong> {supplier.id}</p>
              <p><Phone size={16} className="inline" /> <strong>Contact:</strong> {supplier.contact}</p>
              <p><Mail size={16} className="inline" /> <strong>Email:</strong> {supplier.email}</p>
              <p><MapPin size={16} className="inline" /> <strong>Address:</strong> {supplier.address}</p>
              
              {supplier.paymentTerms === 'credit' && (
                <>
                  <p><CreditCard size={16} className="inline" /> <strong>Credit Limit:</strong> Rs. {supplier.creditLimit?.toLocaleString()}</p>
                  <p><DollarSign size={16} className="inline" /> <strong>Balance:</strong> 
                    <span className={supplier.balance! > 0 ? 'text-warning' : ''}>
                      {' '}Rs. {supplier.balance?.toLocaleString()}
                    </span>
                  </p>
                </>
              )}
            </div>

            <div className="supplier-actions">
              <button className="btn-edit" onClick={() => handleEdit(supplier)}>
                <Edit2 size={16} className="inline" /> Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(supplier.id)}>
                <Trash2 size={16} className="inline" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Supplier Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
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
                  {editingSupplier ? 'Update' : 'Add'} Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
