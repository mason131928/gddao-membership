/**
 * 藍新金流付款回調處理
 * 接收藍新金流的POST回調並轉發到後端API
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 獲取藍新金流回調的表單資料
    const formData = await request.formData();

    // 轉換為標準物件
    const callbackData: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      callbackData[key] = value.toString();
    }

    console.log("藍新金流回調資料：", callbackData);

    // 轉發到後端API進行處理
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const response = await fetch(`${backendUrl}/web/pay/notify_membership`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(callbackData).toString(),
    });

    if (response.ok) {
      // 回調處理成功，重定向到付款成功頁面
      const redirectUrl = new URL("/payment/success", request.url);

      // 將藍新金流的回調參數傳遞到付款成功頁面
      if (callbackData.Status === "SUCCESS") {
        redirectUrl.searchParams.set("Status", callbackData.Status);
        redirectUrl.searchParams.set(
          "MerchantOrderNo",
          callbackData.MerchantOrderNo || ""
        );
        redirectUrl.searchParams.set("TradeNo", callbackData.TradeNo || "");
        redirectUrl.searchParams.set("Amt", callbackData.Amt || "");
        redirectUrl.searchParams.set(
          "PaymentType",
          callbackData.PaymentType || ""
        );
        redirectUrl.searchParams.set("PayTime", callbackData.PayTime || "");
      }

      return NextResponse.redirect(redirectUrl);
    } else {
      // 後端處理失敗
      const errorUrl = new URL("/payment/success", request.url);
      errorUrl.searchParams.set("Status", "FAILED");
      errorUrl.searchParams.set("Message", "付款處理失敗");
      return NextResponse.redirect(errorUrl);
    }
  } catch (error) {
    console.error("付款回調處理錯誤：", error);

    // 錯誤處理，重定向到失敗頁面
    const errorUrl = new URL("/payment/success", request.url);
    errorUrl.searchParams.set("Status", "ERROR");
    errorUrl.searchParams.set("Message", "系統錯誤");
    return NextResponse.redirect(errorUrl);
  }
}
