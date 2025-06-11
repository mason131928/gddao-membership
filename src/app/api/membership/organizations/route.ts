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

    // 構建 origin - 從 referer 或 host 獲取
    const referer = request.headers.get("referer");
    const host = request.headers.get("host");
    let origin = "";
    
    if (referer) {
      // 從 referer 提取 origin
      const refererUrl = new URL(referer);
      origin = `${refererUrl.protocol}//${refererUrl.host}`;
    } else if (host) {
      // 從 host 構建 origin
      const protocol = request.headers.get("x-forwarded-proto") || "http";
      origin = `${protocol}://${host}`;
    }
    
    // 如果還是沒有 origin，根據環境設置默認值
    if (!origin) {
      // 檢查是否在生產環境（gddao.com）
      if (request.url.includes('gddao.com')) {
        origin = "https://gddao.com";
      } else {
        // 開發環境：從當前請求 URL 推斷
        const requestUrl = new URL(request.url);
        origin = `${requestUrl.protocol}//${requestUrl.host}`;
      }
    }
    
    console.log("🌍 計算的 Origin:", origin);

    // 轉發請求到後端API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Language": "cht",
        "Origin": origin, // 動態計算的 origin
        // 轉發認證信息
        ...(request.headers.get("User-Token") && {
          "User-Token": request.headers.get("User-Token") as string,
        }),
        ...(request.headers.get("Cookie") && {
          "Cookie": request.headers.get("Cookie") as string,
        }),
      },
    });

    console.log("📡 後端響應狀態:", response.status);
    console.log(
      "📄 後端響應頭:",
      Object.fromEntries(response.headers.entries())
    );

    // 檢查響應內容類型
    const contentType = response.headers.get("content-type");
    
    // 如果是 JSON 響應，正常處理
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("📋 後端響應數據:", data);
      
      return NextResponse.json(data, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Language",
        },
      });
    }

    // 如果不是 JSON，讀取文本內容查看錯誤
    const text = await response.text();
    console.error("❌ 後端返回非JSON響應:", text.substring(0, 500));
    
    // 嘗試解析 PHP 錯誤（如果是 PHP 錯誤格式）
    try {
      const errorData = JSON.parse(text);
      return NextResponse.json(
        { 
          error: "後端錯誤", 
          details: errorData.message || "未知錯誤",
          traces: errorData.traces || []
        },
        { status: 500 }
      );
    } catch {
      // 如果不是 JSON，返回通用錯誤
      return NextResponse.json(
        { 
          error: "服務器錯誤", 
          details: "後端返回了非預期的響應格式" 
        },
        { status: 500 }
      );
    }
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
      "Access-Control-Allow-Headers": "Content-Type, Language, User-Token",
    },
  });
}