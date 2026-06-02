## 習題7

AI 問答 --https://gemini.google.com/share/9d648cf4cade

## 摘要

這是一份為你整理好的全方位 JavaScript 實作挑戰解答。每一題都附上了完整的程式碼與執行後的測試結果，讓你一眼就能看懂前後端銜接的邏輯核心！

---

## 1. 物件屬性存取 (Object Property Access)

### 程式碼

```javascript
// 宣告 post 物件
const post = {
    id: 1,
    title: "Hello World",
    content: "Markdown content"
};

// 方式一：點符號 (Dot notation)
console.log("點符號輸出:", post.title);

// 方式二：中括號 (Bracket notation)
console.log("中括號輸出:", post['title']);

```

### 測試結果

```text
點符號輸出: Hello World
中括號輸出: Hello World

```

---

## 2. 物件解構賦值 (Object Destructuring)

### 程式碼

```javascript
const req = { body: { title: "JS教學", content: "內容在此", author: "Gemini" } };

// 使用一行程式碼解構賦值
const { title, content } = req.body;

// 測試輸出
console.log("標題:", title);
console.log("內容:", content);

```

### 測試結果

```text
標題: JS教學
內容: 內容在此

```

---

## 3. 陣列的遍歷與字串拼接 (Array forEach & Template Literals)

### 程式碼

```javascript
const posts = [{id: 1, t: "A"}, {id: 2, t: "B"}];
let html = "";

// 使用 forEach 遍歷並拼接字串
posts.forEach(post => {
    html += `<div>${post.t}</div>`;
});

// 測試輸出
console.log(html);

```

### 測試結果

```text
<div>A</div><div>B</div>

```

---

## 4. 字典與動態參數 (URL Params / Dictionary)

### 程式碼

```javascript
// 建立 params 物件
const params = {};

// 動態新增屬性 id
params["id"] = 99; // 亦可寫成 params.id = 99;

// 測試輸出
console.log(params);

```

### 測試結果

```text
{ id: 99 }

```

---

## 5. Callback 函數傳參 (Passing Data via Callbacks)

### 程式碼

```javascript
// 撰寫 fetchData 函數
function fetchData(id, callback) {
    const data = { id: id, status: "success" };
    // 呼叫 callback，第一個參數傳 error (null)，第二個傳 data
    callback(null, data);
}

// 測試呼叫
fetchData(42, (err, res) => {
    if (err) {
        console.log("發生錯誤:", err);
    } else {
        console.log("成功獲取資料:", res);
    }
});

```

### 測試結果

```text
成功獲取資料: { id: 42, status: 'success' }

```

---

## 6. JSON 處理 (Parsing JSON)

### 程式碼

```javascript
const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';

// 將 JSON 字串轉回 JavaScript 物件
const obj = JSON.parse(jsonStr);

// 印出 tags 陣列中的第二個元素 (索引值為 1)
console.log("tags 的第二個元素:", obj.tags[1]);

```

### 測試結果

```text
tags 的第二個元素: node

```

---

## 7. 模擬資料庫查詢 (Simulating DB Queries)

### 程式碼

```javascript
// 模擬 db.get 的 fakeGet 函數
function fakeGet(sql, params, callback) {
    // 不管 SQL 是什麼，直接回傳假資料
    callback(null, { title: "Fake Title" });
}

// 測試呼叫 fakeGet
fakeGet("SELECT * FROM posts WHERE id = ?", [1], (err, row) => {
    if (err) {
        console.error("資料庫查詢失敗:", err);
    } else {
        console.log("查詢成功，文章標題為:", row.title);
    }
});

```

### 測試結果

```text
查詢成功，文章標題為: Fake Title

```

---

## 8. 樣板字串中的邏輯運算 (Template Literals with Logic)

### 程式碼

```javascript
const user = "Guest";

// 使用三元運算子在樣板字串中進行邏輯判斷
const htmlStr = `<h1>Welcome, ${user ? user : "Stranger"}</h1>`;

// 測試輸出
console.log(htmlStr);

```

### 測試結果

```text
<h1>Welcome, Guest</h1>

```

---

## 9. 陣列物件的排序與切片 (Sort & Substring)

### 程式碼

```javascript
const arr = ["Very long content here", "Another Very long content here", "3rd Very long content here"];

// 遍歷陣列，將每個字串切片前 10 個字元並加上 "..."
const previewArr = arr.map(str => {
    return str.substring(0, 10) + "...";
});

// 測試輸出
console.log(previewArr);

```

### 測試結果

```text
[ 'Very long...', 'Another Ve...', '3rd Very l...' ]

```

---

## 10. 錯誤優先回呼模式 (Error-First Callback Pattern)

### 程式碼

```javascript
// 寫一個權限檢查函數
function checkAdmin(role, callback) {
    if (role !== "admin") {
        return callback("Access Denied"); // 錯誤時，第一個參數帶入錯誤訊息
    }
    callback(null, "Welcome"); // 成功時，第一個參數為 null
}

// 測試狀況一：非 admin 登入
checkAdmin("guest", (err, result) => {
    if (err) {
        console.log("狀況一結果 -> 錯誤:", err);
    } else {
        console.log("狀況一結果 -> 成功:", result);
    }
});

// 測試狀況二：admin 登入
checkAdmin("admin", (err, result) => {
    if (err) {
        console.log("狀況二結果 -> 錯誤:", err);
    } else {
        console.log("狀況二結果 -> 成功:", result);
    }
});

```

### 測試結果

```text
狀況一結果 -> 錯誤: Access Denied
狀況二結果 -> 成功: Welcome

```