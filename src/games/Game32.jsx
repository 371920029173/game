import React, { useRef, useEffect, useState } from 'react';

// 竖版下落跑酷：左右移动，躲避障碍物，无限分数
const GAME_W = 240, GAME_H = 400, PLAYER_W = 32, PLAYER_H = 32, OBST_W = 40, OBST_H = 16;
function randomX() { return Math.random() * (GAME_W - OBST_W); }

export default function Game32() {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [playerX, setPlayerX] = useState(GAME_W / 2 - PLAYER_W / 2);
  const [obstacles, setObstacles] = useState([{ y: -40, x: randomX() }]);
  const raf = useRef();

  useEffect(() => {
    if (over) return;
    const loop = () => {
      setObstacles(obs => {
        let next = obs.map(o => ({ ...o, y: o.y + 4 }));
        if (next[next.length - 1].y > 60) next.push({ y: -OBST_H, x: randomX() });
        if (next[0].y > GAME_H) next.shift();
        return next;
      });
      setScore(s => s + 1);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [over]);

  useEffect(() => {
    if (over) return;
    for (const o of obstacles) {
      if (
        o.y + OBST_H > GAME_H - PLAYER_H - 10 && o.y < GAME_H - 10 &&
        o.x < playerX + PLAYER_W && o.x + OBST_W > playerX
      ) {
        setOver(true);
        break;
      }
    }
  }, [obstacles, playerX, over]);

  useEffect(() => {
    const onKey = e => {
      if (over && e.key === 'r') restart();
      if (over) return;
      if (e.key === 'ArrowLeft') setPlayerX(x => Math.max(0, x - 24));
      if (e.key === 'ArrowRight') setPlayerX(x => Math.min(GAME_W - PLAYER_W, x + 24));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [over]);

  const restart = () => {
    setScore(0); setOver(false); setPlayerX(GAME_W / 2 - PLAYER_W / 2); setObstacles([{ y: -40, x: randomX() }]);
  };

  return (
    <div style={{ width: GAME_W, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>分数: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <svg width={GAME_W} height={GAME_H} style={{ background: '#e0e7ef', borderRadius: 12 }}>
        <rect x={playerX} y={GAME_H - PLAYER_H - 10} width={PLAYER_W} height={PLAYER_H} rx={8} fill="#2563eb" />
        {obstacles.map((o, i) => (
          <rect key={i} x={o.x} y={o.y} width={OBST_W} height={OBST_H} rx={4} fill="#ef4444" />
        ))}
      </svg>
      {over && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>游戏结束！分数: {score}，按R重开</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>左右方向键移动，躲避下落障碍物，挑战高分！</div>
    </div>
  );
} 