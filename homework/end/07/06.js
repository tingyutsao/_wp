const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';

// 將 JSON 字串轉回 JavaScript 物件
const obj = JSON.parse(jsonStr);

// 印出 tags 陣列中的第二個元素 (索引值為 1)
console.log("tags 的第二個元素:", obj.tags[1]);