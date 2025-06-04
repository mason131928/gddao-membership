"use client";

/**
 * 付款成功頁面
 * 用戶完成藍新金流付款後的返回頁面
 */

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * 付款成功頁面內容組件
 * 包含useSearchParams的邏輯
 */
function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 獲取URL參數（藍新金流可能會傳遞一些參數）
  const tradeNo = searchParams.get("TradeNo");
  const merchantOrderNo = searchParams.get("MerchantOrderNo");

  useEffect(() => {
    // 可以在這裡添加成功後的處理邏輯
    console.log("付款成功頁面載入");
    console.log("交易號:", tradeNo);
    console.log("商戶訂單號:", merchantOrderNo);
  }, [tradeNo, merchantOrderNo]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          {/* 成功圖示 */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* 成功標題 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">付款成功！</h1>

          {/* 成功訊息 */}
          <div className="space-y-3 mb-8">
            <p className="text-gray-600">恭喜您已成功完成會員繳費！</p>
            <p className="text-sm text-muted-foreground">
              您的申請已進入處理流程，我們將盡快以Email通知您審核結果。
            </p>
            {tradeNo && (
              <p className="text-xs text-muted-foreground">交易號：{tradeNo}</p>
            )}
          </div>

          {/* 後續步驟說明 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-sm mb-2 text-blue-900">
              接下來會發生什麼？
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 您將收到付款確認Email</li>
              <li>• 協會將審核您的申請資料</li>
              <li>• 審核通過後將通知您正式成為會員</li>
              <li>• 協會秘書會將您加入LINE群組</li>
            </ul>
          </div>

          {/* 聯絡資訊 */}
          <div className="text-xs text-muted-foreground mb-6">
            如有任何疑問，請聯絡：
            <br />
            電話：02-2397-2191 林小姐
          </div>

          {/* 返回按鈕 */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/membership")}
              className="w-full"
            >
              返回會員繳費首頁
            </Button>
            <Button
              onClick={() => (window.location.href = "https://gddao.com")}
              variant="outline"
              className="w-full"
            >
              前往好事道主站
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 載入中組件
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 付款成功頁面主組件
 */
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
