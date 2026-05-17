// 寫一個權限檢查函數
function checkAdmin(role, callback) {
    if (role !== "admin") {
        return callback("Access Denied"); // 錯誤時，第一個參數帶入錯誤訊息
    }
    callback(null, "Welcome"); // 成功時，第一個參數為 null
}

// 測試狀況一：非 admin 登入
checkAdmin("guest", (err, result) => {
    if (err) {
        console.log("狀況一結果 -> 錯誤:", err);
    } else {
        console.log("狀況一結果 -> 成功:", result);
    }
});

// 測試狀況二：admin 登入
checkAdmin("admin", (err, result) => {
    if (err) {
        console.log("狀況二結果 -> 錯誤:", err);
    } else {
        console.log("狀況二結果 -> 成功:", result);
    }
});