"use client";

/**
 * 會員申請頁面 - 簡化版
 * 直接跳轉到藍新付款頁面
 */

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ApplicationForm } from "@/components/forms/application-form";
import { getOrganizations, createApplication } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

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

  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  };

  const isImageFailed = (imageUrl: string) => {
    return failedImages.has(imageUrl);
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* 頂部導航 */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="h-10 text-base"
            >
              ← 返回
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold">申請入會</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-32 sm:pb-24 max-w-4xl">
        {/* 團體資訊展示區 - 響應式優化 */}
        <div className="mb-6 sm:mb-8">
          <Card className="overflow-hidden">
            {/* 封面圖片 - 移動端優化 */}
            {organization.cover_image_url &&
              !isImageFailed(organization.cover_image_url) && (
                <div className="aspect-video sm:aspect-[2/1] bg-gray-200 overflow-hidden">
                  <img
                    src={organization.cover_image_url}
                    alt={organization.org_name}
                    className="w-full h-full object-cover"
                    onError={() =>
                      handleImageError(organization.cover_image_url)
                    }
                  />
                </div>
              )}

            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 sm:mb-6">
                {/* Logo - 響應式大小 */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                  {organization.logo_url &&
                  !isImageFailed(organization.logo_url) ? (
                    <img
                      src={organization.logo_url}
                      alt={organization.org_name}
                      className="w-full h-full rounded-full object-cover"
                      onError={() => handleImageError(organization.logo_url)}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-xl sm:text-xl">
                        {organization.org_name?.charAt(0) || "組"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">
                    {organization.org_name}
                  </h1>
                  <p className="text-base sm:text-lg text-primary font-semibold">
                    會費方案：{organization.name}
                  </p>
                </div>
              </div>

              {/* 描述 - 響應式字體 */}
              {organization.description && (
                <div className="mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {organization.description}
                  </p>
                </div>
              )}

              {/* 會費資訊 - 突出顯示 */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 sm:p-6 text-center">
                <div className="mb-2">
                  <span className="text-sm sm:text-base text-muted-foreground">
                    年度會費
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  NT${" "}
                  {parseFloat(
                    organization.membership_fee || 0
                  ).toLocaleString()}
                </div>
                <div className="text-sm sm:text-sm text-muted-foreground">
                  完成繳費後即可成為正式會員
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 申請表單 - 響應式優化 */}
        <Card>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                填寫申請資料
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                請仔細填寫以下資料，提交後將導向付款頁面
              </p>
            </div>

            <ApplicationForm
              onSubmit={handleSubmit}
              isLoading={mutation.isPending}
            />
          </CardContent>
        </Card>

        {/* 注意事項 - 移動端優化，大幅增加底部間距確保完全可滑動 */}
        <Card className="mt-6 mb-32 sm:mb-20">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold mb-3 text-sm sm:text-base">
              申請須知
            </h3>
            <ul className="text-sm sm:text-sm text-muted-foreground space-y-2 leading-relaxed">
              <li>• 完成付款後，也等同於入會成功</li>
              <li>• 入會成功後將以 Email 進行通知</li>
              <li>• 後續協會秘書會將各位加入協會LINE群組</li>
              <li>• 如有疑問，請聯繫02-2397-2191 林小姐</li>
            </ul>
          </CardContent>
        </Card>

        {/* 額外的底部空白空間確保完全可滑動 */}
        <div className="h-16 sm:h-8"></div>
      </div>
    </div>
  );
}
