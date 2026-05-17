import { NextResponse } from 'next/server';
import { getDB } from '../../db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const db = getDB(); // 🚀 讀取檔案
    
    const user = db.users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.passwordHash === password
    );

    if (!user) {
      return NextResponse.json({ error: '帳號或密碼錯誤' }, { status: 401 });
    }

    return NextResponse.json({ success: true, username: user.username });
  } catch (err) {
    return NextResponse.json({ error: 'Server 錯誤' }, { status: 500 });
  }
}