import { useState } from 'react';
import type { Product, Supplier } from '../types';
import productsData from '../data/products.json';
import suppliersData from '../data/suppliers.json';
import { Package, Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(productsData as Product[]);
  const [suppliers] = useState<Supplier[]>(suppliersData as Supplier[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    barcode: '',
    price: 0,
    purchasePrice: 0,
    quantity: 0,
    category: '',
    supplierId: '',
    lowStockThreshold: 10,
    description: '',
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...formData as Product, id: editingProduct.id } : p
      ));
    } else {
      // Add new product
      const newProduct: Product = {
        ...formData as Product,
        id: `P${String(products.length + 1).padStart(3, '0')}`,
      };
      setProducts([...products, newProduct]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      barcode: '',
      price: 0,
      purchasePrice: 0,
      quantity: 0,
      category: '',
      supplierId: '',
      lowStockThreshold: 10,
      description: '',
    });
    setEditingProduct(null);
    setShowAddModal(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getSupplierName = (supplierId: string) => {
    return suppliers.find(s => s.id === supplierId)?.name || 'Unknown';
  };

  return (
    <div className="product-management">
      <div className="page-header">
        <h1><Package className="inline" size={32} /> Product Management</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} className="inline" /> Add Product
        </button>
      </div>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Sale Price</th>
              <th>Purchase Price</th>
              <th>Stock</th>
              <th>Supplier</th>
              <th>Barcode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td><strong>{product.id}</strong></td>
                <td>{product.name}</td>
                <td><code style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{product.sku}</code></td>
                <td>
                  <span className="category-badge">{product.category}</span>
                </td>
                <td>Rs. {product.price.toLocaleString()}</td>
                <td>Rs. {product.purchasePrice.toLocaleString()}</td>
                <td>
                  <span className={product.quantity <= product.lowStockThreshold ? 'low-stock' : ''}>
                    {product.quantity} units
                  </span>
                </td>
                <td>{getSupplierName(product.supplierId)}</td>
                <td>{product.barcode || '-'}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-edit" onClick={() => handleEdit(product)}>
                      <Edit2 size={16} className="inline" /> Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(product.id)}>
                      <Trash2 size={16} className="inline" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU-XXX-001"
                  />
                </div>

                <div className="form-group">
                  <label>Barcode *</label>
                  <input
                    type="text"
                    required
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sale Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Purchase Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Low Stock Threshold *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Supplier *</label>
                  <select
                    required
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
