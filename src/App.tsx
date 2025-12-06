import { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import ProductManagement from './components/ProductManagement'
import SupplierManagement from './components/SupplierManagement'
import VendorManagement from './components/VendorManagement'
import PurchaseOrders from './components/PurchaseOrders'
import POSSystem from './components/POSSystem'
import SalesHistory from './components/SalesHistory'
import { BarChart3, ShoppingCart, Package, Store, Users, ShoppingBag, FileText } from 'lucide-react'

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'products' | 'suppliers' | 'vendors' | 'purchases' | 'pos' | 'sales'>('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'products':
        return <ProductManagement />
      case 'suppliers':
        return <SupplierManagement />
      case 'vendors':
        return <VendorManagement />
      case 'purchases':
        return <PurchaseOrders />
      case 'pos':
        return <POSSystem />
      case 'sales':
        return <SalesHistory />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Wholesale POS</h2>
        </div>
        
        <ul className="nav-menu">
          <li>
            <button
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => setCurrentPage('dashboard')}
            >
              <BarChart3 size={20} className="inline" /> Dashboard
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'purchases' ? 'active' : ''}
              onClick={() => setCurrentPage('purchases')}
            >
              <ShoppingBag size={20} className="inline" /> Purchase Orders
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'pos' ? 'active' : ''}
              onClick={() => setCurrentPage('pos')}
            >
              <ShoppingCart size={20} className="inline" /> Sales (Vendor)
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'products' ? 'active' : ''}
              onClick={() => setCurrentPage('products')}
            >
              <Package size={20} className="inline" /> Store Inventory
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'suppliers' ? 'active' : ''}
              onClick={() => setCurrentPage('suppliers')}
            >
              <Store size={20} className="inline" /> Suppliers
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'vendors' ? 'active' : ''}
              onClick={() => setCurrentPage('vendors')}
            >
              <Users size={20} className="inline" /> Vendors/Customers
            </button>
          </li>
          <li>
            <button
              className={currentPage === 'sales' ? 'active' : ''}
              onClick={() => setCurrentPage('sales')}
            >
              <FileText size={20} className="inline" /> Sales History
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <p>© 2025 Wholesale POS</p>
        </div>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
