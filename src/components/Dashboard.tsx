import { useState, useEffect } from 'react';
import type { DashboardStats, Product, Sale, PurchaseOrder, Vendor } from '../types';
import productsData from '../data/products.json';
import salesData from '../data/sales.json';
import purchasesData from '../data/purchases.json';
import suppliersData from '../data/suppliers.json';
import vendorsData from '../data/vendors.json';
import { BarChart3, DollarSign, TrendingUp, Package, AlertTriangle, Store, Users, ShoppingBag } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    todaySales: 0,
    totalPurchases: 0,
    todayPurchases: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalSuppliers: 0,
    totalVendors: 0,
    profitMargin: 0,
  });

  useEffect(() => {
    const products = productsData as Product[];
    const sales = salesData as Sale[];
    const purchases = purchasesData as PurchaseOrder[];
    
    const today = new Date().toISOString().split('T')[0];
    const todaySalesAmount = sales
      .filter(sale => sale.date.startsWith(today))
      .reduce((sum, sale) => sum + sale.total, 0);
    
    const todayPurchasesAmount = purchases
      .filter(purchase => purchase.date.startsWith(today))
      .reduce((sum, purchase) => sum + purchase.total, 0);
    
    const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalPurchasesAmount = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const lowStock = products.filter(p => p.quantity <= p.lowStockThreshold).length;
    const profit = totalSalesAmount - totalPurchasesAmount;
    const profitMarginPercent = totalSalesAmount > 0 ? (profit / totalSalesAmount) * 100 : 0;

    setStats({
      totalSales: totalSalesAmount,
      todaySales: todaySalesAmount,
      totalPurchases: totalPurchasesAmount,
      todayPurchases: todayPurchasesAmount,
      totalProducts: products.length,
      lowStockProducts: lowStock,
      totalSuppliers: suppliersData.length,
      totalVendors: vendorsData.length,
      profitMargin: profitMarginPercent,
    });
  }, []);

  const lowStockProducts = (productsData as Product[]).filter(
    p => p.quantity <= p.lowStockThreshold
  );

  return (
    <div className="dashboard">
      <h1><BarChart3 className="inline" size={32} /> Wholesale Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><DollarSign size={36} /></div>
          <div className="stat-info">
            <h3>Today's Sales</h3>
            <p className="stat-value">Rs. {stats.todaySales.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon"><TrendingUp size={36} /></div>
          <div className="stat-info">
            <h3>Total Sales</h3>
            <p className="stat-value">Rs. {stats.totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon"><ShoppingBag size={36} /></div>
          <div className="stat-info">
            <h3>Total Purchases</h3>
            <p className="stat-value">Rs. {stats.totalPurchases.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon"><Package size={36} /></div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #dc2626' }}>
          <div className="stat-icon"><AlertTriangle size={36} /></div>
          <div className="stat-info">
            <h3>Low Stock Items</h3>
            <p className="stat-value">{stats.lowStockProducts}</p>
          </div>
        </div>

        <div className="stat-card teal">
          <div className="stat-icon"><Store size={36} /></div>
          <div className="stat-info">
            <h3>Suppliers</h3>
            <p className="stat-value">{stats.totalSuppliers}</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #06b6d4' }}>
          <div className="stat-icon"><Users size={36} /></div>
          <div className="stat-info">
            <h3>Vendors</h3>
            <p className="stat-value">{stats.totalVendors}</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon"><TrendingUp size={36} /></div>
          <div className="stat-info">
            <h3>Profit Margin</h3>
            <p className="stat-value">{stats.profitMargin.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="alert-section">
          <h2><AlertTriangle className="inline" size={24} /> Low Stock Alert</h2>
          <div className="low-stock-list">
            {lowStockProducts.map(product => (
              <div key={product.id} className="low-stock-item">
                <span className="product-name">{product.name}</span>
                <span className="stock-info">
                  Stock: <strong>{product.quantity}</strong> (Threshold: {product.lowStockThreshold})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="recent-sales">
        <h2><BarChart3 className="inline" size={24} /> Recent Sales</h2>
        <table className="sales-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {(salesData as Sale[]).slice(0, 5).map(sale => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{new Date(sale.date).toLocaleString()}</td>
                <td>{sale.items.length} items</td>
                <td>
                  <span className={`payment-badge ${sale.paymentMethod}`}>
                    {sale.paymentMethod.toUpperCase()}
                  </span>
                </td>
                <td>Rs. {sale.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
