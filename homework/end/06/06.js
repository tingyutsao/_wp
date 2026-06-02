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