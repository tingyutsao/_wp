## 習題 4

AI 問答 -- https://gemini.google.com/share/14328cd393c9

## 摘要

這裡整理出這 10 道題目的完整程式碼，並附上在主控台（Console）實際執行後的輸出結果。

---

## 基礎邏輯與流程控制

### 1. 溫標轉換與提示器

```javascript
function convertTemperature(degree, type) {
  let celsius;
  let result;

  if (type === "C") {
    celsius = degree;
    result = degree * (9 / 5) + 32;
    console.log(`攝氏 ${degree}°C 轉換為華氏為 ${result.toFixed(1)}°F`);
  } else if (type === "F") {
    result = (degree - 32) * (5 / 9);
    celsius = result;
    console.log(`華氏 ${degree}°F 轉換為攝氏為 ${result.toFixed(1)}°C`);
  } else {
    console.log("未知的溫度類型，請輸入 'C' 或 'F'");
    return;
  }

  if (celsius > 30) {
    console.log("天氣好熱！");
  } else if (celsius < 15) {
    console.log("天氣好冷！");
  }
}

convertTemperature(35, "C");
convertTemperature(50, "F");

```

**執行結果：**

```text
攝氏 35°C 轉換為華氏為 95.0°F
天氣好熱！
華氏 50°F 轉換為攝氏為 10.0°C
天氣好冷！

```

---

### 2. 終極密碼猜測計數（模擬）

> 註：因包含 `Math.random()`，每次執行的猜測次數與數字皆隨機產生，以下為其中一次的模擬輸出。

```javascript
const target = 77;
let count = 0;
let guess = 0;

while (guess !== target) {
  guess = Math.floor(Math.random() * 100) + 1;
  count++;
  
  console.log(`第 ${count} 次猜測：${guess}`);

  if (guess === target) {
    console.log(`恭喜答對！共猜了 ${count} 次`);
  } else if (guess > target) {
    console.log("太大了");
  } else {
    console.log("太小了");
  }
}

```

**執行結果（隨機範例）：**

```text
第 1 次猜測：42
太小了
第 2 次猜測：85
太大了
第 3 次猜測：12
太小了
第 4 次猜測：77
恭喜答對！共猜了 4 次

```

---

### 3. 九九乘法表特定倍數跳過

```javascript
for (let i = 1; i <= 9; i++) {
  let row = "";
  for (let j = 1; j <= 9; j++) {
    let product = i * j;
    if (product % 3 === 0) {
      row += "X\t";
    } else {
      row += `${product}\t`;
    }
  }
  console.log(row);
}

```

**執行結果：**

```text
1	2	X	4	5	X	7	8	X	
2	4	X	8	10	X	14	16	X	
X	X	X	X	X	X	X	X	X	
4	8	X	16	20	X	28	32	X	
5	10	X	20	25	X	35	40	X	
X	X	X	X	X	X	X	X	X	
7	14	X	28	35	X	49	56	X	
8	16	X	32	40	X	56	64	X	
X	X	X	X	X	X	X	X	X	

```

---

## 陣列與物件操作

### 4. 陣列數字統計大師

```javascript
function analyzeNumbers(arr) {
  if (arr.length === 0) return "陣列不能為空";

  let max = arr[0];
  let min = arr[0];
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
    sum += arr[i];
  }

  let avg = sum / arr.length;

  return {
    max: max,
    min: min,
    avg: Number(avg.toFixed(2))
  };
}

const demoNumbers = [12, 45, 7, 23, 56, 89];
console.log(analyzeNumbers(demoNumbers));

```

**執行結果：**

```json
{ "max": 89, "min": 7, "avg": 38.67 }

```

---

### 5. 打造個人名片與自我介紹

```javascript
const user = {
  name: "小明",
  age: 20,
  skills: ["JavaScript", "HTML", "CSS", "Python"],
  introduce: function() {
    const skillsString = this.skills.join(", ");
    console.log(`大家好，我是 ${this.name}，今年 ${this.age} 歲，我擅長的技能有：${skillsString}`);
  }
};

user.introduce();

```

**執行結果：**

```text
大家好，我是 小明，今年 20 歲，我擅長的技能有：JavaScript, HTML, CSS, Python

```

---

### 6. 購物車總金額與折扣計算

```javascript
const cart = [
  { name: "滑鼠", price: 1200, count: 1 },
  { name: "鍵盤", price: 2500, count: 2 },
  { name: "耳機", price: 3200, count: 1 }
];

let total = 0;

for (let i = 0; i < cart.length; i++) {
  total += cart[i].price * cart[i].count;
}

console.log(`原始總金額為：${total} 元`);

if (total > 5000) {
  total = total * 0.9;
  console.log(`滿 5000 元享有 9 折優惠！最終結帳金額為：${total} 元`);
} else {
  console.log(`最終結帳金額為：${total} 元`);
}

```

**執行結果：**

```text
原始總金額為：9400 元
滿 5000 元享有 9 折優惠！最終結帳金額為：8460 元

```

---

## JSON 與資料處理進階

### 7. JSON 員工資料庫篩選

```javascript
const jsonString = '[{"name":"Alex","dept":"IT","salary":60000},{"name":"Bob","dept":"HR","salary":45000},{"name":"Chris","dept":"IT","salary":55000}]';

const employees = JSON.parse(jsonString);
const highPaidIT = [];

for (let i = 0; i < employees.length; i++) {
  if (employees[i].dept === "IT" && employees[i].salary > 50000) {
    highPaidIT.push(employees[i].name);
  }
}

console.log("符合條件的 IT 員工名單：", highPaidIT);

```

**執行結果：**

```text
符合條件的 IT 員工名單： [ 'Alex', 'Chris' ]

```

---

### 8. 課堂成績不合格名單（物件轉 JSON）

```javascript
const students = {
  Tom: 85,
  Jerry: 52,
  Emily: 78,
  David: 59
};

const failedStudents = {};

for (let key in students) {
  if (students[key] < 60) {
    failedStudents[key] = students[key];
  }
}

const jsonResult = JSON.stringify(failedStudents);
console.log(jsonResult);

```

**執行結果：**

```json
"{"Jerry":52,"David":59}"

```

---

## 綜合實戰挑戰

### 9. 陣列元素去重與計數器

```javascript
function countFruits(fruitArray) {
  const counter = {};

  for (let i = 0; i < fruitArray.length; i++) {
    let fruit = fruitArray[i];
    if (counter[fruit]) {
      counter[fruit]++;
    } else {
      counter[fruit] = 1;
    }
  }

  return counter;
}

const data = ["apple", "banana", "apple", "orange", "banana", "apple"];
console.log(countFruits(data));

```

**執行結果：**

```json
{ "apple": 3, "banana": 2, "orange": 1 }

```

---

### 10. 費氏數列產生器（直到指定上限）

```javascript
function generateFibonacci(maxNum) {
  if (maxNum < 0) return [];
  if (maxNum === 0) return [0];

  const fib = [0, 1];

  while (true) {
    let nextNum = fib[fib.length - 1] + fib[fib.length - 2];
    if (nextNum > maxNum) {
      break;
    }
    fib.push(nextNum);
  }

  return fib;
}

console.log(generateFibonacci(10));
console.log(generateFibonacci(100));

```

**執行結果：**

```text
[ 0, 1, 1, 2, 3, 5, 8 ]
[ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 ]

```