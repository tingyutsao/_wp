import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../db';

// GET: 獲取排行榜
export async function GET() {
  const db = getDB(); // 🚀 讀取檔案
  const sortedLeaderboard = [...db.leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  return NextResponse.json(sortedLeaderboard);
}

// POST: 上傳分數 (維持每人僅保留最高分邏輯)
export async function POST(request: Request) {
  try {
    const { name, score } = await request.json();

    if (!name || typeof score !== 'number') {
      return NextResponse.json({ error: '無效的提交資料' }, { status: 400 });
    }

    const trimmedName = name.trim().slice(0, 10);
    const todayDate = new Date().toISOString().split('T')[0];
    const db = getDB(); // 🚀 讀取檔案

    const existingRecordIndex = db.leaderboard.findIndex(
      item => item.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingRecordIndex !== -1) {
      // 若打破自己的舊紀錄，更新並存檔
      if (score > db.leaderboard[existingRecordIndex].score) {
        db.leaderboard[existingRecordIndex].score = score;
        db.leaderboard[existingRecordIndex].date = todayDate;
        saveDB(db); // 🚀 儲存檔案
      }
    } else {
      // 新玩家直接寫入並存檔
      db.leaderboard.push({
        name: trimmedName,
        score,
        date: todayDate,
      });
      saveDB(db); // 🚀 儲存檔案
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server 錯誤' }, { status: 500 });
  }
}