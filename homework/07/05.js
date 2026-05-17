// 撰寫 fetchData 函數
function fetchData(id, callback) {
    const data = { id: id, status: "success" };
    // 呼叫 callback，第一個參數傳 error (null)，第二個傳 data
    callback(null, data);
}

// 測試呼叫
fetchData(42, (err, res) => {
    if (err) {
        console.log("發生錯誤:", err);
    } else {
        console.log("成功獲取資料:", res);
    }
});