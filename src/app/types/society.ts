// User Roles
export type UserRole = 'resident' | 'admin' | 'accountant';

// User Interface
export interface User {
  id: string;
  name: string;
  flatNo: string;
  role: UserRole;
  email: string;
  phone: string;
  accountNumber?: string;
  ifscCode?: string;
}

// Revenue - Maintenance
export interface MaintenanceTransaction {
  transaction_id: string;
  amount: number;
  flat_no: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  breakdown?: {
    waterCharges: number;
    infrastructure: number;
    electricity: number;
    commonExpenses: number;
    penalty: number;
  };
  penalty?: number;
}

// Revenue - Vendor Payment (from stalls)
export interface VendorRevenueTransaction {
  transaction_id: string;
  amount: number;
  vendor_name: string;
  date: string;
  status: 'paid' | 'pending';
  stallNumber?: string;
}

// Revenue - Other Income (Cultural, Marketing, etc.)
export interface OtherRevenueTransaction {
  id: string;
  source: 'Cultural' | 'Marketing' | 'Facility' | 'Other';
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  payer_name: string;
}

// Expenses - Member Expenses
export interface MemberExpense {
  expense_id: string;
  member_id: string;
  member_name: string;
  flat_no: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  receipt_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'settled';
  approval_date?: string;
  settlement_date?: string;
}

// Expenses - Vendor Bills
export interface VendorBill {
  bill_id: string;
  vendor_name: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  bill_url?: string;
  status: 'pending' | 'approved' | 'settled';
  account_number?: string;
  ifsc_code?: string;
}

// Settlement
export interface Settlement {
  settlement_id: string;
  month: string;
  beneficiary_name: string;
  beneficiary_type: 'member' | 'vendor';
  account_number: string;
  ifsc_code: string;
  amount: number;
  status: 'pending' | 'generated' | 'uploaded' | 'processed';
  generated_date?: string;
  processed_date?: string;
  reference_ids: string[]; // expense_ids or bill_ids
}

// Settlement Batch
export interface SettlementBatch {
  batch_id: string;
  month: string;
  total_amount: number;
  settlements: Settlement[];
  status: 'draft' | 'generated' | 'uploaded' | 'processed';
  created_date: string;
  generated_by: string;
}

// Statistics
export interface MonthlyStats {
  month: string;
  totalCollection: number;
  totalExpenses: number;
  pendingPayments: number;
  overdueCount: number;
  netBalance: number;
}
