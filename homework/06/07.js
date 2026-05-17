const users = [
  { name: "Alice", age: 25 }, 
  { name: "Bob", age: 17 }
];

// 篩選出 age 大於或等於 18 的人
const adults = users.filter(user => user.age >= 18);

console.log(adults);