/**
 * API 相關類型定義
 */

// 創建付款請求
export interface CreatePaymentRequest {
  applicationId: number;
  amount: number;
  organizationId: number; // 添加組織ID用於選擇對應的藍新金流設定
  returnUrl?: string;
  notifyUrl?: string;
}

// 創建付款響應
export interface CreatePaymentResponse {
  paymentUrl: string;
  orderNo: string;
  amount: number;
  merchantId?: string; // 商店代號
  formData?: Record<string, string>; // 藍新金流表單數據
}

// API 通用響應格式
export interface ApiResponse<T = unknown> {
  code: number;
  msg?: string;
  data?: T;
  success?: boolean;
}

// 錯誤響應
export interface ApiError {
  code: number;
  msg: string;
  errors?: Record<string, string[]>;
}
