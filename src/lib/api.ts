/**
 * 會員繳費系統API - 使用本地代理解決CORS問題
 */

// 正確的API基礎URL，考慮basePath
const API_BASE_URL = "/membership/api";

// 除錯模式顯示配置資訊
if (process.env.NEXT_PUBLIC_DEBUG === "true") {
  console.log(`🌐 API Base URL: ${API_BASE_URL} (使用本地代理解決CORS問題)`);
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

// 定義團體資料介面
interface OrganizationData {
  organization_id: number;
  plan_id: number;
  name: string;
  org_name: string;
  membership_fee: string;
  description: string;
  logo: string;
  cover_image: string;
  business_number: string;
  logo_url: string;
  cover_image_url: string;
}

/**
 * 通用請求函數
 */
async function request(url: string, options: RequestInit = {}) {
  const fullUrl = `${API_BASE_URL}${url}`;
  console.log("🌐 前端發送請求:", fullUrl);
  console.log("📝 請求選項:", options);

  const response = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      Language: "cht",
      ...options.headers,
    },
    ...options,
  });

  console.log("📡 響應狀態:", response.status);
  console.log("📄 響應URL:", response.url);
  console.log("📋 響應頭:", Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ 響應錯誤:", errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const responseText = await response.text();
  console.log("📄 原始響應:", responseText.substring(0, 200) + "...");

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("❌ JSON解析錯誤:", error);
    console.error("📄 完整響應內容:", responseText);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`無法解析JSON響應: ${errorMessage}`);
  }
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
      ? `/membership/organizations?organization_id=${organizationId}`
      : "/membership/organizations";

    const response = await request(url);
    console.log("API 回應:", response);

    // 修復圖片URL協議問題
    if (response.code === 200 && response.data) {
      response.data = response.data.map((org: OrganizationData) => ({
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
    const response = await request("/membership/apply", {
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
    const response = await request("/membership/admin/login", {
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
      `/membership/admin/applications?organization_id=${organizationId}&page=${page}&limit=${limit}`
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
    const url = `${API_BASE_URL}/membership/admin/export/applications?organization_id=${organizationId}${statusParam}`;

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
    const response = await request("/membership/payment/create", {
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
      `/membership/admin/applications/${applicationId}/status`,
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
