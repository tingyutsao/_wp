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