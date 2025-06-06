/**
 * 會員管理系統常數定義
 * 包含狀態、標籤、驗證規則等常數
 */

// 申請狀態
export enum APPLICATION_STATUS {
  PENDING = "pending",
  PAID = "paid",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// 付款狀態
export enum PAYMENT_STATUS {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

// 狀態標籤
export const STATUS_LABELS = {
  [APPLICATION_STATUS.PENDING]: "待付款",
  [APPLICATION_STATUS.PAID]: "已付款",
  [APPLICATION_STATUS.APPROVED]: "已核准",
  [APPLICATION_STATUS.REJECTED]: "已拒絕",
} as const;

// 付款狀態標籤
export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: "處理中",
  [PAYMENT_STATUS.SUCCESS]: "付款成功",
  [PAYMENT_STATUS.FAILED]: "付款失敗",
  [PAYMENT_STATUS.CANCELLED]: "已取消",
} as const;

// 表單驗證規則
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_PATTERN: /^09\d{8}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ADDRESS_MAX_LENGTH: 200,
} as const;

// UI 配置
export const UI_CONFIG = {
  TABLE_PAGE_SIZE: 10,
  NOTIFICATION_DURATION: 3000,
  REDIRECT_DELAY: 2000,
} as const;

// 錯誤訊息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "網路錯誤，請稍後再試",
  INVALID_FORM: "請檢查表單內容",
  PHONE_INVALID: "請輸入有效的手機號碼",
  EMAIL_INVALID: "請輸入有效的電子郵件",
  NAME_REQUIRED: "姓名為必填項目",
  PLAN_REQUIRED: "請選擇會費方案",
} as const;

// 成功訊息
export const SUCCESS_MESSAGES = {
  APPLICATION_SUBMITTED: "申請已提交",
  PAYMENT_SUCCESS: "付款成功",
  STATUS_UPDATED: "狀態已更新",
} as const;

// API 端點
export const API_ENDPOINTS = {
  ORGANIZATIONS: "/api/membership/organizations",
  PLANS: "/api/membership/plans",
  APPLY: "/api/membership/apply",
  APPLICATIONS: "/api/membership/admin/applications",
  PAYMENT_CREATE: "/api/membership/payment/create",
  EXPORT: "/api/membership/admin/export",
} as const;
