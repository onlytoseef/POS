// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  purchasePrice: number;
  quantity: number;
  category: string;
  supplierId: string;
  lowStockThreshold: number;
  description?: string;
  image?: string;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  paymentTerms: 'cash' | 'credit';
  creditLimit?: number;
  balance?: number;
  totalPurchases?: number;
  cashPurchases?: number;
  creditPurchases?: number;
}

// Vendor/Customer Types
export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  contact: string;
  email: string;
  address: string;
  paymentTerms: 'cash' | 'credit';
  creditLimit?: number;
  balance?: number;
  totalSales?: number;
  cashSales?: number;
  creditSales?: number;
}

// Purchase Order Types
export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'credit';
  notes?: string;
}

// Sale Types (to Vendors)
export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  date: string;
  vendorId: string;
  vendorName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'credit';
  notes?: string;
}

// Category Type
export interface Category {
  id: string;
  name: string;
  description?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalSales: number;
  todaySales: number;
  totalPurchases: number;
  todayPurchases: number;
  totalProducts: number;
  lowStockProducts: number;
  totalSuppliers: number;
  totalVendors: number;
  profitMargin: number;
}
