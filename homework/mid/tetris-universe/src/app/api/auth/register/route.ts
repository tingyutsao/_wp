import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password || username.trim().length < 2) {
      return NextResponse.json({ error: '帳號或密碼格式不符（帳號需大於2字元）' }, { status: 400 });
    }

    const trimmedUsername = username.trim();
    const db = getDB(); // 🚀 讀取檔案
    
    const userExists = db.users.some(u => u.username.toLowerCase() === trimmedUsername.toLowerCase());
    
    if (userExists) {
      return NextResponse.json({ error: '該帳號已被註冊' }, { status: 400 });
    }

    // 將新用戶加入陣列並儲存至檔案
    db.users.push({ username: trimmedUsername, passwordHash: password });
    saveDB(db); // 🚀 寫入檔案

    return NextResponse.json({ success: true, username: trimmedUsername });
  } catch (err) {
    return NextResponse.json({ error: 'Server 錯誤' }, { status: 500 });
  }
}