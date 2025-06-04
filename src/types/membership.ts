/**
 * 會費管理系統類型定義
 */

// 會費方案
export interface MembershipPlan {
  id: number;
  organization_id: number;
  name: string;
  amount: string; // 後端返回字串格式的金額
  description?: string;
  status: 1 | 0; // 1:啟用 0:停用
  created_at: string;
  updated_at: string;
}

// 團體資訊
export interface Organization {
  id: number;
  name: string;
  introduction: string; // API 中的字段名
  cover_image?: string; // API 中的字段名
  logo?: string;
  plan_count?: number; // API 中的字段
  plans?: MembershipPlan[]; // 關聯的會費方案
  // 為了向後兼容，添加計算屬性
  description?: string; // 別名，指向 introduction
  banner?: string; // 別名，指向 cover_image
  membershipFee?: number; // 從第一個方案中獲取
  status?: 1 | 0; // 可選
  createdAt?: string;
  updatedAt?: string;
}

// 入會申請表單資料（簡化版本，匹配前端表單）
export interface ApplicationFormData {
  organizationId: number;
  planId: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  birthDate?: string;
  idNumber?: string;
  gender?: "male" | "female";
  education?: string;
  schoolName?: string;
  department?: string;
  workUnit?: string;
  jobTitle?: string;
  lineId?: string;
}

// 完整的申請資料（包含後端需要的所有欄位）
export interface CompleteApplicationData {
  name: string;
  birthDate?: string; // 出生年月日
  idNumber?: string; // 身分證或居留證統一編號
  gender?: "male" | "female" | "other";
  genderOther?: string; // 其他性別說明
  education?: string;
  educationOther?: string; // 其他學歷說明
  schoolName?: string; // 學校名稱
  department?: string; // 科系（所）
  workUnit?: string; // 服務單位
  jobTitle?: string; // 職稱
  address?: string; // 聯絡地址
  phone: string; // 行動電話
  email: string; // 電子信箱
  lineId?: string; // LINE ID
}

// 入會申請記錄
export interface Application {
  id: number;
  organizationId: number;
  planId: number;
  name: string;
  birthDate?: string;
  idNumber?: string;
  gender?: string;
  education?: string;
  schoolName?: string;
  department?: string;
  workUnit?: string;
  jobTitle?: string;
  address?: string;
  phone: string;
  email: string;
  lineId?: string;
  userId?: number;
  status: "pending" | "paid";
  appliedAt: string;
  paidAt?: string;
  amount?: string;
  planName?: string;
}

// 付款記錄
export interface PaymentRecord {
  id: number;
  applicationId: number;
  organizationId: number;
  amount: number;
  status: "pending" | "success" | "failed" | "cancelled";
  paymentMethod?: string;
  orderNo?: string;
  transactionId?: string;
  newebpayOrderNo?: string;
  paidAt?: string;
  createdAt: string;
  application?: Application;
}

// API 響應類型
export interface ApiResponse<T = unknown> {
  code: number;
  msg?: string;
  data?: T;
}

// 分頁資料
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 統計資料
export interface MembershipStats {
  totalApplications: number;
  pendingApplications: number;
  paidApplications: number;
  totalRevenue: number;
  thisMonthApplications: number;
  thisMonthRevenue: number;
}

// 創建申請請求
export interface CreateApplicationRequest {
  organizationId: number;
  planId: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  birthDate?: string;
  idNumber?: string;
  gender?: "male" | "female" | "other";
  genderOther?: string;
  education?:
    | "elementary"
    | "junior"
    | "senior"
    | "college"
    | "university"
    | "master"
    | "doctor"
    | "other";
  educationOther?: string;
  schoolName?: string;
  department?: string;
  workUnit?: string;
  jobTitle?: string;
  lineId?: string;
}

// 創建付款請求
export interface CreatePaymentRequest {
  applicationId: number;
  organizationId: number;
  amount: number;
  returnUrl?: string;
  notifyUrl?: string;
}

// 創建付款響應
export interface CreatePaymentResponse {
  paymentUrl: string;
  orderNo: string;
  amount: number;
}

// 付款回調資料
export interface PaymentCallbackData {
  status: string;
  transactionId: string;
  amount: number;
  orderNo: string;
}
