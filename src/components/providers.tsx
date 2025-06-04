"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * React Query Providers 組件
 * 提供 QueryClient 配置和開發工具
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // 在組件內建立 QueryClient 以避免重複建立
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 查詢失敗時重試次數
            retry: 1,
            // 查詢過期時間（5分鐘）
            staleTime: 5 * 60 * 1000,
            // 快取時間（10分鐘）
            gcTime: 10 * 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 僅在開發環境顯示開發工具 */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
