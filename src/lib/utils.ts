import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { VALIDATION_RULES } from "./constants";

/**
 * 合併 CSS 類名的工具函數
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化金額顯示
 */
export function formatCurrency(amount: number | string): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * 格式化日期顯示
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * 驗證台灣手機號碼格式
 */
export function validatePhone(phone: string): boolean {
  return VALIDATION_RULES.PHONE_PATTERN.test(phone);
}

/**
 * 驗證 Email 格式
 */
export function validateEmail(email: string): boolean {
  return VALIDATION_RULES.EMAIL_PATTERN.test(email);
}

/**
 * 生成隨機字串
 */
export function generateRandomString(length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 延遲函數
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 安全的 JSON 解析
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * 截斷文字
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * 檢查是否為有效的 URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
