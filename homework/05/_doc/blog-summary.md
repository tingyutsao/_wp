# Blog 系統開發對話摘要

## 專案概述
使用 Node.js + Express + SQLite 開發的網誌系統，採用 Threads 風格的深色主題 UI。

## 功能列表

### 1. 基礎網誌功能
- 新增文章
- 瀏覽文章列表
- 檢視文章詳情
- 刪除自己的文章

### 2. 用戶認證系統
- 用戶註冊 (`/register`)
- 用戶登入 (`/login`)
- 用戶登出 (`/logout`)
- 密碼使用 bcryptjs 雜湊儲存

### 3. Threads 風格 UI
- 深色主題 (`background: #000`)
- 側邊導航欄
- 個人貼文區 (`/`) - 只顯示自己的貼文
- 公共探索區 (`/explore`) - 顯示所有用戶的貼文
- 漸層頭像 (`linear-gradient(135deg, #6644ff, #ff44aa)`)

### 4. 個人版面
- 點擊作者頭像或名稱可進入作者個人版面 (`/profile/:id`)
- 顯示用戶資訊（頭像、用戶名、加入時間）
- 顯示用戶所有貼文數量

### 5. 權限控制
- 必須登入才能訪問首頁
- 必須登入才能發文
- 只能刪除自己的文章

## 技術堆疊
- **後端**: Express.js, express-session, bcryptjs
- **資料庫**: SQLite3
- **模板引擎**: EJS
- **前端**: 原生 HTML/CSS（Threads 風格）

## 檔案結構
```
blog/
├── db.js          # SQLite 資料庫連線與 schema
├── server.js      # Express 伺服器與路由
├── package.json   # 專案依賴
├── views/
│   ├── index.ejs      # 首頁（個人/探索動態）
│   ├── post.ejs       # 貼文詳情頁
│   ├── new.ejs        # 新增貼文頁
│   ├── profile.ejs    # 個人版面
│   ├── login.ejs      # 登入頁
│   └── register.ejs   # 註冊頁
└── blog.db        # SQLite 資料庫檔案
```

## 更新紀錄
1. 初始建立簡易網誌系統
2. 加入用戶註冊/登入/登出功能
3. 改造成 Threads 風格 UI（深色主題、雙欄布局）
4. 新增探索頁面（公共貼文區）
5. 新增個人版面功能（可點擊作者查看）
6. 更新 .gitignore 加入 node_modules 和 blog.db

## 啟動方式
```bash
cd blog
npm start
```
伺服器運行於 http://localhost:3000