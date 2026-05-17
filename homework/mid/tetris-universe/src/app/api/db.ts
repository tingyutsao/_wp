import fs from 'fs';
import path from 'path';

// 將資料庫檔案定義在專案根目錄下的 db.json
const DB_FILE = path.join(process.cwd(), 'db.json');

interface DBData {
  users: Array<{ username: string; passwordHash: string }>;
  leaderboard: Array<{ name: string; score: number; date: string }>;
}

// 預設的初始資料
const initialData: DBData = {
  users: [
    { username: '方塊大師', passwordHash: 'password123' },
    { username: 'NextJS_Fan', passwordHash: 'retro2026' }
  ],
  leaderboard: [
    { name: '方塊大師', score: 8500, date: '2026-05-14' },
    { name: 'NextJS_Fan', score: 5400, date: '2026-05-16' },
  ]
};

// 讀取 JSON 檔案方法
export function getDB(): DBData {
  if (!fs.existsSync(DB_FILE)) {
    // 檔案不存在則初始化寫入
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (e) {
    // 預防 JSON 格式損壞，回傳初始狀態
    return initialData;
  }
}

// 寫入 JSON 檔案方法
export function saveDB(data: DBData) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}