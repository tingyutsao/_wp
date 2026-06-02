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