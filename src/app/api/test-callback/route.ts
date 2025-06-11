/**
 * 測試用：手動更新付款狀態
 * 用於診斷和修復付款回調問題
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, paymentId, forceUpdate } = body;

    if (!applicationId || !paymentId) {
      return NextResponse.json(
        {
          success: false,
          message: "缺少必要參數 applicationId 或 paymentId",
        },
        { status: 400 }
      );
    }

    // 調用後端API手動更新狀態
    const backendUrl = "https://api.gddao.com";
    const updateUrl = `${backendUrl}/api/membership/admin/manual-update-payment`;

    const response = await fetch(updateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Language: "cht",
      },
      body: JSON.stringify({
        application_id: applicationId,
        payment_id: paymentId,
        force_update: forceUpdate || false,
      }),
    });

    const result = await response.json();

    return NextResponse.json({
      success: response.ok,
      data: result,
      message: response.ok ? "付款狀態更新成功" : "更新失敗",
    });
  } catch (error) {
    console.error("測試回調錯誤:", error);
    return NextResponse.json(
      {
        success: false,
        message: "系統錯誤",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("🔍 開始診斷後端 API 連接");

  try {
    const url = "https://api.gddao.com/api/membership/organizations";
    console.log("🌐 測試URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Language: "cht",
      },
    });

    console.log("📡 響應狀態:", response.status);
    console.log("📄 響應頭:", Object.fromEntries(response.headers.entries()));

    // 獲取原始響應文本
    const responseText = await response.text();
    console.log("📋 原始響應內容:", responseText);

    // 嘗試解析為 JSON
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
      console.log("✅ JSON 解析成功:", parsedData);
    } catch (jsonError) {
      console.log("❌ JSON 解析失敗:", jsonError);
      console.log("📝 響應內容前100字符:", responseText.substring(0, 100));

      return NextResponse.json(
        {
          error: "後端返回非JSON格式",
          status: response.status,
          responseText: responseText.substring(0, 500), // 只返回前500字符避免過長
          headers: Object.fromEntries(response.headers.entries()),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: response.status,
      data: parsedData,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error) {
    console.error("❌ 網絡請求失敗:", error);
    return NextResponse.json(
      {
        error: "網絡請求失敗",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
