const user = "Guest";

// 使用三元運算子在樣板字串中進行邏輯判斷
const htmlStr = `<h1>Welcome, ${user ? user : "Stranger"}</h1>`;

// 測試輸出
console.log(htmlStr);