"use client";

/**
 * 付款狀態檢查頁面
 * 用戶從藍新金流返回後的狀態檢查頁面
 * 根據實際付款狀態顯示不同的訊息和指引
 */

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * 付款狀態類型定義
 */
interface PaymentStatusData {
  application: {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: string;
    applied_at: string;
    paid_at: string | null;
  };
  payment: {
    id: number;
    amount: number;
    status: string;
    payment_method: string;
    transaction_id: string | null;
    newebpay_order_no: string;
    paid_at: string | null;
    created_at: string;
  };
  organization: {
    id: number;
    name: string;
    org_name: string;
    logo_url: string | null;
    cover_image_url?: string | null;
  };
  plan: {
    id: number;
    name: string;
    amount: number;
    description: string;
  };
}

/**
 * 付款狀態檢查內容組件
 */
function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<PaymentStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 從URL參數獲取申請ID
  const applicationId = searchParams.get("application_id");

  useEffect(() => {
    if (!applicationId) {
      setError("缺少申請ID參數");
      setLoading(false);
      return;
    }

    // 檢查付款狀態
    checkPaymentStatus(applicationId);
  }, [applicationId]);

  /**
   * 檢查付款狀態
   */
  const checkPaymentStatus = async (appId: string) => {
    try {
      const response = await fetch(
        `https://api.gddao.com/api/membership/check-payment-status?application_id=${appId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Language: "cht",
          },
        }
      );

      const result = await response.json();

      if (result.code === 200) {
        setStatusData(result.data);
      } else {
        setError(result.msg || "無法獲取付款狀態");
      }
    } catch (err) {
      console.error("檢查付款狀態失敗:", err);
      setError("系統錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 根據付款狀態渲染不同的內容
   */
  const renderStatusContent = () => {
    if (!statusData) return null;

    const { payment, application, organization } = statusData;

    // 付款成功
    if (payment.status === "success" && application.status === "paid") {
      return (
        <div className="text-center">
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

          <h1 className="text-2xl font-bold text-gray-900 mb-4">付款成功！</h1>

          <div className="space-y-3 mb-8">
            <p className="text-gray-600">
              恭喜您已成功完成 {organization.org_name} 的會員繳費！
            </p>
            <p className="text-sm text-muted-foreground">
              您的申請已進入處理流程，我們將盡快以Email通知您審核結果。
            </p>
            {payment.transaction_id && (
              <p className="text-xs text-muted-foreground">
                交易號：{payment.transaction_id}
              </p>
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
        </div>
      );
    }

    // ATM轉帳待付款
    if (payment.payment_method === "VACC" && payment.status === "pending") {
      return (
        <div className="text-center">
          {/* 等待圖示 */}
          <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            請完成ATM轉帳
          </h1>

          <div className="space-y-3 mb-8">
            <p className="text-gray-600">
              您已取得ATM轉帳的虛擬帳號，請記得前往ATM完成轉帳。
            </p>
            <p className="text-sm text-muted-foreground">
              轉帳金額：NT$ {payment.amount.toLocaleString()}
            </p>
          </div>

          {/* ATM轉帳提醒 */}
          <Alert className="mb-6">
            <AlertDescription>
              <div className="text-left">
                <h4 className="font-semibold mb-2">重要提醒：</h4>
                <ul className="text-sm space-y-1">
                  <li>• 請使用您在申請時填寫的姓名進行轉帳</li>
                  <li>• 轉帳完成後，系統會自動確認付款</li>
                  <li>• 付款確認後會發送Email通知</li>
                  <li>• 如有疑問請聯絡協會：02-2397-2191</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // 其他付款方式待付款
    if (payment.status === "pending") {
      return (
        <div className="text-center">
          {/* 等待圖示 */}
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">付款處理中</h1>

          <div className="space-y-3 mb-8">
            <p className="text-gray-600">您的付款正在處理中，請稍候確認。</p>
            <p className="text-sm text-muted-foreground">
              如果您已完成付款，系統將在幾分鐘內更新狀態。
            </p>
          </div>

          <Alert className="mb-6">
            <AlertDescription>
              <div className="text-left">
                <h4 className="font-semibold mb-2">請注意：</h4>
                <ul className="text-sm space-y-1">
                  <li>• ATM繳費，需在一週內繳費成功（否則視為失敗）</li>
                  <li>• ATM繳費，轉帳帳號遺失，請前往email查收</li>
                  <li>• 付款完成將收到Email，若無代表尚未完成繳費</li>
                  <li>• 長時間未收到確認，請聯絡：02-2397-2191 林小姐</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // 付款失敗
    return (
      <div className="text-center">
        {/* 錯誤圖示 */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">付款異常</h1>

        <div className="space-y-3 mb-8">
          <p className="text-gray-600">付款過程中發生異常，請聯絡客服處理。</p>
          <p className="text-sm text-muted-foreground">
            訂單號：{payment.newebpay_order_no}
          </p>
        </div>

        <Alert className="mb-6">
          <AlertDescription>
            <div className="text-left">
              <h4 className="font-semibold mb-2">聯絡資訊：</h4>
              <ul className="text-sm space-y-1">
                <li>• 電話：02-2397-2191 林小姐</li>
                <li>• 請提供您的姓名和訂單號</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col justify-start p-4 py-8 overflow-y-auto">
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">檢查付款狀態中...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col justify-start p-4 py-8 overflow-y-auto">
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                無法檢查狀態
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => (window.location.href = "https://gddao.com")}
                className="w-full"
              >
                返回首頁
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col justify-start p-4 py-8 overflow-y-auto">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            {renderStatusContent()}

            {/* 聯絡資訊 */}
            <div className="text-xs text-muted-foreground mb-6 text-center">
              如有任何疑問，請聯絡：
              <br />
              電話：02-2397-2191 林小姐
            </div>

            {/* 返回按鈕 */}
            <div className="space-y-3">
              <Button
                onClick={() =>
                  (window.location.href = "https://gddao.com/membership")
                }
                className="w-full"
              >
                返回會員繳費首頁
              </Button>
              <Button
                onClick={() => (window.location.href = "https://gddao.com")}
                variant="outline"
                className="w-full"
              >
                前往好事道官網
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * 載入中組件
 */
function LoadingFallback() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col justify-start p-4 py-8 overflow-y-auto">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">載入中...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * 付款狀態檢查頁面主組件
 */
export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentStatusContent />
    </Suspense>
  );
}
