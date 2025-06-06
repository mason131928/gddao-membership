import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "團體入會申請 - 好事道",
  description: "好事道團體會員入會申請系統",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        {/* 添加移動端視窗優化 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* 確保移動端可以完全滑動 */
            html, body {
              overflow-x: hidden;
              -webkit-overflow-scrolling: touch;
            }
            
            /* 移動端底部額外空間 */
            @media (max-width: 640px) {
              body {
                padding-bottom: env(safe-area-inset-bottom, 0px);
              }
            }
            
            /* 修復iOS Safari底部滑動問題 */
            body {
              position: relative;
              min-height: 100vh;
              min-height: -webkit-fill-available;
            }
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {/* 好事道 Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  {/* 好事道 Logo */}
                  <div className="w-10 h-10 relative">
                    <Image
                      src="/membership/logo.png"
                      alt="好事道 Logo"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">好事道</h1>
                </div>

                {/* 管理後台登入按鈕 */}
                <div className="flex items-center">
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                  >
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="hidden sm:block">管理後台</span>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* 主要內容 */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
