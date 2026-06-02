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