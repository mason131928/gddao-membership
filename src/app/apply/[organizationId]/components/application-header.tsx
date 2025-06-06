/**
 * 申請頁面頭部組件
 * 包含返回按鈕和頁面標題
 */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ApplicationHeader() {
  const router = useRouter();

  return (
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
  );
}
