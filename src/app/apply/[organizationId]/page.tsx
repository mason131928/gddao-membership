"use client";

/**
 * 會員申請頁面
 * 提供簡化的申請流程，直接跳轉到藍新付款頁面
 */

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ApplicationForm } from "@/components/forms/application-form";
import { ApplicationHeader } from "./components/application-header";
import { OrganizationInfo } from "./components/organization-info";
import { getOrganizations, createApplication } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 定義表單資料介面
interface FormData {
  name: string;
  phone: string;
  email: string;
  address?: string;
}

interface ApplicationResult {
  payment_url?: string;
  application_id?: number;
  id?: number;
}

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.organizationId as string;

  // 獲取團體資訊
  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations", organizationId],
    queryFn: () => getOrganizations(parseInt(organizationId)),
  });

  const organization = organizations?.[0]; // 因為是按ID查詢，只會返回一個

  // 提交申請的 mutation
  const mutation = useMutation({
    mutationFn: createApplication,
    onSuccess: (result: ApplicationResult) => {
      console.log("申請成功:", result);

      // 檢查後端是否返回付款URL
      if (result.payment_url) {
        alert("申請提交成功！即將跳轉到付款頁面...");
        // 直接跳轉到後端生成的藍新金流付款頁面
        window.location.href = result.payment_url;
      } else {
        // 備用方案：跳轉到我們的付款頁面
        alert("申請提交成功！即將跳轉到付款頁面...");
        router.push(`/payment/${result.application_id || result.id}`);
      }
    },
    onError: (error: Error) => {
      console.error("申請失敗:", error);
      const errorMessage =
        error instanceof Error ? error.message : "申請失敗，請稍後重試";
      alert(errorMessage);
    },
  });

  const handleSubmit = async (formData: FormData): Promise<void> => {
    const applicationData = {
      organization_id: parseInt(organizationId),
      ...formData,
    };
    await mutation.mutateAsync(applicationData);
  };

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  // 團體不存在狀態
  if (!organization) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">找不到團體</h2>
            <p className="text-muted-foreground mb-4">
              該團體不存在或未開啟會員繳費功能
            </p>
            <Button onClick={() => router.push("/")} variant="outline">
              返回首頁
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 主要內容
  return (
    <div className="min-h-screen bg-background">
      {/* 頂部導航 */}
      <ApplicationHeader />

      <div className="container mx-auto px-4 py-6 pb-32 sm:pb-24 max-w-4xl">
        {/* 團體資訊展示區 */}
        <div className="mb-6 sm:mb-8">
          <OrganizationInfo organization={organization} />
        </div>

        {/* 申請表單區 */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              填寫申請資料
            </h2>
            <p className="text-muted-foreground">
              請填寫完整資料以完成入會申請
            </p>
          </div>

          <ApplicationForm
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
