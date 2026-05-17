'use client';

import React, { useState, useEffect } from 'react';
import TetrisGame from '@/components/TetrisGame';
import Leaderboard from '@/components/Leaderboard';
import AuthModal from '@/components/AuthModal';
import { RotateCcw, LogIn, LogOut, User } from 'lucide-react';

export default function Home() {
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [gameResetTrigger, setGameResetTrigger] = useState(0);
  const [leaderboardRefreshTrigger, setLeaderboardRefreshTrigger] = useState(0);
  
  // 會員登入狀態管理
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 網頁初始化時，從瀏覽器緩存讀取登入狀態
  useEffect(() => {
    const savedUser = localStorage.getItem('tetris_user');
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const handleAuthSuccess = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('tetris_user', username);
    setLeaderboardRefreshTrigger(prev => prev + 1); // 重新整理排行榜高亮
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tetris_user');
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
  };

  const handleScoreSubmitted = () => {
    setFinalScore(null);
    setLeaderboardRefreshTrigger(prev => prev + 1);
  };

  const forceRestart = () => {
    setFinalScore(null);
    setGameResetTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-12 gap-8 text-white">
      
      {/* 頂部導覽列：登入系統系統展示 */}
      <div className="w-full max-w-5xl flex justify-between items-center bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">Node.js API Server Online</span>
        </div>
        
        <div>
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700">
                <User size={14} className="text-cyan-400" />
                <span className="text-sm font-bold text-slate-200">{currentUser}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-xl border border-red-500/20 transition-all"
              >
                <LogOut size={14} /> 登出
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black px-5 py-2 rounded-xl text-sm shadow-lg shadow-cyan-500/10 active:scale-95 transition-all"
            >
              <LogIn size={16} /> 登入 / 註冊
            </button>
          )}
        </div>
      </div>

      <header className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          NEXT-TETRIS UNIVERSE
        </h1>
        <p className="text-slate-400 text-xs md:text-sm tracking-widest uppercase">
          使用鍵盤 <span className="text-cyan-400 font-bold">↑ 旋轉</span>，<span className="text-cyan-400 font-bold">← → 移動</span>
        </p>
      </header>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
        {/* 左側：方塊遊戲主體 */}
        <div className="relative">
          <TetrisGame onGameOver={handleGameOver} refreshTrigger={gameResetTrigger} />
          {(gameResetTrigger > 0 || finalScore !== null) && (
            <button
              onClick={forceRestart}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              title="重新開始"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>

        {/* 右側：排行榜 */}
        <Leaderboard
          finalScore={finalScore}
          currentUser={currentUser}
          onSubmitted={handleScoreSubmitted}
          triggerRefresh={leaderboardRefreshTrigger}
        />
      </div>

      {/* 認證視窗 */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </main>
  );
}