function calculateTotal(cart, discountFunc) {
  // 將 cart 內所有數字相加
  const total = cart.reduce((sum, price) => sum + price, 0);
  // 將總和傳入 discountFunc 處理後回傳
  return discountFunc(total);
}

// 測試：傳入 [100, 200, 300] 並透過匿名函數扣除 50 元
const cartPrices = [100, 200, 300];
const finalTotal = calculateTotal(cartPrices, function(totalSum) {
  return totalSum - 50;
});

console.log(finalTotal);