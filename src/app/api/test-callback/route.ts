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
  return NextResponse.json({
    message: "付款狀態測試端點",
    usage: {
      method: "POST",
      body: {
        applicationId: "申請ID",
        paymentId: "付款ID",
        forceUpdate: "是否強制更新(可選)",
      },
    },
  });
}
