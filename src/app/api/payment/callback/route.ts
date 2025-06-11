/**
 * 藍新金流付款回調處理
 * 接收藍新金流的POST回調並轉發到後端API
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🔔 收到藍新金流回調");

  try {
    // 獲取藍新金流回調的表單資料
    const formData = await request.formData();

    // 轉換為標準物件
    const callbackData: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      callbackData[key] = value.toString();
    }

    console.log("📋 藍新金流回調資料：", callbackData);

    // 使用正確的後端API地址
    const backendUrl = "https://api.gddao.com";
    const notifyUrl = `${backendUrl}/web/pay/notify_membership`;

    console.log("🌐 轉發到後端URL:", notifyUrl);

    // 創建超時控制器
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      // 轉發到後端API進行處理
      const response = await fetch(notifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Language: "cht",
        },
        body: new URLSearchParams(callbackData).toString(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // 清除超時計時器

      console.log("📡 後端響應狀態:", response.status);
      const responseText = await response.text();
      console.log("📄 後端響應內容:", responseText);

      // 從商戶訂單號中提取申請ID
      // 商戶訂單號格式：MEMBERSHIP_YYYYMMDD_HHMMSS_申請ID
      const merchantOrderNo = callbackData.MerchantOrderNo || "";
      const applicationId = merchantOrderNo.split("_").pop() || "";

      // 準備狀態檢查頁面URL
      const statusUrl = new URL("/membership/payment/status", request.url);

      if (applicationId) {
        statusUrl.searchParams.set("application_id", applicationId);
      }

      if (response.ok) {
        console.log("✅ 回調處理成功，重定向到狀態檢查頁面");
        return NextResponse.redirect(statusUrl);
      } else {
        console.error("❌ 後端處理失敗:", response.status, responseText);
        // 即使後端處理失敗，也重定向到狀態檢查頁面讓用戶查看實際狀態
        return NextResponse.redirect(statusUrl);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("⚠️ 後端API調用失敗:", fetchError);

      // API調用失敗，仍重定向到狀態檢查頁面
      const merchantOrderNo = callbackData.MerchantOrderNo || "";
      const applicationId = merchantOrderNo.split("_").pop() || "";

      const statusUrl = new URL("/membership/payment/status", request.url);
      if (applicationId) {
        statusUrl.searchParams.set("application_id", applicationId);
      }

      return NextResponse.redirect(statusUrl);
    }
  } catch (error) {
    console.error("💥 付款回調處理錯誤：", error);

    // 錯誤處理，重定向到狀態檢查頁面
    const statusUrl = new URL("/membership/payment/status", request.url);
    statusUrl.searchParams.set("error", "callback_error");
    return NextResponse.redirect(statusUrl);
  }
}

// 處理GET請求（測試用）
export async function GET(request: NextRequest) {
  console.log("🔍 收到付款回調GET請求（測試）");
  return NextResponse.json({
    message: "付款回調端點正常",
    url: request.url,
    timestamp: new Date().toISOString(),
  });
}
