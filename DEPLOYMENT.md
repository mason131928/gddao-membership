# 🚀 會員繳費系統部署指南

## 📋 部署前準備

### 1. 確認環境文件

```bash
# 檢查環境文件
ls .env.*

# 應該看到：
# .env.development  - 開發環境
# .env.staging      - 測試環境
# .env.production   - 正式環境
# .env.example      - 範例文件
```

### 2. 選擇並建構環境

```bash
# 正式環境 (推薦)
pnpm run build:production

# 測試環境
pnpm run build:staging

# 開發環境
pnpm run build:development
```

## 🖥️ 伺服器要求

- Node.js 18+
- PM2 (進程管理)
- Nginx (反向代理)

```bash
# 在伺服器上安裝必要軟體
npm install -g pm2
pm2 startup
```

## 🚀 部署方法

### 方法一：使用自動部署腳本（推薦）

```bash
# 部署到伺服器
./deploy.sh [使用者名稱] [伺服器IP]

# 範例
./deploy.sh root 123.456.789.0
./deploy.sh ubuntu gddao.com
```

### 方法二：手動部署

```bash
# 1. 上傳文件
rsync -avz .next/standalone/ user@server:/var/www/html/membership/
rsync -avz .next/static/ user@server:/var/www/html/membership/.next/static/
rsync -avz public/ user@server:/var/www/html/membership/public/
scp .env user@server:/var/www/html/membership/

# 2. 在伺服器上啟動服務
ssh user@server
cd /var/www/html/membership
pm2 start server.js --name membership
pm2 save
```

## ⚙️ Nginx 配置

在 `/etc/nginx/sites-available/gddao` 中加入：

```nginx
server {
    listen 80;
    server_name gddao.com;

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

```bash
# 重新載入 Nginx
sudo nginx -t
sudo systemctl reload nginx
```

## 🔍 驗證部署

### 檢查服務狀態

```bash
# 查看 PM2 狀態
pm2 status

# 查看應用程式日誌
pm2 logs membership

# 查看錯誤日誌
pm2 logs membership --err
```

### 測試網站

- 首頁：`https://gddao.com/membership`
- 管理後台：`https://gddao.com/membership/admin`

### 檢查 API 連接

開啟瀏覽器 Console，應該看到：

```
🌐 API Base URL: https://api.gddao.com
```

## 🛠️ 常見問題

### 1. 404 錯誤

```bash
# 檢查 Nginx 配置
sudo nginx -t
sudo systemctl status nginx
```

### 2. 服務無法啟動

```bash
# 檢查端口是否被佔用
netstat -tulpn | grep :3000

# 重啟服務
pm2 restart membership
```

### 3. API 連接失敗

```bash
# 檢查環境變數
cat /var/www/html/membership/.env

# 檢查後端 API 服務
curl https://api.gddao.com/api/membership/organizations
```

## 🔄 更新部署

```bash
# 1. 本地建構新版本
pnpm run build:production

# 2. 重新部署
./deploy.sh [使用者名稱] [伺服器IP]
```

## 📞 部署完成

✅ 部署成功後，訪問：`https://gddao.com/membership`
