/**
 * 管理後台登入API代理路由
 * 解決CORS跨域問題
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🚀 管理後台登入API代理被調用:", request.url);
  console.log("🔍 請求來源:", request.headers.get("referer"));

  try {
    const body = await request.json();
    console.log("📊 登入請求數據:", body);

    // 轉發請求到後端API
    const backendUrl = "https://api.gddao.com/api/membership/admin/login";
    console.log("🌐 轉發到後端URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Language: "cht",
      },
      body: JSON.stringify(body),
    });

    console.log("📡 後端響應狀態:", response.status);
    console.log(
      "📄 後端響應頭:",
      Object.fromEntries(response.headers.entries())
    );

    const data = await response.json();
    console.log("📋 後端響應數據:", data);

    // 返回響應
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Language",
      },
    });
  } catch (error) {
    console.error("❌ 管理後台登入API代理錯誤:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "服務器錯誤", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  console.log("🔧 處理管理後台登入OPTIONS預檢請求");
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Language",
    },
  });
}
