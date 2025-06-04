/**
 * 應用程式配置文件 - 簡化版
 */

// 直接從環境變數讀取，提供預設值
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.gddao.com",
  },
  app: {
    basePath: "/membership",
    title: "會員繳費系統",
    description: "GDDAO 會員繳費系統",
  },
};

// 開發環境下顯示當前配置
if (process.env.NODE_ENV === "development") {
  console.log(`🌐 API Base URL: ${config.api.baseUrl}`);
}
