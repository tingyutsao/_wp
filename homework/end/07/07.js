// 模擬 db.get 的 fakeGet 函數
function fakeGet(sql, params, callback) {
    // 不管 SQL 是什麼，直接回傳假資料
    callback(null, { title: "Fake Title" });
}

// 測試呼叫 fakeGet
fakeGet("SELECT * FROM posts WHERE id = ?", [1], (err, row) => {
    if (err) {
        console.error("資料庫查詢失敗:", err);
    } else {
        console.log("查詢成功，文章標題為:", row.title);
    }
});