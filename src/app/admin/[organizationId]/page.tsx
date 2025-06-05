"use client";

/**
 * 會員管理後台 - 申請列表頁面
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getApplications, exportApplications } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 定義申請資料介面
interface Application {
  id: number;
  name: string;
  phone: string;
  email: string;
  amount: string | number;
  status: string;
  paid_at?: string;
  applied_at: string;
  next_payment_date?: string;
  next_payment_amount?: string | number;
}

export default function AdminDashboard() {
  const params = useParams();
  const router = useRouter();
  const organizationId = parseInt(params.organizationId as string);
  const [organizationName, setOrganizationName] = useState("");
  const [exportStatus, setExportStatus] = useState<string>("all"); // 匯出狀態篩選，改為"all"

  // 檢查登入狀態
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const storedOrgId = localStorage.getItem("organization_id");
    const storedOrgName = localStorage.getItem("organization_name");

    if (!token || !storedOrgId || parseInt(storedOrgId) !== organizationId) {
      router.push("/admin");
      return;
    }

    setOrganizationName(storedOrgName || "");
  }, [organizationId, router]);

  // 獲取申請列表
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["applications", organizationId],
    queryFn: () => getApplications(organizationId),
    enabled: organizationId > 0,
  });

  // 提取實際的申請數據
  const applications = apiResponse?.data || [];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("organization_id");
    localStorage.removeItem("organization_name");
    router.push("/admin");
  };

  // 處理匯出Excel
  const handleExportExcel = async () => {
    try {
      // 如果選擇"all"則傳遞空字符串給後端
      const statusToExport = exportStatus === "all" ? "" : exportStatus;
      await exportApplications(organizationId, statusToExport);
    } catch (error) {
      console.error("匯出失敗:", error);
      alert("匯出失敗，請稍後重試");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">待付款</Badge>;
      case "paid":
        return <Badge variant="default">已付款</Badge>;
      case "failed":
        return <Badge variant="destructive">付款失敗</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-TW");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500">
          載入失敗：{error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 頂部導航 - 移動端優化 */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                {organizationName}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                會員申請管理
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="self-end sm:self-auto h-10 sm:h-10 text-base"
            >
              登出
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-40 sm:pb-24 space-y-6">
        {/* 統計卡片 - 響應式網格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {applications?.filter(
                    (app: Application) => app.status === "paid"
                  ).length || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-1">已付款申請</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                  {applications?.filter(
                    (app: Application) => app.status === "pending"
                  ).length || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-1">待付款申請</p>
              </div>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  NT${" "}
                  {(
                    applications
                      ?.filter((app: Application) => app.status === "paid")
                      .reduce(
                        (sum: number, app: Application) =>
                          sum + parseFloat(String(app.amount || 0)),
                        0
                      ) || 0
                  ).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">總收入</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 申請列表 */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <CardTitle className="text-lg sm:text-xl">申請列表</CardTitle>

              {/* 操作工具列 - 移動端垂直排列 */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                {/* 匯出功能區塊 */}
                <div className="flex items-center gap-2 order-2 sm:order-1">
                  <Select value={exportStatus} onValueChange={setExportStatus}>
                    <SelectTrigger className="w-full sm:w-32 h-10">
                      <SelectValue placeholder="篩選狀態" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="all">全部狀態</SelectItem>
                      <SelectItem value="pending">待付款</SelectItem>
                      <SelectItem value="paid">已付款</SelectItem>
                      <SelectItem value="failed">付款失敗</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="default"
                    onClick={handleExportExcel}
                    className="h-10 flex-1 sm:flex-none text-base"
                  >
                    匯出Excel
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="h-10 order-1 sm:order-2 text-base"
                >
                  重新整理
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {applications && applications.length > 0 ? (
              <div className="space-y-3">
                {/* 桌面版標題欄 - 只在中等螢幕以上顯示，調整比例 */}
                <div className="hidden md:grid grid-cols-6 gap-4 items-center py-3 px-4 bg-muted/30 rounded-lg font-semibold text-sm text-muted-foreground">
                  <div>姓名</div>
                  <div>電話</div>
                  <div>Email</div>
                  <div>繳款金額</div>
                  <div>付款狀況</div>
                  <div>下次繳費日期/金額</div>
                </div>

                {/* 申請列表 */}
                {applications.map((app: Application) => (
                  <Card
                    key={app.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      {/* 移動端垂直佈局 */}
                      <div className="md:hidden space-y-3">
                        {/* 基本資訊 */}
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-base">
                              {app.name || "未提供姓名"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {app.phone || "未提供"}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {getStatusBadge(app.status)}
                          </div>
                        </div>

                        {/* 詳細資訊 */}
                        <div className="grid grid-cols-1 gap-2 pt-3 border-t border-border/50">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Email:
                            </span>
                            <span className="text-sm text-foreground break-all text-right max-w-[200px]">
                              {app.email || "未提供"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              金額:
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              NT${" "}
                              {parseFloat(
                                String(app.amount || 0)
                              ).toLocaleString()}
                            </span>
                          </div>
                          {app.paid_at && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                付款時間:
                              </span>
                              <span className="text-xs text-green-600">
                                {formatDate(app.paid_at)}
                              </span>
                            </div>
                          )}
                          {app.next_payment_date && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                下次繳費日期:
                              </span>
                              <span className="text-sm text-blue-600 font-medium">
                                {new Date(
                                  app.next_payment_date
                                ).toLocaleDateString("zh-TW")}
                              </span>
                            </div>
                          )}
                          {app.next_payment_amount && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                下次繳費金額:
                              </span>
                              <span className="text-sm text-blue-600 font-medium">
                                NT${" "}
                                {parseFloat(
                                  String(app.next_payment_amount || 0)
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 桌面版水平佈局 */}
                      <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                        {/* 姓名 */}
                        <div>
                          <p className="font-semibold text-foreground text-base">
                            {app.name || "未提供姓名"}
                          </p>
                        </div>

                        {/* 電話 */}
                        <div>
                          <p className="text-sm text-foreground">
                            {app.phone || "未提供"}
                          </p>
                        </div>

                        {/* Email */}
                        <div>
                          <p className="text-sm text-foreground break-all">
                            {app.email || "未提供"}
                          </p>
                        </div>

                        {/* 繳款金額 */}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            NT${" "}
                            {parseFloat(
                              String(app.amount || 0)
                            ).toLocaleString()}
                          </p>
                        </div>

                        {/* 付款狀況 */}
                        <div className="flex flex-col items-start">
                          {getStatusBadge(app.status)}
                          {app.paid_at && (
                            <p className="text-xs text-green-600 mt-1">
                              {formatDate(app.paid_at)}
                            </p>
                          )}
                        </div>

                        {/* 下次繳費資訊（合併日期和金額） */}
                        <div className="flex flex-col items-start">
                          {app.next_payment_date ? (
                            <>
                              <p className="text-sm text-blue-600 font-medium">
                                {new Date(
                                  app.next_payment_date
                                ).toLocaleDateString("zh-TW")}
                              </p>
                              {app.next_payment_amount && (
                                <p className="text-xs text-blue-600 mt-1">
                                  NT${" "}
                                  {parseFloat(
                                    String(app.next_payment_amount || 0)
                                  ).toLocaleString()}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              -
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  目前沒有申請記錄
                </p>
                <p className="text-sm text-muted-foreground">
                  當有新的會員申請時，會在這裡顯示
                </p>
              </div>
            )}

            {/* 在列表最下方增加大量底部間距 */}
            <div className="h-32 sm:h-8 mt-8"></div>
          </CardContent>
        </Card>

        {/* 額外的大量底部空白空間確保完全可滑動 */}
        <div className="h-24 sm:h-8"></div>
      </div>
    </div>
  );
}
