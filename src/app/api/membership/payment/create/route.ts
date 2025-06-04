/**
 * 付款創建API代理路由
 * 解決CORS跨域問題
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 轉發請求到後端API
    const response = await fetch(
      "https://api.gddao.com/api/membership/payment/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Language: "cht",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

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
    console.error("API代理錯誤:", error);
    return NextResponse.json({ error: "服務器錯誤" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Language",
    },
  });
}
