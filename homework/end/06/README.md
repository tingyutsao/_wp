## 習題6

AI 問答 --https://gemini.google.com/share/caf18e32d669

## 摘要

這是一份針對你提供的 JavaScript 函數實作練習題的完整解答與測試結果。每題皆依要求先列出程式碼，再呈現執行結果。

---

## 1. Callback 基礎實作

### 程式碼

```javascript
function mathTool(num1, num2, action) {
  return action(num1, num2);
}

// 測試：傳入匿名的「相加」與「相減」函數
const addResult = mathTool(10, 5, function(a, b) {
  return a + b;
});

const subResult = mathTool(10, 5, function(a, b) {
  return a - b;
});

console.log(`${addResult}, ${subResult}`);

```

### 執行結果

```text
15, 5

```

---

## 2. 匿名函數與立即執行 (IIFE)

### 程式碼

```javascript
(function() {
  let count = 100;
  console.log("Count is: " + count);
})();

// 驗證外部是否無法存取
try {
  console.log(count);
} catch (error) {
  console.log("外部存取失敗原因: " + error.message);
}

```

### 執行結果

```text
Count is: 100
外部存取失敗原因: count is not defined

```

---

## 3. 箭頭函數與陣列轉換

### 程式碼

```javascript
const prices = [100, 200, 300, 400];

// 使用單行箭頭函數進行 8 折轉換
const discountedPrices = prices.map(price => price * 0.8);

console.log(discountedPrices);

```

### 執行結果

```text
[ 80, 160, 240, 320 ]

```

---

## 4. 陣列參數的「破壞性修改」

### 程式碼

```javascript
function cleanData(arr) {
  arr.pop();         // 移除最後一個元素
  arr.unshift("Start"); // 在最前面加上 "Start"
}

let myData = [1, 2, 3];
cleanData(myData);

console.log(myData);

```

### 執行結果

```text
[ 'Start', 1, 2 ]

```

> **觀念提醒**：陣列在 JavaScript 中是透過「引用（傳址）」傳遞的，因此函數內部的 `pop` 與 `unshift` 會直接修改到外部原始的 `myData` 陣列。

---

## 5. 函數回傳函數 (Higher-Order Function)

### 程式碼

```javascript
function multiplier(factor) {
  // 回傳一個箭頭函數
  return (n) => n * factor;
}

const double = multiplier(2);
console.log(double(10)); // 預期輸出 20

```

### 執行結果

```text
20

```

---

## 6. Callback 篩選器

### 程式碼

```javascript
function myFilter(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    // 如果 callback 回傳 true，就把元素放進新陣列
    if (callback(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}

// 測試：篩選出大於 7 的數字
const numbers = [1, 5, 8, 12];
const filteredNumbers = myFilter(numbers, (num) => num > 7);

console.log(filteredNumbers);

```

### 執行結果

```text
[ 8, 12 ]

```

---

## 7. 箭頭函數處理物件

### 程式碼

```javascript
const users = [
  { name: "Alice", age: 25 }, 
  { name: "Bob", age: 17 }
];

// 篩選出 age 大於或等於 18 的人
const adults = users.filter(user => user.age >= 18);

console.log(adults);

```

### 執行結果

```text
[ { name: 'Alice', age: 25 } ]

```

---

## 8. 參數傳址陷阱：重新賦值 vs 修改

### 程式碼與答案解析

```javascript
let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
  a.push(99); // 修改：直接操作記憶體中原本的陣列物件
  b = [100];  // 重新賦值：讓局部變數 b 指向一個全新的陣列，不影響外部的 listB
}

process(listA, listB);

console.log("listA:", listA);
console.log("listB:", listB);

```

### 執行結果

```text
listA: [ 1, 2, 99 ]
listB: [ 3, 4 ]

```

* **為什麼 `listA` 變了？** 因為 `listA` 與參數 `a` 指向同一個陣列，`a.push(99)` 是對該物件進行「修改（Mutation）」，所以外部的 `listA` 內容隨之改變。
* **為什麼 `listB` 沒變？** 因為 `b = [100]` 是對參數 `b` 進行「重新賦值（Reassignment）」。這只會切斷 `b` 與 `listB` 的共享關係，讓 `b` 指向新陣列，而外部的 `listB` 依舊指向原本的 `[3, 4]`。

---

## 9. 延遲執行的 Callback

### 程式碼

```javascript
const textArray = ["Task", "Completed"];

// 2 秒 (2000毫秒) 後利用箭頭函數印出組合字串
setTimeout(() => {
  console.log(textArray.join(" "));
}, 2000);

```

### 執行結果 (2秒後顯示)

```text
Task Completed

```

---

## 10. 綜合應用：計算總價

### 程式碼

```javascript
function calculateTotal(cart, discountFunc) {
  // 將 cart 內所有數字相加
  const total = cart.reduce((sum, price) => sum + price, 0);
  // 將總和傳入 discountFunc 處理後回傳
  return discountFunc(total);
}

// 測試：傳入 [100, 200, 300] 並透過匿名函數扣除 50 元
const cartPrices = [100, 200, 300];
const finalTotal = calculateTotal(cartPrices, function(totalSum) {
  return totalSum - 50;
});

console.log(finalTotal);

```

### 執行結果

```text
550

```