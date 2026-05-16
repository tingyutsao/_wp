for (let i = 1; i <= 9; i++) {
  let row = "";
  for (let j = 1; j <= 9; j++) {
    let product = i * j;
    if (product % 3 === 0) {
      row += "X\t";
    } else {
      row += `${product}\t`;
    }
  }
  console.log(row);
}