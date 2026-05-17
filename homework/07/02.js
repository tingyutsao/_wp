const req = { body: { title: "JS教學", content: "內容在此", author: "Gemini" } };

// 使用一行程式碼解構賦值
const { title, content } = req.body;

// 測試輸出
console.log("標題:", title);
console.log("內容:", content);