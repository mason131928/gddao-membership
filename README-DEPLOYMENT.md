# GDDAO 會員繳費系統部署指南

## 📋 概述

此系統為 GDDAO 會員繳費管理平台，基於 Next.js 15 + React 19 + TypeScript 構建。

## 🌍 環境配置

### 環境變數設定

創建 `.env.local` 文件：

```bash
# 正式環境（預設）
NEXT_PUBLIC_API_BASE_URL=https://api.gddao.com

# 開發環境
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# 測試環境
# NEXT_PUBLIC_API_BASE_URL=https://test-api.gddao.com
```

## 🚀 部署步驟

### 1. 建構應用程式

```bash
# 進入專案目錄
cd membership

# 安裝依賴
pnpm install

# 建構正式版本
pnpm build

# 針對不同環境建構
NEXT_PUBLIC_API_BASE_URL=https://test-api.gddao.com pnpm build  # 測試環境
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 pnpm build       # 開發環境
```

### 2. 部署到伺服器 (/var/www/html/membership)

#### 使用 standalone 模式（推薦）

```bash
# 上傳建構檔案
scp -r .next/standalone/* user@server:/var/www/html/membership/
scp -r .next/static user@server:/var/www/html/membership/.next/
scp -r public user@server:/var/www/html/membership/

# 在伺服器上啟動
cd /var/www/html/membership
node server.js

# 使用 PM2 管理
pm2 start server.js --name membership
```

### 3. Nginx 配置

```nginx
server {
    listen 80;
    server_name gddao.com;

    # 會員繳費系統
    location /membership {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 環境特定配置

### 快速部署腳本

```bash
# 正式環境
echo "NEXT_PUBLIC_API_BASE_URL=https://api.gddao.com" > .env.local
pnpm build

# 測試環境
echo "NEXT_PUBLIC_API_BASE_URL=https://test-api.gddao.com" > .env.local
pnpm build

# 開發環境
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local
pnpm build
```

## 🔍 驗證部署

### 測試頁面

- **首頁**: `https://gddao.com/membership`
- **管理後台**: `https://gddao.com/membership/admin`

### 檢查 API 連接

開啟瀏覽器 Console，應該看到：

```
🌐 API Base URL: https://api.gddao.com
```

## 🛠️ 故障排除

### 常見問題

1. **404 錯誤**: 檢查 Nginx 代理配置
2. **API 連接失敗**: 確認環境變數設定正確
3. **服務無法啟動**: 檢查端口 3000 是否被佔用

### 檢查配置

```bash
# 檢查環境變數
cat .env.local

# 檢查服務狀態
pm2 status membership

# 檢查日誌
pm2 logs membership
```

## 📞 部署總結

1. 設定正確的 `NEXT_PUBLIC_API_BASE_URL` 在 `.env.local`
2. 執行 `pnpm build` 建構應用程式
3. 上傳到 `/var/www/html/membership`
4. 設定 Nginx 代理到 `localhost:3000`
5. 啟動服務 `node server.js` 或使用 PM2

路由設定：`gddao.com/membership` → Next.js 應用程式
