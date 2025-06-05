/**
 * 會員繳費系統API - 使用本地代理解決CORS問題
 */

// 正確的API基礎URL，考慮到basePath
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "/membership/api" : "/api";

// 除錯模式顯示配置資訊
if (process.env.NEXT_PUBLIC_DEBUG === "true") {
  console.log(
    `🌐 API Base URL: ${API_BASE_URL} (環境: ${process.env.NODE_ENV})`
  );
  console.log(`🔧 Debug Mode: ${process.env.NEXT_PUBLIC_DEBUG}`);
}

/**
 * 申請資料介面
 */
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
 * 申請結果資料介面（從API返回的資料）
 */
interface ApplicationResult {
  id: number;
  name: string;
  phone: string;
  email: string;
  address?: string;
  birth_date?: string;
  id_number?: string;
  gender?: string;
  education?: string;
  school_name?: string;
  department?: string;
  work_unit?: string;
  job_title?: string;
  line_id?: string;
  plan_name?: string;
  amount?: number;
  status: string;
  applied_at?: string;
  paid_at?: string;
  next_payment_date?: string;
  next_payment_amount?: number;
}

/**
 * 組織資料介面
 */
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
  console.log("🔧 環境:", process.env.NODE_ENV);
  console.log(
    "📍 當前location:",
    typeof window !== "undefined" ? window.location.href : "服務器端"
  );
  console.log("📝 請求選項:", options);

  // 設置超時控制器
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超時

  try {
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        Language: "cht",
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    console.log("📡 響應狀態:", response.status);
    console.log("📄 響應URL:", response.url);
    console.log("📋 響應頭:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 響應錯誤:", errorText);

      // 檢查是否是504錯誤
      if (response.status === 504) {
        throw new Error("🕐 服務器響應超時，請稍後再試");
      }

      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    console.log("📄 原始響應:", responseText.substring(0, 200) + "...");

    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error("❌ JSON解析錯誤:", error);
      console.error("📄 完整響應內容:", responseText);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`無法解析JSON響應: ${errorMessage}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("🕐 請求超時");
        throw new Error("請求超時，請檢查網絡連接");
      }

      console.error("🌐 網絡請求錯誤:", error.message);
      throw error;
    }

    throw new Error("未知錯誤");
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
    // 暫時使用前端CSV匯出，直到PHP後端Excel功能部署完成
    console.log("⚠️ 使用前端CSV匯出功能（PHP後端Excel功能待部署）");

    // 獲取所有申請資料
    let allApplications: ApplicationResult[] = [];
    let page = 1;
    const limit = 100;

    while (true) {
      const response = await getApplications(organizationId, page, limit);
      if (response.code === 200 && response.data.length > 0) {
        allApplications = allApplications.concat(response.data);

        // 檢查是否還有更多資料
        if (response.data.length < limit) {
          break;
        }
        page++;
      } else {
        break;
      }
    }

    // 狀態篩選
    if (status) {
      allApplications = allApplications.filter((app) => app.status === status);
    }

    // 生成CSV內容
    const csvContent = generateCSV(allApplications);

    // 觸發下載
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `會員申請表_${new Date().getFullYear()}${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("匯出失敗:", error);
    throw error;
  }
}

/**
 * 生成CSV格式內容
 */
function generateCSV(applications: ApplicationResult[]): string {
  // CSV表頭
  const headers = [
    "申請編號",
    "姓名",
    "手機",
    "Email",
    "地址",
    "生日",
    "身分證字號",
    "性別",
    "學歷",
    "學校名稱",
    "科系",
    "工作單位",
    "職稱",
    "Line ID",
    "會費方案",
    "會費金額",
    "申請狀態",
    "申請時間",
    "付款時間",
    "下次繳費日期",
    "下次繳費金額",
  ];

  // 轉換資料
  const rows = applications.map((app) => {
    // 性別轉換
    const genderMap: { [key: string]: string } = {
      male: "男",
      female: "女",
      other: "其他",
    };

    // 學歷轉換
    const educationMap: { [key: string]: string } = {
      elementary: "國小",
      junior: "國中",
      senior: "高中",
      college: "二專/五專",
      university: "大學/二技",
      master: "碩士",
      doctor: "博士",
      other: "其他",
    };

    // 狀態轉換
    const statusMap: { [key: string]: string } = {
      pending: "待付款",
      paid: "已付款",
      approved: "已審核",
      rejected: "已拒絕",
    };

    return [
      app.id || "",
      app.name || "",
      app.phone || "",
      app.email || "",
      app.address || "",
      app.birth_date || "",
      app.id_number || "",
      genderMap[app.gender || ""] || app.gender || "",
      educationMap[app.education || ""] || app.education || "",
      app.school_name || "",
      app.department || "",
      app.work_unit || "",
      app.job_title || "",
      app.line_id || "",
      app.plan_name || "",
      app.amount ? `$${Number(app.amount).toFixed(0)}` : "",
      statusMap[app.status || ""] || app.status || "",
      app.applied_at ? formatDateTime(app.applied_at) : "",
      app.paid_at ? formatDateTime(app.paid_at) : "",
      app.next_payment_date ? formatDate(app.next_payment_date) : "未設定",
      app.next_payment_amount
        ? `$${Number(app.next_payment_amount).toFixed(0)}`
        : "未設定",
    ];
  });

  // 組合成CSV
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  // 加上BOM以支援Excel中文顯示
  return "\uFEFF" + csvContent;
}

/**
 * 格式化日期時間
 */
function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * 格式化日期
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW");
  } catch {
    return dateString;
  }
}

/**
 * 創建付款訂單
 * @deprecated 現在付款直接在申請時處理，不需要單獨調用
 */
// export async function createPayment(data: {
//   applicationId: number;
//   amount: number;
//   organizationId: number;
// }) {
//   try {
//     const response = await request("/membership/payment/create", {
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//     console.log("付款創建回應:", response);
//     return response.code === 200 ? response.data : response;
//   } catch (error) {
//     console.error("創建付款失敗:", error);
//     throw error;
//   }
// }

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
