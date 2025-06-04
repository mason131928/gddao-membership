/**
 * 系統常數定義
 */

// 錯誤訊息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "網路錯誤，請稍後再試",
  MISSING_REQUIRED_FIELDS: "請填寫完整資訊",
  INVALID_PHONE: "請輸入有效的手機號碼格式",
  INVALID_EMAIL: "請輸入有效的電子信箱格式",
  PHONE_EXISTS: "此手機號碼已註冊",
  EMAIL_EXISTS: "此電子信箱已註冊",
  APPLICATION_NOT_FOUND: "找不到申請記錄",
  PAYMENT_FAILED: "付款失敗，請重試",
  ORGANIZATION_NOT_FOUND: "找不到團體資訊",
  UNAUTHORIZED: "未授權訪問",
  NAME_TOO_SHORT: "姓名至少需要 2 個字元",
  NAME_TOO_LONG: "姓名不能超過 20 個字元",
} as const;

// 成功訊息
export const SUCCESS_MESSAGES = {
  APPLICATION_SUBMITTED: "申請已提交，即將跳轉至付款頁面",
  PAYMENT_SUCCESS: "付款成功！",
  DATA_SAVED: "資料已儲存",
  STATUS_UPDATED: "狀態已更新",
} as const;

// 驗證規則
export const VALIDATION_RULES = {
  PHONE_PATTERN: /^09\d{8}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 20,
  ADDRESS_MAX_LENGTH: 100,
  EMERGENCY_CONTACT_MAX_LENGTH: 20,
} as const;

// UI 配置
export const UI_CONFIG = {
  NOTIFICATION_DURATION: 3000,
  MODAL_ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// 應用狀態訊息
export const APPLICATION_MESSAGES = {
  APPLICATION_PENDING: "申請待處理",
  APPLICATION_PAID: "申請已付費",
  PAYMENT_PENDING: "付款處理中",
  PAYMENT_SUCCESS: "付款成功",
  PAYMENT_FAILED: "付款失敗",
} as const;

// API 端點
export const API_ENDPOINTS = {
  ORGANIZATIONS: "/membership/organizations",
  APPLY: "/membership/apply",
  PAYMENT_CREATE: "/membership/payment/create",
  PAYMENT_STATUS: "/membership/payment/status",
  ADMIN_LOGIN: "/membership/admin/login",
  ADMIN_APPLICATIONS: "/membership/admin/applications",
  ADMIN_EXPORT: "/membership/admin/export",
} as const;

// 申請狀態
export const APPLICATION_STATUS = {
  PENDING: "pending",
  PAID: "paid",
} as const;

// 狀態顯示文字映射
export const STATUS_LABELS = {
  [APPLICATION_STATUS.PENDING]: "待付款",
  [APPLICATION_STATUS.PAID]: "已付費",
} as const;

// 付款狀態
export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: "待付款",
  [PAYMENT_STATUS.SUCCESS]: "付款成功",
  [PAYMENT_STATUS.FAILED]: "付款失敗",
  [PAYMENT_STATUS.CANCELLED]: "已取消",
} as const;

// 路由路徑
export const ROUTES = {
  HOME: "/",
  ADMIN: "/admin",
  PAYMENT_SUCCESS: "/payment/success",
  PAYMENT_FAILED: "/payment/failed",
} as const;

// 預設值
export const DEFAULTS = {
  MEMBERSHIP_FEE: 300, // 預設會費金額
  PAGE_SIZE: 20,
  ORGANIZATION_BANNER_HEIGHT: 200,
  ORGANIZATION_LOGO_SIZE: 80,
} as const;

// 為了向後相容，添加別名
export const APPLICATION_STATUS_TEXT = STATUS_LABELS;
export const PAYMENT_STATUS_TEXT = PAYMENT_STATUS_LABELS;
