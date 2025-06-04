"use client";

/**
 * 付款頁面 - 支援藍新金流整合
 * 路由: /payment/[applicationId]
 */

import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { createPayment } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PaymentData {
  amount: number;
  organizationId: number;
  applicationId: number;
  organizationName?: string;
  planName?: string;
  applicantName?: string;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = parseInt(params.applicationId as string);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  // 模擬獲取申請資料（實際需要從API獲取）
  useEffect(() => {
    // 這裡應該從API獲取申請詳情
    // 暫時使用固定資料
    setPaymentData({
      amount: 300,
      organizationId: 1013,
      applicationId,
      organizationName: "社團法人國際社區健康照護協會",
      planName: "一般會員",
      applicantName: "會員申請",
    });
  }, [applicationId]);

  // 創建付款訂單
  const paymentMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: (result) => {
      console.log("付款訂單創建成功:", result);

      if (result.payment_form) {
        // 如果返回付款表單，直接提交到藍新金流
        const form = document.createElement("form");
        form.method = "POST";
        form.action =
          result.payment_url || "https://core.newebpay.com/MPG/mpg_gateway";

        // 添加表單欄位
        Object.entries(result.payment_form).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else if (result.payment_url) {
        // 如果返回付款URL，直接跳轉
        window.location.href = result.payment_url;
      }
    },
    onError: (error) => {
      console.error("創建付款訂單失敗:", error);
      alert("付款處理失敗，請稍後重試");
      setIsProcessing(false);
    },
  });

  const handlePayment = () => {
    if (!paymentData) return;

    setIsProcessing(true);
    paymentMutation.mutate({
      applicationId: paymentData.applicationId,
      amount: paymentData.amount,
      organizationId: paymentData.organizationId,
    });
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">載入付款資訊...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 頂部導航 */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="h-10 text-base"
              disabled={isProcessing}
            >
              ← 返回
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold">會費付款</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">會</span>
              </div>
              付款資訊
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 團體資訊 */}
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">團體名稱</span>
              <span className="font-medium text-right max-w-[60%]">
                {paymentData.organizationName}
              </span>
            </div>

            {/* 方案資訊 */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">會費方案</span>
              <Badge variant="secondary">{paymentData.planName}</Badge>
            </div>

            {/* 申請編號 */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">申請編號</span>
              <span className="font-mono">#{paymentData.applicationId}</span>
            </div>

            <hr className="my-4" />

            {/* 付款金額 */}
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">付款金額</span>
              <span className="font-bold text-primary text-xl">
                NT$ {paymentData.amount.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 付款說明 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-sm">付款說明</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 點選「前往付款」將跳轉至藍新金流付款頁面</li>
              <li>• 支援信用卡、ATM轉帳、超商代碼等多種付款方式</li>
              <li>• 付款完成後系統將自動更新您的會員狀態</li>
              <li>• 如有問題請聯繫團體管理員</li>
            </ul>
          </CardContent>
        </Card>

        {/* 付款按鈕 */}
        <div className="space-y-4">
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                處理中...
              </>
            ) : (
              "前往付款"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isProcessing}
            className="w-full h-10"
          >
            暫不付款
          </Button>
        </div>

        {/* 安全提示 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-3 h-3 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                安全付款保障
              </p>
              <p className="text-sm text-blue-700">
                本系統使用藍新金流SSL加密技術，確保您的付款資訊安全無虞
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
