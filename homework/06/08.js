let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
  a.push(99); // 修改：直接操作記憶體中原本的陣列物件
  b = [100];  // 重新賦值：讓局部變數 b 指向一個全新的陣列，不影響外部的 listB
}

process(listA, listB);

console.log("listA:", listA);
console.log("listB:", listB);