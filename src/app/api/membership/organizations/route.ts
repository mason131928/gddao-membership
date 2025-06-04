/**
 * 團體列表API代理路由
 * 解決CORS跨域問題
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organization_id");

    let url = "https://api.gddao.com/api/membership/organizations";
    if (organizationId) {
      url += `?organization_id=${organizationId}`;
    }

    // 轉發請求到後端API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Language: "cht",
      },
    });

    const data = await response.json();

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
    console.error("API代理錯誤:", error);
    return NextResponse.json({ error: "服務器錯誤" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Language",
    },
  });
}
