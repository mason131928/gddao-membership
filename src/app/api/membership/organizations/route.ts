/**
 * 團體列表API代理路由
 * 解決CORS跨域問題
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("🚀 API代理被調用:", request.url);
  console.log("🔍 請求來源:", request.headers.get("referer"));
  console.log("📝 請求頭:", Object.fromEntries(request.headers.entries()));

  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organization_id");
    console.log("📊 查詢參數:", { organizationId });

    let url = "https://api.gddao.com/api/membership/organizations";
    if (organizationId) {
      url += `?organization_id=${organizationId}`;
    }
    console.log("🌐 轉發到後端URL:", url);

    // 轉發請求到後端API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Language: "cht",
      },
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
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Language",
      },
    });
  } catch (error) {
    console.error("❌ API代理錯誤:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "服務器錯誤", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  console.log("🔧 處理OPTIONS預檢請求");
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Language",
    },
  });
}
