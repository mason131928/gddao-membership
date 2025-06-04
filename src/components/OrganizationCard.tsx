/**
 * 團體卡片組件
 */

import { Organization } from "@/types/membership";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Users, MapPin } from "lucide-react";

interface OrganizationCardProps {
  organization: Organization;
  onClick: () => void;
}

export function OrganizationCard({
  organization,
  onClick,
}: OrganizationCardProps) {
  // 計算會費（使用第一個方案的金額）
  const membershipFee = organization.plans?.[0]?.amount ? parseFloat(organization.plans[0].amount) : 0;
  
  // 向後兼容的字段映射
  const description = organization.introduction || organization.description;
  
  // 暫時禁用遠程圖片，避免 404 錯誤
  // TODO: 待後端圖片服務修復後，可以重新啟用
  // const banner = organization.cover_image || organization.banner;
  // const logo = organization.logo;
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
      {/* Banner 圖片 */}
      <div className="relative h-48 overflow-hidden">
        {/* 預設背景 */}
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <Users className="h-16 w-16 text-white opacity-50" />
        </div>

        {/* Logo 覆蓋在右下角 */}
        <div className="absolute bottom-4 right-4">
          <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden">
            {/* 預設 Logo 圖標 */}
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* 團體名稱 */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {organization.name}
        </h3>

        {/* 團體描述 */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* 會費資訊 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>會費</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(membershipFee)}
            </div>
            <div className="text-xs text-gray-500">一次性費用</div>
          </div>
        </div>

        {/* 申請按鈕 */}
        <Button
          onClick={onClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
        >
          立即申請加入
        </Button>

        {/* 狀態指示 */}
        <div className="mt-3 text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            開放申請中
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
