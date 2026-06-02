const cart = [
  { name: "滑鼠", price: 1200, count: 1 },
  { name: "鍵盤", price: 2500, count: 2 },
  { name: "耳機", price: 3200, count: 1 }
];

let total = 0;

for (let i = 0; i < cart.length; i++) {
  total += cart[i].price * cart[i].count;
}

console.log(`原始總金額為：${total} 元`);

if (total > 5000) {
  total = total * 0.9;
  console.log(`滿 5000 元享有 9 折優惠！最終結帳金額為：${total} 元`);
} else {
  console.log(`最終結帳金額為：${total} 元`);
}