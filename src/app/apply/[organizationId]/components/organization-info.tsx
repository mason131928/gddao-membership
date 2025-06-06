/**
 * 團體資訊展示組件
 * 負責展示團體的基本資訊、Logo 和封面圖片
 */

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { Organization } from "@/types/membership";

interface OrganizationInfoProps {
  organization: Organization & {
    // 擴展組織類型以包含方案資訊
    name: string;
    amount: string;
    description?: string;
  };
}

export function OrganizationInfo({ organization }: OrganizationInfoProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  };

  const isImageFailed = (imageUrl: string) => {
    return failedImages.has(imageUrl);
  };

  return (
    <Card className="overflow-hidden">
      {/* 封面圖片 - 移動端優化 */}
      {organization.cover_image && !isImageFailed(organization.cover_image) && (
        <div className="aspect-video sm:aspect-[2/1] bg-gray-200 overflow-hidden">
          <Image
            src={organization.cover_image}
            alt={organization.name}
            className="w-full h-full object-cover"
            width={640}
            height={360}
            onError={() => handleImageError(organization.cover_image!)}
          />
        </div>
      )}

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 sm:mb-6">
          {/* Logo - 響應式大小 */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            {organization.logo && !isImageFailed(organization.logo) ? (
              <Image
                src={organization.logo}
                alt={organization.name}
                className="w-full h-full rounded-full object-cover"
                width={80}
                height={80}
                onError={() => handleImageError(organization.logo!)}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-xl sm:text-xl">
                  {organization.name?.charAt(0) || "組"}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">
              {organization.name}
            </h1>
            <p className="text-base sm:text-lg text-primary font-semibold">
              會費方案：{organization.name}
            </p>
          </div>
        </div>

        {/* 價格和描述 */}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              NT${" "}
              {organization.amount
                ? Number(organization.amount).toLocaleString()
                : "0"}
            </span>
            <span className="text-base sm:text-lg text-muted-foreground ml-2">
              / 年費
            </span>
          </div>

          {organization.description && (
            <div className="prose max-w-none">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                {organization.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
