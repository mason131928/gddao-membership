"use client";

/**
 * 會員繳費系統首頁
 * 顯示所有開啟會員繳費的團體
 */

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getOrganizations } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 定義團體資料介面
interface Organization {
  organization_id: number;
  name: string;
  org_name?: string;
  description?: string;
  plan_description?: string;
  org_introduction?: string;
  membership_fee?: string | number;
  cover_image_url?: string;
  logo_url?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // 獲取所有開啟會員繳費的團體
  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations(),
  });

  const handleApply = (organizationId: number) => {
    router.push(`/apply/${organizationId}`);
  };

  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  };

  const isImageFailed = (imageUrl: string) => {
    return failedImages.has(imageUrl);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 頂部標題區 - 改善移動端間距 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground">
              會員繳費系統
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              選擇您要申請加入的團體
            </p>
          </div>
        </div>
      </div>

      {/* 主要內容區 - 大幅增加底部間距解決瀏覽器網址欄問題 */}
      <div className="container mx-auto px-4 py-6 sm:py-8 pb-32 sm:pb-24 max-w-6xl">
        {organizations && organizations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {organizations.map((org: Organization) => (
              <Card
                key={org.organization_id}
                className="overflow-hidden hover:shadow-lg transition-all duration-200 h-fit"
              >
                {/* 團體圖片區域 - 優化移動端顯示 */}
                <div className="aspect-video bg-gray-200 flex items-center justify-center relative">
                  {org.cover_image_url &&
                  !isImageFailed(org.cover_image_url) ? (
                    <img
                      src={org.cover_image_url}
                      alt={org.org_name || org.name}
                      className="w-full h-full object-cover"
                      onError={() =>
                        handleImageError(org.cover_image_url || "")
                      }
                    />
                  ) : org.logo_url && !isImageFailed(org.logo_url) ? (
                    <img
                      src={org.logo_url}
                      alt={org.org_name || org.name}
                      className="w-full h-full object-contain p-6 sm:p-8"
                      onError={() => handleImageError(org.logo_url || "")}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                      <svg
                        className="w-12 h-12 sm:w-16 sm:h-16 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className="text-sm sm:text-sm text-center leading-tight">
                        {org.org_name || org.name}
                      </span>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 sm:p-6">
                  {/* 標題區域 - 優化移動端Layout */}
                  <div className="flex items-start gap-3 mb-3 sm:mb-4">
                    {/* 小Logo - 移動端稍小 */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
                      {org.logo_url && !isImageFailed(org.logo_url) ? (
                        <img
                          src={org.logo_url}
                          alt={org.org_name || org.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={() => handleImageError(org.logo_url || "")}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm sm:text-sm">
                          {(org.org_name || org.name)?.charAt(0) || "組"}
                        </div>
                      )}
                    </div>

                    {/* 團體名稱 - 響應式字體 */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight break-words">
                        {org.org_name || org.name}
                      </h3>
                    </div>
                  </div>

                  {/* 團體介紹 - 移動端限制行數 */}
                  <p className="text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed text-gray-600">
                    {org.org_introduction || "暫無說明"}
                  </p>

                  {/* 方案說明 - 新增區塊 */}
                  {org.plan_description && (
                    <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r">
                      <p className="text-sm text-blue-800 leading-relaxed">
                        <span className="font-medium">方案說明：</span>
                        {org.plan_description}
                      </p>
                    </div>
                  )}

                  {/* 會費資訊 - 突出顯示 */}
                  <div className="mb-4 sm:mb-6 bg-primary/5 rounded-lg p-3 text-center">
                    <div className="mb-1">
                      <span className="text-xl sm:text-2xl font-bold text-primary">
                        NT${" "}
                        {parseFloat(
                          String(org.membership_fee || "0")
                        ).toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        / 年
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{org.name}</p>
                  </div>

                  {/* 申請按鈕 - 移動端更大的觸控區域 */}
                  <Button
                    onClick={() => handleApply(org.organization_id)}
                    className="w-full h-11 sm:h-10 text-sm sm:text-base font-medium"
                    size="default"
                  >
                    立即申請入會
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground mb-2">
              目前沒有開啟會員繳費的團體
            </p>
            <p className="text-sm text-muted-foreground">
              請稍後再查看或聯繫管理員
            </p>
          </div>
        )}

        {/* 管理後台連結 - 移動端固定在底部，大幅增加底部間距 */}
        <div className="mt-8 sm:mt-12 mb-32 sm:mb-20 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-base"
          >
            管理後台登入
          </Button>
        </div>

        {/* 額外的底部空白空間確保完全可滑動 */}
        <div className="h-16 sm:h-8"></div>
      </div>
    </div>
  );
}
