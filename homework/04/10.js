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