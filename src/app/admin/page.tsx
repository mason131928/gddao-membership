"use client";

/**
 * 會員管理後台登入頁面
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    business_number: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: (result) => {
      // 儲存登入資訊到 localStorage
      localStorage.setItem("admin_token", result.data.token);
      localStorage.setItem(
        "organization_id",
        result.data.organization_id.toString()
      );
      localStorage.setItem("organization_name", result.data.organization_name);

      // 導向管理後台
      router.push(`/admin/${result.data.organization_id}`);
    },
    onError: (error: Error) => {
      setError(error.message || "登入失敗");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部標題區 - 移動端優化 */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-base sm:text-base h-10 sm:h-10"
            >
              ← 返回首頁
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold text-center flex-1 mx-4">
              管理後台
            </h1>
            <div className="w-20"></div> {/* 平衡布局 */}
          </div>
        </div>
      </div>

      {/* 主要登入區域 - 使用更激進的底部間距解決瀏覽器網址欄問題 */}
      <div className="flex items-center justify-center px-4 py-8 sm:py-12 pb-40 sm:pb-24">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">
              會員管理後台
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              請輸入登入資訊
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 統一編號 */}
              <div className="space-y-2">
                <Label
                  htmlFor="business_number"
                  className="text-sm sm:text-base font-medium"
                >
                  統一編號
                </Label>
                <Input
                  id="business_number"
                  type="text"
                  value={formData.business_number}
                  onChange={(e) =>
                    handleInputChange("business_number", e.target.value)
                  }
                  placeholder="請輸入統一編號"
                  className="h-11 sm:h-10 text-sm"
                  required
                />
              </div>

              {/* 帳號 */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm sm:text-base font-medium"
                >
                  帳號
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="請輸入帳號"
                  className="h-11 sm:h-10 text-sm"
                  required
                />
              </div>

              {/* 密碼 */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm sm:text-base font-medium"
                >
                  密碼
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="請輸入密碼"
                  className="h-11 sm:h-10 text-sm"
                  required
                />
              </div>

              {/* 錯誤訊息 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* 登入按鈕 */}
              <Button
                type="submit"
                className="w-full h-11 sm:h-11 text-sm font-medium mt-6"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    登入中...
                  </div>
                ) : (
                  "登入"
                )}
              </Button>
            </form>

            {/* 底部提示 - 使用更大的底部邊距 */}
            <div className="mt-6 pt-4 border-t text-center mb-24 sm:mb-8">
              <p className="text-xs sm:text-sm text-muted-foreground">
                僅限授權管理人員使用
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 額外的大量底部空白空間確保完全可滑動 */}
        <div className="h-24 sm:h-8"></div>
      </div>
    </div>
  );
}
