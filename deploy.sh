#!/bin/bash

# GDDAO 會員繳費系統部署腳本
# 使用方法: ./deploy.sh [SERVER_USER] [SERVER_IP]

set -e  # 遇到錯誤立即停止

SERVER_USER=${1:-"root"}
SERVER_IP=${2:-"YOUR_SERVER_IP"}
DEPLOY_PATH="/var/www/html/membership"
LOCAL_BUILD_PATH=".next/standalone"

echo "🚀 開始部署會員繳費系統到 ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}"

# 1. 檢查建構文件是否存在
if [ ! -d "$LOCAL_BUILD_PATH" ]; then
    echo "❌ 找不到建構文件，請先執行 pnpm run build:production"
    exit 1
fi

echo "✅ 建構文件檢查完成"

# 2. 創建遠端目錄
echo "📁 創建遠端目錄..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${DEPLOY_PATH}"

# 3. 備份現有部署（如果存在）
echo "💾 備份現有部署..."
ssh ${SERVER_USER}@${SERVER_IP} "
    if [ -d ${DEPLOY_PATH}/server.js ]; then
        mv ${DEPLOY_PATH} ${DEPLOY_PATH}.backup.$(date +%Y%m%d_%H%M%S)
        mkdir -p ${DEPLOY_PATH}
    fi
"

# 4. 上傳 standalone 文件
echo "📤 上傳應用程式文件..."
rsync -avz --progress ${LOCAL_BUILD_PATH}/ ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/

# 5. 上傳靜態文件
echo "📤 上傳靜態文件..."
rsync -avz --progress .next/static/ ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/.next/static/

# 6. 上傳 public 文件
echo "📤 上傳 public 文件..."
rsync -avz --progress public/ ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/public/

# 7. 上傳環境配置
echo "📤 上傳環境配置..."
scp .env ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/

# 8. 設定文件權限
echo "🔒 設定文件權限..."
ssh ${SERVER_USER}@${SERVER_IP} "
    chown -R www-data:www-data ${DEPLOY_PATH}
    chmod -R 755 ${DEPLOY_PATH}
    chmod +x ${DEPLOY_PATH}/server.js
"

# 9. 安裝/重啟 PM2 服務
echo "🔄 重啟服務..."
ssh ${SERVER_USER}@${SERVER_IP} "
    cd ${DEPLOY_PATH}
    
    # 停止現有服務
    pm2 stop membership 2>/dev/null || true
    pm2 delete membership 2>/dev/null || true
    
    # 啟動新服務
    pm2 start server.js --name membership
    pm2 save
"

echo "✅ 部署完成！"
echo "🌐 網站：https://gddao.com/membership"
echo "📊 查看服務狀態：ssh ${SERVER_USER}@${SERVER_IP} 'pm2 status'"
echo "📝 查看日誌：ssh ${SERVER_USER}@${SERVER_IP} 'pm2 logs membership'" 