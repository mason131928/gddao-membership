"use client";

/**
 * 申請列表表格組件
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateApplicationStatus } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_TEXT,
  SUCCESS_MESSAGES,
} from "@/lib/constants";
import type { MembershipApplication } from "@/types/membership";

interface ApplicationsTableProps {
  applications: MembershipApplication[];
  organizationId: number;
  isLoading?: boolean;
}

export function ApplicationsTable({
  applications,
  organizationId,
  isLoading,
}: ApplicationsTableProps) {
  const [processingId, setProcessingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // 更新申請狀態
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateApplicationStatus(id, status),
    onSuccess: () => {
      // 重新載入申請列表
      queryClient.invalidateQueries({
        queryKey: ["applications", organizationId],
      });
      alert(SUCCESS_MESSAGES.STATUS_UPDATED);
      setProcessingId(null);
    },
    onError: (error) => {
      console.error("更新狀態失敗:", error);
      alert("更新狀態失敗，請重試");
      setProcessingId(null);
    },
  });

  const handleStatusUpdate = (id: number, status: string) => {
    setProcessingId(id);
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case APPLICATION_STATUS.PENDING:
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case APPLICATION_STATUS.PAID:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case APPLICATION_STATUS.APPROVED:
        return `${baseClasses} bg-green-100 text-green-800`;
      case APPLICATION_STATUS.REJECTED:
        return `${baseClasses} bg-red-100 text-red-800`;
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
                    <p className="font-medium">{application.plan?.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">
                      {application.plan &&
                        formatCurrency(application.plan.amount)}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={getStatusBadge(application.status)}>
                      {APPLICATION_STATUS_TEXT[application.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDate(application.appliedAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {application.status === APPLICATION_STATUS.PAID && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(
                                application.id,
                                APPLICATION_STATUS.APPROVED
                              )
                            }
                            disabled={processingId === application.id}
                          >
                            {processingId === application.id
                              ? "處理中..."
                              : "核准"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusUpdate(
                                application.id,
                                APPLICATION_STATUS.REJECTED
                              )
                            }
                            disabled={processingId === application.id}
                          >
                            拒絕
                          </Button>
                        </>
                      )}
                      {application.status === APPLICATION_STATUS.PENDING && (
                        <span className="text-sm text-gray-500">等待付款</span>
                      )}
                      {(application.status === APPLICATION_STATUS.APPROVED ||
                        application.status === APPLICATION_STATUS.REJECTED) && (
                        <span className="text-sm text-gray-500">已處理</span>
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
