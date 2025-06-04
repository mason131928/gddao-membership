/**
 * 入會申請Modal組件 - 正式申請書格式
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Organization } from "@/types/membership";
import { createApplication, createPayment } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText } from "lucide-react";

// 表單驗證 schema
const applicationSchema = z.object({
  name: z
    .string()
    .min(2, "姓名至少需要2個字元")
    .max(20, "姓名不能超過20個字元"),
  birthDate: z.string().min(1, "請填寫出生年月日"),
  idNumber: z.string().min(10, "請填寫正確的身分證或居留證號碼"),
  gender: z.enum(["male", "female", "other"], { required_error: "請選擇性別" }),
  genderOther: z.string().optional(),
  education: z.enum(
    [
      "elementary",
      "junior",
      "senior",
      "college",
      "university",
      "master",
      "doctor",
      "other",
    ],
    { required_error: "請選擇學歷" }
  ),
  educationOther: z.string().optional(),
  schoolName: z.string().optional(),
  department: z.string().optional(),
  workUnit: z.string().optional(),
  jobTitle: z.string().optional(),
  address: z.string().min(1, "請填寫聯絡地址"),
  phone: z.string().regex(/^09\d{8}$/, "請輸入有效的手機號碼格式"),
  email: z.string().email("請輸入有效的電子信箱格式"),
  lineId: z.string().optional(),
});

interface MembershipModalProps {
  organization: Organization;
  planId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function MembershipModal({
  organization,
  planId,
  isOpen,
  onClose,
}: MembershipModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type FormData = z.infer<typeof applicationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
  });

  const watchGender = watch("gender");
  const watchEducation = watch("education");

  // 處理表單提交
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 檢查必要參數
      console.log("組織資料:", organization);
      console.log("方案ID:", planId);
      console.log("表單資料:", data);

      if (!organization.id) {
        throw new Error("組織ID無效");
      }
      if (!planId) {
        throw new Error("方案ID無效");
      }

      // 提交申請
      const application = await createApplication({
        organization_id: organization.id,
        planId,
        ...data,
      });

      // 檢查申請結果
      console.log("申請提交結果:", application);

      if (!application || !application.id) {
        throw new Error("申請創建失敗，無法獲取申請ID");
      }

      // 創建付款訂單
      const amount = organization.plans?.[0]?.amount
        ? parseFloat(organization.plans[0].amount)
        : 300;
      console.log("付款金額:", amount);

      let payment;
      try {
        payment = await createPayment({
          applicationId: application.id,
          amount,
          organizationId: organization.id,
        });
        console.log("付款訂單創建結果:", payment);
      } catch (paymentError) {
        console.error("付款 API 調用失敗:", paymentError);
        throw new Error(
          `付款 API 調用失敗: ${
            paymentError instanceof Error ? paymentError.message : "未知錯誤"
          }`
        );
      }

      // 檢查付款 URL 是否有效
      if (!payment) {
        throw new Error("付款訂單創建失敗：返回空結果");
      }

      if (!payment.paymentUrl) {
        console.error("付款響應缺少 paymentUrl:", payment);
        throw new Error("付款訂單創建失敗：缺少付款 URL");
      }

      // 跳轉到藍新金流付款頁面
      window.location.href = payment.paymentUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "提交失敗，請重試";

      console.error("申請失敗:", err);

      // 根據錯誤類型提供不同的提示
      if (errorMessage.includes("重複申請")) {
        setError(
          "您已經提交過申請，如需查看申請狀態請聯繫客服，或嘗試使用不同的電子信箱申請。"
        );
      } else if (errorMessage.includes("付款 API 調用失敗")) {
        setError(`付款系統錯誤：${errorMessage}`);
      } else if (errorMessage.includes("付款訂單創建失敗")) {
        setError(`付款訂單問題：${errorMessage}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 處理Modal關閉
  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setError(null);
      onClose();
    }
  };

  // 獲取當前日期
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear() - 1911; // 民國年
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `中華民國 ${year} 年 ${month} 月 ${day} 日`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="text-center border-b pb-4">
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <FileText className="h-6 w-6" />
            {organization.name} 個人會員入會申請書
          </DialogTitle>
        </DialogHeader>

        {/* 申請日期 */}
        <div className="text-right text-sm text-gray-600 mb-6">
          申請日期：{getCurrentDate()}
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 申請表單 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 基本資料 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 申請人姓名 */}
            <div className="md:col-span-2">
              <Label htmlFor="name" className="text-base font-medium">
                申請人姓名 *
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="請輸入您的姓名"
                disabled={isSubmitting}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* 出生年月日 */}
            <div>
              <Label htmlFor="birthDate" className="text-base font-medium">
                出生年月日 *
              </Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate")}
                disabled={isSubmitting}
                className="mt-1"
              />
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            {/* 身分證號 */}
            <div>
              <Label htmlFor="idNumber" className="text-base font-medium">
                國民身分證或居留證統一編號 *
              </Label>
              <Input
                id="idNumber"
                {...register("idNumber")}
                placeholder="請輸入身分證或居留證號碼"
                disabled={isSubmitting}
                className="mt-1"
              />
              {errors.idNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.idNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* 性別 */}
          <div>
            <Label className="text-base font-medium">性別 *</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="male"
                  {...register("gender")}
                  disabled={isSubmitting}
                  className="mr-2"
                />
                男
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="female"
                  {...register("gender")}
                  disabled={isSubmitting}
                  className="mr-2"
                />
                女
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="other"
                  {...register("gender")}
                  disabled={isSubmitting}
                  className="mr-2"
                />
                其他
              </label>
            </div>
            {watchGender === "other" && (
              <Input
                {...register("genderOther")}
                placeholder="請說明"
                disabled={isSubmitting}
                className="mt-2 w-48"
              />
            )}
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* 最高學歷 */}
          <div>
            <Label className="text-base font-medium">最高學歷 *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {[
                { value: "elementary", label: "國小" },
                { value: "junior", label: "國中" },
                { value: "senior", label: "高中" },
                { value: "college", label: "二專/五專" },
                { value: "university", label: "大學/二技" },
                { value: "master", label: "碩士" },
                { value: "doctor", label: "博士" },
                { value: "other", label: "其他" },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    {...register("education")}
                    disabled={isSubmitting}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {watchEducation === "other" && (
              <Input
                {...register("educationOther")}
                placeholder="請說明其他學歷"
                disabled={isSubmitting}
                className="mt-2"
              />
            )}
            {errors.education && (
              <p className="text-red-500 text-sm mt-1">
                {errors.education.message}
              </p>
            )}
          </div>

          {/* 學校資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="schoolName" className="text-base font-medium">
                學校名稱
              </Label>
              <Input
                id="schoolName"
                {...register("schoolName")}
                placeholder="請輸入學校名稱（選填）"
                disabled={isSubmitting}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="department" className="text-base font-medium">
                科系（所）
              </Label>
              <Input
                id="department"
                {...register("department")}
                placeholder="請輸入科系（選填）"
                disabled={isSubmitting}
                className="mt-1"
              />
            </div>
          </div>

          {/* 現職 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workUnit" className="text-base font-medium">
                服務單位
              </Label>
              <Input
                id="workUnit"
                {...register("workUnit")}
                placeholder="請輸入服務單位（選填）"
                disabled={isSubmitting}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="jobTitle" className="text-base font-medium">
                職稱
              </Label>
              <Input
                id="jobTitle"
                {...register("jobTitle")}
                placeholder="請輸入職稱（選填）"
                disabled={isSubmitting}
                className="mt-1"
              />
            </div>
          </div>

          {/* 聯絡地址 */}
          <div>
            <Label htmlFor="address" className="text-base font-medium">
              聯絡地址 *
            </Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="請輸入您的聯絡地址"
              disabled={isSubmitting}
              rows={2}
              className="mt-1"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* 聯絡方式 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="phone" className="text-base font-medium">
                行動電話 *
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="09xxxxxxxx"
                disabled={isSubmitting}
                className="mt-1"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-base font-medium">
                電子信箱 *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="example@email.com"
                disabled={isSubmitting}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lineId" className="text-base font-medium">
                LINE ID
              </Label>
              <Input
                id="lineId"
                {...register("lineId")}
                placeholder="請輸入 LINE ID（選填）"
                disabled={isSubmitting}
                className="mt-1"
              />
            </div>
          </div>

          {/* 會費資訊 */}
          <div className="bg-blue-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">會費資訊</h4>
                <p className="text-sm text-blue-700 mt-1">個人會員年費</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    organization.plans?.[0]?.amount
                      ? parseFloat(organization.plans[0].amount)
                      : 300
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  處理中...
                </>
              ) : (
                <>提交申請並付款</>
              )}
            </Button>
          </div>
        </form>

        {/* 付款說明 */}
        <div className="text-xs text-gray-500 text-center mt-4 pt-4 border-t">
          點擊「提交申請並付款」後，將跳轉至藍新金流付款頁面
        </div>
      </DialogContent>
    </Dialog>
  );
}
