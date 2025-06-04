"use client";

/**
 * 申請列表表格組件
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { APPLICATION_STATUS, STATUS_LABELS } from "@/lib/constants";
import type { Application } from "@/types/membership";

interface ApplicationsTableProps {
  applications: Application[];
  isLoading?: boolean;
}

export function ApplicationsTable({
  applications,
  isLoading,
}: ApplicationsTableProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case APPLICATION_STATUS.PENDING:
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case APPLICATION_STATUS.PAID:
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">載入中...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-gray-500">
            <p>目前沒有申請記錄</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>申請列表</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  申請人
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  聯絡方式
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  方案
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  金額
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  狀態
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  申請時間
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{application.name}</p>
                      {application.address && (
                        <p className="text-sm text-gray-500">
                          {application.address}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <p>{application.phone}</p>
                      <p className="text-gray-500">{application.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">
                      {application.planName || "會員方案"}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">
                      {application.amount &&
                        formatCurrency(parseFloat(application.amount))}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={getStatusBadge(application.status)}>
                      {STATUS_LABELS[application.status] || application.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDate(application.appliedAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {/* 目前簡化版本不需要審核功能，付款成功即完成 */}
                      {application.status === APPLICATION_STATUS.PENDING && (
                        <span className="text-sm text-gray-500">等待付款</span>
                      )}
                      {application.status === APPLICATION_STATUS.PAID && (
                        <span className="text-sm text-green-600">
                          會員申請完成
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
