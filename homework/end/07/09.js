const arr = ["Very long content here", "Another Very long content here", "3rd Very long content here"];

// 遍歷陣列，將每個字串切片前 10 個字元並加上 "..."
const previewArr = arr.map(str => {
    return str.substring(0, 10) + "...";
});

// 測試輸出
console.log(previewArr);