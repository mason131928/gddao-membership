"use client";

/**
 * 付款成功頁面
 * 接收藍新金流的付款結果
 */

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, RefreshCw } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 藍新金流可能回傳的參數
  const merchantOrderNo = searchParams.get("MerchantOrderNo");
  const tradeNo = searchParams.get("TradeNo");
  const amt = searchParams.get("Amt");
  const status = searchParams.get("Status");
  const paymentType = searchParams.get("PaymentType");
  const message = searchParams.get("Message");
  const payTime = searchParams.get("PayTime");

  const isSuccess = status === "SUCCESS";

  return (
    <div className="min-h-screen bg-background">
      {/* 頂部導航 - 移動端優化 */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="h-10 text-base"
            >
              <Home className="w-4 h-4 mr-2" />
              首頁
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold">
              {isSuccess ? "付款結果" : "付款失敗"}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 pb-32 sm:pb-24 max-w-2xl">
        <Card className="shadow-lg">
          <CardContent className="p-6 sm:p-8">
            {isSuccess ? (
              <div className="text-center">
                {/* 成功圖示 - 響應式大小 */}
                <div className="mb-6 sm:mb-8">
                  <CheckCircle className="w-20 h-20 sm:w-20 sm:h-20 text-green-500 mx-auto" />
                </div>

                {/* 成功標題 - 響應式字體 */}
                <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-3 sm:mb-4">
                  付款成功！
                </h1>

                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  感謝您完成會員費繳納，我們已收到您的付款。
                  您的會員申請已進入審核流程。
                </p>

                {/* 付款詳情 - 移動端優化 */}
                {(merchantOrderNo ||
                  tradeNo ||
                  amt ||
                  paymentType ||
                  payTime) && (
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-left">
                    <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-center">
                      付款詳情
                    </h3>
                    <div className="space-y-3">
                      {merchantOrderNo && (
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                          <span className="text-sm text-gray-600 font-medium">
                            訂單編號
                          </span>
                          <span className="font-mono text-sm break-all">
                            {merchantOrderNo}
                          </span>
                        </div>
                      )}
                      {tradeNo && (
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                          <span className="text-sm text-gray-600 font-medium">
                            交易編號
                          </span>
                          <span className="font-mono text-sm break-all">
                            {tradeNo}
                          </span>
                        </div>
                      )}
                      {amt && (
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                          <span className="text-sm text-gray-600 font-medium">
                            付款金額
                          </span>
                          <span className="font-semibold text-lg text-green-600">
                            NT$ {parseFloat(amt).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {paymentType && (
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                          <span className="text-sm text-gray-600 font-medium">
                            付款方式
                          </span>
                          <span className="text-sm">{paymentType}</span>
                        </div>
                      )}
                      {payTime && (
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                          <span className="text-sm text-gray-600 font-medium">
                            付款時間
                          </span>
                          <span className="text-sm">{payTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 後續步驟說明 - 移動端優化 */}
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                  <h4 className="font-semibold text-blue-800 mb-3 text-base">
                    後續步驟
                  </h4>
                  <ul className="text-blue-700 text-sm space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>您的會員申請已進入審核流程</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>我們將在 1-3 個工作天內完成審核</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>審核結果將以 Email 通知您</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>如有疑問請聯繫團體管理員</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {/* 失敗狀態 - 響應式優化 */}
                <div className="mb-6 sm:mb-8">
                  <div className="w-20 h-20 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-red-500 text-3xl sm:text-3xl font-bold">
                      ✗
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-3 sm:mb-4">
                  付款失敗
                </h1>

                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  {message ||
                    "付款過程中發生錯誤，請檢查您的付款資訊後重新嘗試"}
                </p>

                {/* 失敗詳情 */}
                {merchantOrderNo && (
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-left">
                    <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-center">
                      訂單資訊
                    </h3>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                        <span className="text-sm text-gray-600 font-medium">
                          訂單編號
                        </span>
                        <span className="font-mono text-sm break-all">
                          {merchantOrderNo}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                        <span className="text-sm text-gray-600 font-medium">
                          狀態
                        </span>
                        <span className="text-red-600 font-semibold">
                          付款失敗
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 錯誤處理建議 */}
                <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                  <h4 className="font-semibold text-yellow-800 mb-3 text-base">
                    解決建議
                  </h4>
                  <ul className="text-yellow-700 text-sm space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>請檢查信用卡餘額是否足夠</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>確認信用卡資訊輸入正確</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>聯繫您的銀行確認是否有交易限制</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>稍後再次嘗試付款</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* 操作按鈕 - 移動端優化 */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full sm:w-auto h-11 sm:h-10 text-sm order-2 sm:order-1"
              >
                <Home className="w-4 h-4 mr-2" />
                返回首頁
              </Button>

              {!isSuccess && (
                <Button
                  onClick={() => router.back()}
                  className="w-full sm:w-auto h-11 sm:h-10 text-sm order-1 sm:order-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重新付款
                </Button>
              )}
            </div>

            {/* 底部提示 - 增加底部邊距 */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t text-center mb-16 sm:mb-12">
              <p className="text-sm sm:text-sm text-muted-foreground">
                {isSuccess
                  ? "請保留此頁面截圖作為付款憑證"
                  : "如持續遇到問題，請聯繫客服人員"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 額外的底部空白空間確保完全可滑動 */}
        <div className="h-16 sm:h-8"></div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
