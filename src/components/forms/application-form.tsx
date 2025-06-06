/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

/**
 * 會員申請表單組件 - 簡化版
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 表單驗證 schema
const applicationSchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  phone: z
    .string()
    .min(1, "請輸入手機號碼")
    .regex(/^09\d{8}$/, "手機號碼格式錯誤"),
  email: z.string().min(1, "請輸入Email").email("Email格式錯誤"),
  address: z.string().min(1, "請輸入聯絡地址"),
  birthDate: z.string().min(1, "請輸入出生年月日"),
  idNumber: z.string().min(1, "請輸入身分證或居留證統一編號"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "請選擇性別",
  }),
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
    {
      required_error: "請選擇最高學歷",
    }
  ),
  educationOther: z.string().optional(),
  schoolName: z.string().optional(),
  department: z.string().optional(),
  workUnit: z.string().optional(),
  jobTitle: z.string().optional(),
  lineId: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ApplicationForm({
  onSubmit,
  isLoading = false,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const watchGender = watch("gender");
  const watchEducation = watch("education");

  // 學歷選項
  const educationOptions = [
    { value: "elementary", label: "國小" },
    { value: "junior", label: "國中" },
    { value: "senior", label: "高中" },
    { value: "college", label: "二專/五專" },
    { value: "university", label: "大學/二技" },
    { value: "master", label: "碩士" },
    { value: "doctor", label: "博士" },
    { value: "other", label: "其他" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">入會申請書</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          申請日期：中華民國{new Date().getFullYear() - 1911}年
          {new Date().getMonth() + 1}月{new Date().getDate()}日
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 基本資料 */}
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-semibold border-b pb-2">
              基本資料
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm sm:text-base font-medium"
                >
                  姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="請輸入您的姓名"
                  className="h-11 sm:h-11 text-sm"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="birthDate"
                  className="text-sm sm:text-base font-medium"
                >
                  出生年月日 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...register("birthDate")}
                  className="h-11 sm:h-11 text-sm"
                />
                {errors.birthDate && (
                  <p className="text-xs sm:text-sm text-destructive mt-1">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="idNumber"
                  className="text-sm sm:text-base font-medium"
                >
                  身分證號碼 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="idNumber"
                  {...register("idNumber")}
                  placeholder="請輸入身分證或居留證號"
                  className="h-11 sm:h-11 text-sm"
                />
                {errors.idNumber && (
                  <p className="text-xs sm:text-sm text-destructive mt-1">
                    {errors.idNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="gender"
                  className="text-sm sm:text-base font-medium"
                >
                  性別 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="gender"
                  {...register("gender")}
                  className="w-full border border-input bg-background px-3 py-2 h-11 text-sm ring-offset-background rounded-md"
                >
                  <option value="">請選擇性別</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
                {errors.gender && (
                  <p className="text-xs sm:text-sm text-destructive mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {watchGender === "other" && (
                <div>
                  <Label
                    htmlFor="genderOther"
                    className="text-sm sm:text-base font-medium"
                  >
                    其他性別說明
                  </Label>
                  <Input
                    id="genderOther"
                    {...register("genderOther")}
                    placeholder="請說明"
                    className="h-11 sm:h-11 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 學歷資料 */}
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-semibold border-b pb-2">
              學歷資料
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="education"
                  className="text-sm sm:text-base font-medium"
                >
                  最高學歷 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="education"
                  {...register("education")}
                  className="w-full border border-input bg-background px-3 py-2 h-11 text-sm ring-offset-background rounded-md"
                >
                  <option value="">請選擇最高學歷</option>
                  {educationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.education && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.education.message}
                  </p>
                )}
              </div>

              {watchEducation === "other" && (
                <div>
                  <Label
                    htmlFor="educationOther"
                    className="text-sm sm:text-base font-medium"
                  >
                    其他學歷說明
                  </Label>
                  <Input
                    id="educationOther"
                    {...register("educationOther")}
                    placeholder="請說明"
                    className="h-11 sm:h-11 text-sm"
                  />
                </div>
              )}

              <div>
                <Label
                  htmlFor="schoolName"
                  className="text-sm sm:text-base font-medium"
                >
                  學校名稱
                </Label>
                <Input
                  id="schoolName"
                  {...register("schoolName")}
                  placeholder="請輸入學校名稱"
                  className="h-11 sm:h-11 text-sm"
                />
              </div>

              <div>
                <Label
                  htmlFor="department"
                  className="text-sm sm:text-base font-medium"
                >
                  系所/科系
                </Label>
                <Input
                  id="department"
                  {...register("department")}
                  placeholder="請輸入系所或科系"
                  className="h-11 sm:h-11 text-sm"
                />
              </div>
            </div>
          </div>

          {/* 現職資料 */}
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-semibold border-b pb-2">
              現職資料
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="workUnit"
                  className="text-sm sm:text-base font-medium"
                >
                  服務單位
                </Label>
                <Input
                  id="workUnit"
                  {...register("workUnit")}
                  placeholder="請輸入服務單位"
                  className="h-11 sm:h-11 text-sm"
                />
              </div>

              <div>
                <Label
                  htmlFor="jobTitle"
                  className="text-sm sm:text-base font-medium"
                >
                  職稱
                </Label>
                <Input
                  id="jobTitle"
                  {...register("jobTitle")}
                  placeholder="請輸入職稱"
                  className="h-11 sm:h-11 text-sm"
                />
              </div>
            </div>
          </div>

          {/* 聯絡資料 */}
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-semibold border-b pb-2">
              聯絡資料
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="phone"
                  className="text-sm sm:text-base font-medium"
                >
                  手機號碼 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="例：0912345678"
                  className="h-11 sm:h-11 text-sm"
                />
                {errors.phone && (
                  <p className="text-xs sm:text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground">
                  我們將使用此號碼為您註冊好事道平台帳號
                </p>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-sm sm:text-base font-medium"
                >
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="例：example@email.com"
                  className="h-11 sm:h-11 text-sm"
                />
                {errors.email && (
                  <p className="text-xs sm:text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground">
                  審核結果將以Email通知
                </p>
              </div>

              <div className="md:col-span-2">
                <Label
                  htmlFor="address"
                  className="text-sm sm:text-base font-medium"
                >
                  聯絡地址 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="請輸入詳細地址"
                  className="h-11 sm:h-11 text-sm"
                />
                {errors.address && (
                  <p className="text-xs sm:text-sm text-destructive mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="lineId"
                  className="text-sm sm:text-base font-medium"
                >
                  LINE ID
                </Label>
                <Input
                  id="lineId"
                  {...register("lineId")}
                  placeholder="請輸入 LINE ID（選填）"
                  className="h-11 sm:h-11 text-sm"
                />
              </div>
            </div>
          </div>

          {/* 提交按鈕 - 懸浮動態效果 */}
          <div className="pt-6">
            <Button
              type="submit"
              variant="outline"
              disabled={isLoading}
              className="w-full h-11 sm:h-11 text-sm font-medium
                         transform transition-all duration-200 
                         hover:scale-105 hover:shadow-lg hover:-translate-y-0.5
                         active:scale-95 active:translate-y-0
                         group relative overflow-hidden
                         disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  處理中...
                </div>
              ) : (
                <>
                  <span className="relative z-10">提交申請並前往付款</span>
                  <span className="ml-2 transform transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-1">
                    💳
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
