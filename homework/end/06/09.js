const textArray = ["Task", "Completed"];

// 2 秒 (2000毫秒) 後利用箭頭函數印出組合字串
setTimeout(() => {
  console.log(textArray.join(" "));
}, 2000);