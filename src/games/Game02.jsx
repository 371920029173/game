import React, { useState, useEffect, useRef } from 'react';

const SIZE = 15;
const INIT = [
  { x: 7, y: 7 },
  { x: 7, y: 6 },
];
const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

function randomFood(snake) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function Game02() {
  const [snake, setSnake] = useState(INIT);
  const [dir, setDir] = useState('ArrowRight');
  const [food, setFood] = useState(randomFood(INIT));
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const moveRef = useRef(dir);

  useEffect(() => { moveRef.current = dir; }, [dir]);

  useEffect(() => {
    if (over) return;
    const handleKey = (e) => {
      if (DIRS[e.key]) {
        setDir(d => {
          // 防止反向
          if (d === 'ArrowUp' && e.key === 'ArrowDown') return d;
          if (d === 'ArrowDown' && e.key === 'ArrowUp') return d;
          if (d === 'ArrowLeft' && e.key === 'ArrowRight') return d;
          if (d === 'ArrowRight' && e.key === 'ArrowLeft') return d;
          return e.key;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [over]);

  useEffect(() => {
    if (over) return;
    const timer = setInterval(() => {
      setSnake(snake => {
        const head = { ...snake[0] };
        const move = DIRS[moveRef.current];
        head.x += move.x;
        head.y += move.y;
        if (
          head.x < 0 || head.x >= SIZE ||
          head.y < 0 || head.y >= SIZE ||
          snake.some(s => s.x === head.x && s.y === head.y)
        ) {
          setOver(true);
          return snake;
        }
        let newSnake = [head, ...snake];
        if (head.x === food.x && head.y === food.y) {
          setFood(randomFood(newSnake));
          setScore(s => s + 1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(timer);
  }, [food, over]);

  const restart = () => {
    setSnake(INIT);
    setDir('ArrowRight');
    setFood(randomFood(INIT));
    setOver(false);
    setScore(0);
  };

  // 屏幕操作面板
  const setDirSafe = (key) => {
    if (over) return;
    setDir(d => {
      if (d === 'ArrowUp' && key === 'ArrowDown') return d;
      if (d === 'ArrowDown' && key === 'ArrowUp') return d;
      if (d === 'ArrowLeft' && key === 'ArrowRight') return d;
      if (d === 'ArrowRight' && key === 'ArrowLeft') return d;
      return key;
    });
  };
  const controls = [
    { label: '↑', onClick: () => setDirSafe('ArrowUp') },
    { label: '↓', onClick: () => setDirSafe('ArrowDown') },
    { label: '←', onClick: () => setDirSafe('ArrowLeft') },
    { label: '→', onClick: () => setDirSafe('ArrowRight') },
    { label: '重开', onClick: restart },
  ];

  return (
    <div style={{ width: 360, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>分数: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 2, background: '#bdbdbd', padding: 4, borderRadius: 8 }}>
        {Array.from({ length: SIZE * SIZE }, (_, i) => {
          const x = i % SIZE, y = Math.floor(i / SIZE);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = snake.some((s, idx) => idx > 0 && s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          let label = isHead ? '蛇头' : isBody ? '蛇身' : isFood ? '食物' : '空格';
          return <div key={i} aria-label={label} title={label} style={{ width: 20, height: 20, background: isHead ? '#22d3ee' : isBody ? '#38bdf8' : isFood ? '#fbbf24' : '#f3f4f6', borderRadius: 4, border: isHead ? '2px solid #0ea5e9' : 'none', transition: 'all .1s' }} />;
        })}
      </div>
      {over && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>游戏结束！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>用方向键或下方按钮控制贪吃蛇，吃掉食物得分！</div>
      {/* 屏幕操作面板 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
        {controls.map((c, i) => (
          <button key={i} onClick={c.onClick} style={{ minWidth: 48, minHeight: 48, fontSize: 20, borderRadius: 12, background: '#f3f4f6', border: '2px solid #2563eb', color: '#2563eb', fontWeight: 700, boxShadow: '0 1px 4px #0001', cursor: 'pointer', margin: 4 }}>{c.label}</button>
        ))}
      </div>
    </div>
  );
} 