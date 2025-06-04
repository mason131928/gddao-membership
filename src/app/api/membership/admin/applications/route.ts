/**
 * 管理後台申請列表API代理路由
 * 解決CORS跨域問題
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("🚀 管理後台申請列表API代理被調用:", request.url);

  try {
    // 獲取查詢參數
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organization_id");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    if (!organizationId) {
      return NextResponse.json({ error: "缺少團體ID" }, { status: 400 });
    }

    // 構建後端URL
    const backendUrl = `https://api.gddao.com/api/membership/admin/applications?organization_id=${organizationId}&page=${page}&limit=${limit}`;
    console.log("🌐 轉發到後端URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Language: "cht",
      },
    });

    console.log("📡 後端響應狀態:", response.status);

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
    console.error("❌ 管理後台申請列表API代理錯誤:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "服務器錯誤", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  console.log("🔧 處理管理後台申請列表OPTIONS預檢請求");
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Language",
    },
  });
}
