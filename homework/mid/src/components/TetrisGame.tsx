'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '@/hooks/useInterval';
import { Palette } from 'lucide-react';

const ROW = 20;
const COL = 10;

// 定義方塊形狀與顏色
const SHAPES = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' },
};

type ShapeKey = keyof typeof SHAPES;

// 🚀【新增：可切換的背景主題清單】
const THEMES = {
  cyberpunk: {
    name: '賽博暗黑',
    panelBg: 'bg-slate-900 border-slate-700 shadow-cyan-950/20',
    gridBg: 'bg-slate-950',
    cellEmpty: 'bg-slate-900/40',
    decorLine: 'via-cyan-500',
    text: 'text-cyan-400'
  },
  neonPurple: {
    name: '霓虹深紫',
    panelBg: 'bg-zinc-900 border-purple-900/60 shadow-fuchsia-950/20',
    gridBg: 'bg-purple-950/20',
    cellEmpty: 'bg-purple-950/10',
    decorLine: 'via-fuchsia-500',
    text: 'text-fuchsia-400'
  },
  matrixGreen: {
    name: '駭客任務',
    panelBg: 'bg-stone-900 border-emerald-900/60 shadow-emerald-950/20',
    gridBg: 'bg-stone-950',
    cellEmpty: 'bg-emerald-950/10',
    decorLine: 'via-emerald-500',
    text: 'text-emerald-400'
  },
  spaceBlue: {
    name: '星際深藍',
    panelBg: 'bg-slate-900 border-blue-900/60 shadow-blue-950/20',
    gridBg: 'bg-blue-950/30',
    cellEmpty: 'bg-blue-950/10',
    decorLine: 'via-blue-500',
    text: 'text-blue-400'
  }
};

type ThemeKey = keyof typeof THEMES;

// 依據方塊主色，動態生成對應的半透明虛線邊框影子樣式
const getGhostClass = (color: string) => {
  if (color.includes('bg-cyan-500')) return 'border-2 border-dashed border-cyan-500/80 bg-cyan-500/10';
  if (color.includes('bg-yellow-500')) return 'border-2 border-dashed border-yellow-500/80 bg-yellow-500/10';
  if (color.includes('bg-purple-500')) return 'border-2 border-dashed border-purple-500/80 bg-purple-500/10';
  if (color.includes('bg-green-500')) return 'border-2 border-dashed border-green-500/80 bg-green-500/10';
  if (color.includes('bg-red-500')) return 'border-2 border-dashed border-red-500/80 bg-red-500/10';
  if (color.includes('bg-blue-500')) return 'border-2 border-dashed border-blue-500/80 bg-blue-500/10';
  if (color.includes('bg-orange-500')) return 'border-2 border-dashed border-orange-500/80 bg-orange-500/10';
  return 'border-2 border-dashed border-slate-400/50 bg-slate-400/10';
};

interface TetrisGameProps {
  onGameOver: (finalScore: number) => void;
  refreshTrigger: number;
}

export default function TetrisGame({ onGameOver, refreshTrigger }: TetrisGameProps) {
  const createGrid = () => Array(ROW).fill(null).map(() => Array(COL).fill(null).map(() => ({ filled: false, color: '' })));
  
  const [grid, setGrid] = useState(createGrid());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 🚀【新增：當前背景主題狀態，預設為經典賽博暗黑】
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('cyberpunk');
  
  const [combo, setCombo] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [effect, setEffect] = useState<{ text: string; type: 'normal' | 'epic'; id: number } | null>(null);

  const [currentPiece, setCurrentPiece] = useState({
    shape: SHAPES.I.shape,
    color: SHAPES.I.color,
    x: 3,
    y: 0,
  });

  const spawnPiece = useCallback(() => {
    const keys = Object.keys(SHAPES) as ShapeKey[];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const piece = SHAPES[randomKey];
    
    setCurrentPiece({
      shape: piece.shape,
      color: piece.color,
      x: Math.floor((COL - piece.shape[0].length) / 2),
      y: 0,
    });
  }, []);

  const resetGame = useCallback(() => {
    setGrid(createGrid());
    setScore(0);
    setCombo(0);
    setEffect(null);
    setGameOver(false);
    setIsPlaying(true);
    spawnPiece();
  }, [spawnPiece]);

  useEffect(() => {
    if (refreshTrigger > 0) resetGame();
  }, [refreshTrigger, resetGame]);

  useEffect(() => {
    if (effect) {
      const timer = setTimeout(() => setEffect(null), 1100);
      return () => clearTimeout(timer);
    }
  }, [effect]);

  const checkCollision = (nx: number, ny: number, currentShape: number[][]) => {
    for (let r = 0; r < currentShape.length; r++) {
      for (let c = 0; c < currentShape[r].length; c++) {
        if (currentShape[r][c]) {
          const nextX = nx + c;
          const nextY = ny + r;
          if (nextX < 0 || nextX >= COL || nextY >= ROW) return true;
          if (nextY >= 0 && grid[nextY][nextX].filled) return true;
        }
      }
    }
    return false;
  };

  const mergeToGrid = () => {
    const newGrid = grid.map(row => [...row]);

    currentPiece.shape.forEach((rowArr, r) => {
      rowArr.forEach((value, c) => {
        if (value) {
          const targetY = currentPiece.y + r;
          const targetX = currentPiece.x + c;
          if (targetY >= 0 && targetY < ROW) {
            newGrid[targetY][targetX] = { filled: true, color: currentPiece.color };
          }
        }
      });
    });

    let linesCleared = 0;
    const filteredGrid = newGrid.filter(row => {
      const isFull = row.every(cell => cell.filled);
      if (isFull) linesCleared++;
      return !isFull;
    });

    while (filteredGrid.length < ROW) {
      filteredGrid.unshift(Array(COL).fill(null).map(() => ({ filled: false, color: '' })));
    }

    let scoreMultiplier = linesCleared * 100 * linesCleared;
    
    if (linesCleared > 0) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 350);

      if (combo > 0) {
        scoreMultiplier += combo * 50;
      }

      let titleText = '';
      let isEpic = false;

      if (linesCleared === 4) {
        titleText = '👑 TETRIS! 👑';
        isEpic = true;
      } else if (linesCleared === 3) {
        titleText = '✨ Excellent! ✨';
        isEpic = true;
      } else if (linesCleared === 2) {
        titleText = '⚡ Double! ⚡';
      } else {
        titleText = combo > 0 ? 'Good!' : '';
      }

      let finalText = titleText;
      if (combo > 0) {
        finalText = finalText ? `${finalText}\nCombo × ${combo}!` : `Combo × ${combo}!`;
      }

      if (finalText) {
        setEffect({
          text: finalText,
          type: isEpic ? 'epic' : 'normal',
          id: Date.now()
        });
      }

      setCombo(prev => prev + 1);
    } else {
      setCombo(0);
    }

    const newScore = score + scoreMultiplier;
    setScore(newScore);
    setGrid(filteredGrid);

    const isHitTop = currentPiece.y === 0 || filteredGrid[0].some(cell => cell.filled);

    if (isHitTop) {
      setGameOver(true);
      setIsPlaying(false);
      onGameOver(newScore);
      return;
    }

    spawnPiece();
  };

  const moveDown = () => {
    if (gameOver || !isPlaying) return;
    if (!checkCollision(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
      setCurrentPiece(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      mergeToGrid();
    }
  };

  useInterval(moveDown, isPlaying ? 800 : null);

  const moveHorizontal = (dir: number) => {
    if (!checkCollision(currentPiece.x + dir, currentPiece.y, currentPiece.shape)) {
      setCurrentPiece(prev => ({ ...prev, x: prev.x + dir }));
    }
  };

  const rotatePiece = () => {
    const nextShape = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );
    if (!checkCollision(currentPiece.x, currentPiece.y, nextShape)) {
      setCurrentPiece(prev => ({ ...prev, shape: nextShape }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      
      if (e.key === 'ArrowLeft') { e.preventDefault(); moveHorizontal(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); moveHorizontal(1); }
      if (e.key === 'ArrowDown') { e.preventDefault(); moveDown(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); rotatePiece(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, currentPiece, grid]);

  const renderDisplayGrid = () => {
    const display = grid.map(row => row.map(cell => ({ ...cell, isGhost: false, rawColor: '' })));
    
    if (isPlaying && !gameOver) {
      let ghostY = currentPiece.y;
      while (!checkCollision(currentPiece.x, ghostY + 1, currentPiece.shape)) {
        ghostY++;
      }

      currentPiece.shape.forEach((rowArr, r) => {
        rowArr.forEach((value, c) => {
          if (value) {
            const y = ghostY + r;
            const x = currentPiece.x + c;
            if (y >= 0 && y < ROW && x >= 0 && x < COL) {
              display[y][x] = { filled: true, color: '', isGhost: true, rawColor: currentPiece.color };
            }
          }
        });
      });

      currentPiece.shape.forEach((rowArr, r) => {
        rowArr.forEach((value, c) => {
          if (value) {
            const y = currentPiece.y + r;
            const x = currentPiece.x + c;
            if (y >= 0 && y < ROW && x >= 0 && x < COL) {
              display[y][x] = { filled: true, color: currentPiece.color, isGhost: false, rawColor: '' };
            }
          }
        });
      });
    }
    return display;
  };

  // 獲取當前選取的主題樣式物件
  const theme = THEMES[currentTheme];

  return (
    <div className={`flex flex-col items-center gap-4 p-6 rounded-2xl border shadow-2xl relative overflow-hidden w-full max-w-sm transition-all duration-300 ${theme.panelBg}`}>
      
      {/* 注入浮空動畫與閃爍邊框的自訂 CSS */}
      <style>{`
        @keyframes floatAndFade {
          0% { transform: scale(0.5) translateY(40px); opacity: 0; }
          15% { transform: scale(1.1) translateY(0); opacity: 1; }
          75% { transform: scale(1) translateY(-10px); opacity: 1; }
          100% { transform: scale(0.8) translateY(-40px); opacity: 0; }
        }
        .animate-float-text {
          animation: floatAndFade 1.1s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
        }
      `}</style>

      {/* 動態霓虹背景頂線 */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent to-transparent blur-sm transition-all duration-300 ${theme.decorLine}`} />

      {/* 🚀【新功能：主題切換按鈕區塊】 */}
      <div className="w-full flex items-center justify-between bg-slate-950/40 border border-slate-800/50 px-3 py-1.5 rounded-xl mb-1 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold font-mono">
          <Palette size={12} className={theme.text} />
          <span>BG THEME</span>
        </div>
        <div className="flex gap-1">
          {(Object.keys(THEMES) as ThemeKey[]).map((tKey) => (
            <button
              key={tKey}
              onClick={() => setCurrentTheme(tKey)}
              title={THEMES[tKey].name}
              className={`text-[10px] font-black px-2 py-1 rounded-md border transition-all duration-150 ${
                currentTheme === tKey
                  ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {THEMES[tKey].name.slice(0, 2)} {/* 只顯示前兩個字維持整齊 */}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm font-mono tracking-widest text-slate-400 uppercase">SCORE SYSTEM</div>
      <div className={`text-4xl font-black tracking-wider font-mono -mt-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-colors duration-300 ${theme.text}`}>
        {score.toString().padStart(6, '0')}
      </div>
      
      {/* 20x10 棋盤容器 */}
      <div className={`grid grid-cols-10 gap-[1px] p-3 rounded-xl border-2 shadow-inner relative transition-all duration-300 ${theme.gridBg} ${
        isFlashing 
          ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]' 
          : 'border-slate-800/80'
      }`}>
        
        {/* 浮空動畫字體渲染層 */}
        {effect && (
          <div 
            key={effect.id} 
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 select-none animate-float-text"
          >
            <div className={`text-center font-black text-3xl tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] whitespace-pre-line ${
              effect.type === 'epic' 
                ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-400 to-red-500 font-extrabold animate-pulse' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'
            }`}>
              {effect.text}
            </div>
          </div>
        )}

        {/* 方塊網格渲染 */}
        {renderDisplayGrid().map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`w-6 h-6 md:w-8 md:h-8 rounded-[3px] border border-black/10 transition-all duration-150 ${
                cell.filled 
                  ? cell.isGhost 
                    ? getGhostClass(cell.rawColor) 
                    : cell.color                   
                  : theme.cellEmpty // 🚀 依據選取主題渲染空的網格顏色
              }`}
            />
          ))
        )}
      </div>

      {!isPlaying && !gameOver && (
        <button 
          onClick={resetGame} 
          className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          START GAME
        </button>
      )}

      {gameOver && (
        <div className="w-full flex flex-col gap-3 animate-fade-in">
          <div className="text-center bg-red-500/10 border border-red-500/20 py-3 rounded-xl">
            <div className="text-red-500 font-black text-xl tracking-tight">GAME OVER</div>
            <div className="text-slate-400 text-xs font-mono mt-0.5">方塊觸頂，戰績已同步。</div>
          </div>
          
          <button 
            onClick={resetGame} 
            className="w-full py-3 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-slate-950 font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            再玩一次 PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}