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