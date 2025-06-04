import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
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
