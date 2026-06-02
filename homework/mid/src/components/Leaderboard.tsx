'use client';

import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface Record {
  name: string;
  score: number;
  date: string;
}

interface LeaderboardProps {
  finalScore: number | null;
  currentUser: string | null;
  onSubmitted: () => void;
  triggerRefresh: number;
}

export default function Leaderboard({ finalScore, currentUser, onSubmitted, triggerRefresh }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<Record[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaderboard = async () => {
    const res = await fetch('/api/leaderboard');
    const data = await res.json();
    setLeaderboard(data);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [triggerRefresh]);

  // 當遊戲結束，且使用者已登入時，直接自動提交
  useEffect(() => {
    if (finalScore !== null && currentUser) {
      autoSubmitScore(currentUser, finalScore);
    }
  }, [finalScore, currentUser]);

  const autoSubmitScore = async (username: string, score: number) => {
    setSubmitting(true);
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, score }),
    });
    setSubmitting(false);
    onSubmitted();
    fetchLeaderboard();
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl text-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-yellow-400 w-6 h-6" />
        <h2 className="text-2xl font-black tracking-wide bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
          世界公開排行榜
        </h2>
      </div>

      {/* 未登入時的分數警示 */}
      {finalScore !== null && !currentUser && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm font-medium">
          ⚠️ 獲得了 {finalScore} 分！請先在右上方「登入/註冊」帳號，系統才能為您保存戰績至全球排行榜！
        </div>
      )}

      {submitting && (
        <div className="mb-4 text-center text-sm text-cyan-400 animate-pulse font-bold">
          正在自動同步分數至雲端伺服器...
        </div>
      )}

      {/* 排行名單 */}
      <div className="space-y-2">
        {leaderboard.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-xl border ${
              item.name === currentUser
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : index === 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-5 text-center font-bold">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </span>
              <span className={`font-semibold ${item.name === currentUser ? 'text-cyan-400 font-bold' : 'text-slate-200'}`}>
                {item.name} {item.name === currentUser && '(你)'}
              </span>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-cyan-400">{item.score} pts</div>
              <div className="text-[10px] text-slate-500">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}