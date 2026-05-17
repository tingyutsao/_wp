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