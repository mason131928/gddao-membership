/**
 * 會員繳費系統API - 完全依賴環境變數
 */

// 從環境變數讀取 API 基礎網址，必須設定
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 檢查必要的環境變數
if (!API_BASE_URL) {
  throw new Error(
    "缺少必要的環境變數：NEXT_PUBLIC_API_BASE_URL\n" +
      "請確認已設定正確的 .env.local 或對應環境的 .env 文件"
  );
}

// 除錯模式顯示配置資訊
if (process.env.NEXT_PUBLIC_DEBUG === "true") {
  console.log(`🌐 API Base URL: ${API_BASE_URL}`);
  console.log(`🔧 Debug Mode: ${process.env.NEXT_PUBLIC_DEBUG}`);
}

// 定義介面類型
interface ApplicationData {
  organization_id: number;
  planId?: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  // 支援更多申請書欄位
  birthDate?: string;
  idNumber?: string;
  gender?: string;
  genderOther?: string;
  education?: string;
  educationOther?: string;
  schoolName?: string;
  department?: string;
  workUnit?: string;
  jobTitle?: string;
  lineId?: string;
}

/**
 * 通用請求函數
 */
async function request(url: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Language: "cht",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * 修復圖片URL為正確的域名和HTTPS協議
 */
function fixImageUrl(url: string): string {
  if (!url) return url;

  // 如果是HTTP協議的api.gddao.com，轉換為HTTPS的gddao.com
  if (url.startsWith("http://api.gddao.com/")) {
    return url.replace("http://api.gddao.com/", "https://gddao.com/");
  }

  // 如果是HTTPS協議的api.gddao.com，轉換為gddao.com
  if (url.startsWith("https://api.gddao.com/")) {
    return url.replace("https://api.gddao.com/", "https://gddao.com/");
  }

  return url;
}

/**
 * 獲取開啟會員繳費的團體列表
 */
export async function getOrganizations(organizationId?: number) {
  try {
    const url = organizationId
      ? `/api/membership/organizations?organization_id=${organizationId}`
      : "/api/membership/organizations";

    const response = await request(url);
    console.log("API 回應:", response);

    // 修復圖片URL協議問題
    if (response.code === 200 && response.data) {
      response.data = response.data.map((org: any) => ({
        ...org,
        logo_url: fixImageUrl(org.logo_url),
        cover_image_url: fixImageUrl(org.cover_image_url),
      }));
    }

    return response.code === 200 ? response.data : [];
  } catch (error) {
    console.error("獲取團體列表失敗:", error);
    throw error;
  }
}

/**
 * 提交會員申請
 */
export async function createApplication(data: ApplicationData) {
  try {
    const response = await request("/api/membership/apply", {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log("申請提交回應:", response);
    return response.code === 200 ? response.data : response;
  } catch (error) {
    console.error("申請提交失敗:", error);
    throw error;
  }
}

/**
 * 管理後台登入
 */
export async function adminLogin(data: {
  business_number: string;
  username: string;
  password: string;
}) {
  try {
    const response = await request("/api/membership/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("管理員登入失敗:", error);
    throw error;
  }
}

/**
 * 獲取申請列表（管理後台用）
 */
export async function getApplications(
  organizationId: number,
  page = 1,
  limit = 20
) {
  try {
    const response = await request(
      `/api/membership/admin/applications?organization_id=${organizationId}&page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("獲取申請列表失敗:", error);
    throw error;
  }
}

/**
 * 匯出申請資料為Excel
 */
export async function exportApplications(
  organizationId: number,
  status?: string
) {
  try {
    const statusParam = status ? `&status=${status}` : "";
    const url = `${API_BASE_URL}/api/membership/admin/export/applications?organization_id=${organizationId}${statusParam}`;

    // 直接開啟下載連結
    window.open(url, "_blank");
  } catch (error) {
    console.error("匯出Excel失敗:", error);
    throw error;
  }
}

/**
 * 創建付款訂單
 */
export async function createPayment(data: {
  applicationId: number;
  amount: number;
  organizationId: number;
}) {
  try {
    const response = await request("/api/membership/payment/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log("付款創建回應:", response);
    return response.code === 200 ? response.data : response;
  } catch (error) {
    console.error("創建付款失敗:", error);
    throw error;
  }
}

/**
 * 更新申請狀態（管理後台用）
 */
export async function updateApplicationStatus(
  applicationId: number,
  status: string
) {
  try {
    const response = await request(
      `/api/membership/admin/applications/${applicationId}/status`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
    return response;
  } catch (error) {
    console.error("更新申請狀態失敗:", error);
    throw error;
  }
}
