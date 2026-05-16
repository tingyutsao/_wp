# Blog 系統程式碼詳解

## 目錄
1. [專案架構](#專案架構)
2. [資料庫 (db.js)](#資料庫-dbjs)
3. [伺服器端 (server.js)](#伺服器端-serverjs)
4. [視圖模板 (Views)](#視圖模板-views)
5. [安全性設計](#安全性設計)
6. [運行流程](#運行流程)

---

## 專案架構

```
blog/
├── db.js              # 資料庫連線與 Schema 定義
├── server.js          # Express 伺服器與所有路由
├── package.json       # 專案依賴配置
├── blog.db            # SQLite 資料庫檔案
└── views/             # EJS 模板目錄
    ├── index.ejs      # 首頁（個人/探索動態）
    ├── post.ejs       # 貼文詳情頁
    ├── new.ejs        # 新增貼文頁
    ├── profile.ejs    # 個人版面
    ├── login.ejs      # 登入頁
    └── register.ejs  # 註冊頁
```

---

## 資料庫 (db.js)

### 使用的套件
```javascript
const sqlite3 = require('sqlite3').verbose();
```
- **sqlite3**: Node.js 的 SQLite 資料庫驅動程式
- **verbose()**: 啟用詳細的除錯訊息

### 資料庫檔案位置
```javascript
const dbPath = path.join(__dirname, 'blog.db');
const db = new sqlite3.Database(dbPath);
```
- 使用相對路徑，資料庫檔案會建立在專案根目錄
- 如果檔案不存在，SQLite 會自動建立

### 資料表設計

#### users 表
```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 主鍵，自動遞增
  username TEXT UNIQUE NOT NULL,          -- 用戶名，唯一性約束
  password TEXT NOT NULL,                 -- 密碼（雜湊後儲存）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- 建立時間
)
```

#### posts 表
```sql
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,                    -- 貼文標題
  content TEXT NOT NULL,                  -- 貼文內容
  user_id INTEGER NOT NULL,              -- 關聯用戶 ID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)  -- 外鍵約束
)
```

### 重要特性
- 使用 `IF NOT EXISTS` 確保重複執行不會出錯
- `db.serialize()` 確保多個 SQL 語句依序執行
- 使用參數化查詢 (`?`) 防止 SQL 注入

---

## 伺服器端 (server.js)

### 依賴套件

| 套件 | 功能 |
|------|------|
| express | Web 框架 |
| body-parser | 解析 POST 請求體 |
| express-session | 會話管理 |
| bcryptjs | 密碼雜湊 |
| ./db | SQLite 資料庫模組 |

### 中間件配置

```javascript
app.set('view engine', 'ejs');           // 模板引擎
app.set('views', path.join(__dirname, 'views'));  // 模板目錄
app.use(bodyParser.urlencoded({ extended: true }));  // 解析表單
app.use(express.static('public'));       // 靜態檔案
```

### 會話配置
```javascript
app.use(session({
  secret: 'blog-secret-key',             // 用於簽署 session ID
  resave: false,                         // 不強制儲存未修改的 session
  saveUninitialized: false               // 不儲存未初始化的 session
}));
```

### 全域變數
```javascript
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});
```
- 將登入用戶資訊傳遞給所有模板
- 每個 EJS 檔案都能存取 `user` 變數

### 權限控制

#### requireLogin 中間件
```javascript
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}
```
- 保護需要登入的路由
- 未登入會重定向到登入頁面

---

### 路由詳解

#### 1. 首頁 - 我的動態 (`GET /`)
```javascript
app.get('/', requireLogin, (req, res) => {
  const sql = `SELECT posts.id, posts.title, posts.content,
               posts.created_at, users.id as user_id, users.username
               FROM posts
               LEFT JOIN users ON posts.user_id = users.id
               WHERE posts.user_id = ?
               ORDER BY posts.created_at DESC`;

  db.all(sql, [req.session.user.id], (err, posts) => {
    // 只顯示當前用戶的貼文
    res.render('index', { posts, page: 'home' });
  });
});
```
- 需要登入才能訪問
- 使用 `LEFT JOIN` 取得作者名稱
- 透過 `WHERE posts.user_id = ?` 過濾只顯示自己的貼文

#### 2. 探索頁面 (`GET /explore`)
```javascript
app.get('/explore', (req, res) => {
  // 顯示所有用戶的貼文（無 WHERE 條件）
  db.all(sql, (err, posts) => {
    res.render('index', { posts, page: 'explore' });
  });
});
```
- 不需要登入（可依需求改為 requireLogin）
- 顯示所有用戶的貼文

#### 3. 貼文詳情 (`GET /post/:id`)
```javascript
app.get('/post/:id', (req, res) => {
  // :id 是動態參數
  db.get(sql, [req.params.id], (err, post) => {
    // 判斷是否可以刪除
    const canDelete = req.session.user && req.session.user.id === post.user_id;
    res.render('post', { post, canDelete });
  });
});
```

#### 4. 個人版面 (`GET /profile/:id`)
```javascript
app.get('/profile/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  // 第一步：查詢用戶資料
  db.get(userSql, [userId], (err, profileUser) => {
    if (err || !profileUser) return res.status(404).send('User not found');

    // 第二步：查詢該用戶的貼文
    db.all(postsSql, [userId], (err, posts) => {
      const isOwnProfile = req.session.user && req.session.user.id === userId;
      res.render('profile', { profileUser, posts, isOwnProfile });
    });
  });
});
```
- 巢狀查詢：先查用戶資料，再查貼文

#### 5. 新增貼文 (`GET /new`, `POST /posts`)
```javascript
app.get('/new', requireLogin, (req, res) => {
  res.render('new');  // 顯示發文表單
});

app.post('/posts', requireLogin, (req, res) => {
  const { title, content } = req.body;
  // 插入時關聯當前用戶 ID
  db.run('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
    [title, content, req.session.user.id], (err) => {
    res.redirect('/');  // 發布後回到首頁
  });
});
```

#### 6. 刪除貼文 (`POST /post/:id/delete`)
```javascript
app.post('/post/:id/delete', requireLogin, (req, res) => {
  // 雙重驗證：确保是本人刪除
  db.run('DELETE FROM posts WHERE id = ? AND user_id = ?',
    [req.params.id, req.session.user.id], (err) => {
    res.redirect('/');
  });
});
```

#### 7. 用戶註冊 (`GET /register`, `POST /register`)
```javascript
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // 密碼雜湊（不可逆加密）
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword], (err) => {
    if (err) return res.render('register', { error: '帳號已存在' });
    res.redirect('/login');
  });
});
```

#### 8. 用戶登入 (`GET /login`, `POST /login`)
```javascript
app.post('/login', (req, res) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    // 密碼比對（雜湊值比對）
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.render('login', { error: '帳號或密碼錯誤' });
    }
    // 建立 session
    req.session.user = { id: user.id, username: user.username };
    res.redirect('/');
  });
});
```

#### 9. 登出 (`GET /logout`)
```javascript
app.get('/logout', (req, res) => {
  req.session.destroy();  // 銷毀 session
  res.redirect('/login');
});
```

---

## 視圖模板 (Views)

### EJS 語法說明

| 語法 | 說明 |
|------|------|
| `<%= %>` | 輸出 HTML 轉義後的變數 |
| `<%- %>` | 輸出原始 HTML（不轉義） |
| `<% %>` | 執行 JavaScript 程式碼 |
| `<% %>` + `forEach` | 迴圈遍历陣列 |

### Threads 風格設計重點

#### 1. 色彩配置
```css
background: #000;           /* 深色背景 */
color: #fff;                 /* 白色文字 */
border: 1px solid #2d2d2d;  /* 暗色邊框 */
```

#### 2. 頭像漸層
```css
background: linear-gradient(135deg, #6644ff, #ff44aa);
```
- 紫色到粉紅色的漸變效果

#### 3. 布局結構
```
+------------------+-------------------+-----------+
|    側邊欄        |     主內容區      |  右側欄   |
|   (280px)        |    (max 600px)    |  (350px)  |
+------------------+-------------------+-----------+
```

#### 4. 重要元素
- **sticky sidebar**: 側邊欄固定在視窗頂部
- **backdrop-filter**: 標題列毛玻璃效果
- **hover effects**: 互動式 hover 動畫

### 各頁面功能

#### index.ejs（首頁）
- 根據 `page` 變數顯示「我的動態」或「探索」
- 顯示發文框（點擊可跳轉到 /new）
- 迴圈渲染貼文列表
- 頭像和名稱可點擊（連結到 /profile/:id）

#### profile.ejs（個人版面）
- 顯示用戶資訊卡片（頭像、用戶名、加入時間）
- 顯示貼文數統計
- 列出該用戶所有貼文

#### post.ejs（貼文詳情）
- 顯示完整貼文標題和內容
- 顯示發文時間和作者資訊
- 顯示愛心、留言、按分享圖示
- 如有權限顯示刪除按鈕

#### new.ejs（發文頁面）
- 標題輸入欄
- 內容文字區域
- 取消和發布按鈕

#### login.ejs / register.ejs
- 表單驗證
- 錯誤訊息顯示
- 註冊/登入切換連結

---

## 安全性設計

### 1. SQL 注入防護
- 使用參數化查詢：`db.get('SELECT * WHERE id = ?', [id])`
- 不使用字串拼接 SQL

### 2. 密碼雜湊
- 使用 bcryptjs 進行單向雜湊
- 密碼雜湊後儲存，無法還原原始密碼
- 登入時使用 `bcrypt.compareSync()` 比對

### 3. Session 管理
- 使用 express-session 管理會話
- 登入後將用戶資訊存入 `req.session.user`
- 登出時銷毀 session

### 4. 權限驗證
- requireLogin 中間件保護需要登入的路由
- 刪除貼文時雙重驗證（URL 參數 + session 用戶 ID）

### 5. XSS 防護（模板層）
- 使用 `<%= %>` 輸出會自動 HTML 轉義
- 必要時使用 `<%- %>` 允許 HTML（已確保資料來源安全）

---

## 運行流程

### 首次運行
1. 執行 `npm install` 安裝依賴
2. 執行 `node server.js` 啟動伺服器
3. SQLite 自動建立 `blog.db` 檔案
4. 自動建立 `users` 和 `posts` 資料表

### 用戶操作流程

```
1. 訪問 http://localhost:3000
   ↓
2. 未登入 → 重定向到 /login
   ↓
3. 選擇「註冊」建立帳號
   ↓
4. 登入成功 → 重定向到 / (我的動態)
   ↓
5. 點擊「新增文章」或發文框 → /new
   ↓
6. 填寫標題和內容 → 提交 → POST /posts
   ↓
7. 貼文寫入資料庫 → 重定向到 /
   ↓
8. 可點擊「探索」查看所有用戶的貼文
   ↓
9. 點擊作者頭像/名稱 → /profile/:id 查看個人版面
```

### 資料流

```
瀏覽器請求 → Express 中間件 → 路由處理 → SQLite 查詢 → EJS 模板渲染 → HTML 回應
```

---

## 技術總結

| 項目 | 技術 |
|------|------|
| 後端框架 | Express.js |
| 資料庫 | SQLite3 |
| 模板引擎 | EJS |
| 會話管理 | express-session |
| 密碼加密 | bcryptjs |
| 前端風格 | Threads 風格（深色主題） |

此系統是一個完整的 MVC 架構範例，展示了：
- 後端路由設計
- 資料庫操作
- 模板引擎使用
- 用戶認證與權限控制
- 現代化的 UI 設計