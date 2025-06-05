import { NextRequest, NextResponse } from "next/server";

/**
 * 代理Excel匯出請求到PHP後端
 */
export async function GET(request: NextRequest) {
  try {
    console.log("收到Excel匯出請求:", request.url);

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organization_id");
    const status = searchParams.get("status");

    console.log("匯出參數:", { organizationId, status });

    if (!organizationId) {
      return NextResponse.json({ error: "缺少團體ID" }, { status: 400 });
    }

    // 建構PHP後端API URL
    const phpApiUrl = new URL(
      "https://api.gddao.com/api/membership/admin/export"
    );
    phpApiUrl.searchParams.set("organization_id", organizationId);
    if (status) {
      phpApiUrl.searchParams.set("status", status);
    }

    console.log("代理Excel匯出請求到:", phpApiUrl.toString());

    // 代理請求到PHP後端
    const response = await fetch(phpApiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Language: "cht",
      },
    });

    console.log("PHP後端響應狀態:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PHP後端響應錯誤:", response.status, errorText);
      return NextResponse.json(
        { error: "匯出失敗" },
        { status: response.status }
      );
    }

    // 檢查響應內容類型
    const contentType = response.headers.get("content-type");
    console.log("響應內容類型:", contentType);

    if (contentType && contentType.includes("application/vnd.openxmlformats")) {
      // Excel文件，直接代理
      const blob = await response.blob();
      const filename =
        response.headers
          .get("content-disposition")
          ?.match(/filename="([^"]+)"/)?.[1] || "會員申請表.xlsx";

      return new NextResponse(blob, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } else {
      // 非Excel響應，可能是錯誤訊息
      const text = await response.text();
      console.error("非預期的響應內容:", text);
      return NextResponse.json(
        { error: "匯出格式錯誤", content: text },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("匯出Excel代理失敗:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "匯出失敗", details: errorMessage },
      { status: 500 }
    );
  }
}
