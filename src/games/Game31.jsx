import React, { useRef, useEffect, useState } from 'react';

// 简单横版跑酷：空格跳跃，障碍物随机出现，无限分数
const GAME_W = 320, GAME_H = 180, GROUND = 150, PLAYER_W = 24, PLAYER_H = 32, OBST_W = 18, OBST_H = 32;
function randomGap() { return 120 + Math.random() * 100; }

export default function Game31() {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [jump, setJump] = useState(false);
  const [playerY, setPlayerY] = useState(GROUND);
  const [obstacles, setObstacles] = useState([{ x: 400, hit: false }]);
  const [hitIdx, setHitIdx] = useState(null);
  const vy = useRef(0);
  const raf = useRef();

  useEffect(() => {
    if (over) return;
    const loop = () => {
      setObstacles(obs => {
        let next = obs.map((o, idx) => ({ ...o, x: o.x - 3, hit: o.hit }));
        if (next[0].x < GAME_W - randomGap()) next.push({ x: GAME_W + Math.random() * 60, hit: false });
        if (next[0].x < -OBST_W) next.shift();
        return next;
      });
      setScore(s => s + 1);
      setPlayerY(y => {
        let v = vy.current;
        v += 1.2; // gravity
        let ny = y + v;
        if (ny > GROUND) { ny = GROUND; v = 0; }
        vy.current = v;
        return ny;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [over]);

  useEffect(() => {
    if (over) return;
    obstacles.forEach((o, idx) => {
      if (
        o.x < 40 + PLAYER_W && o.x + OBST_W > 40 &&
        playerY + PLAYER_H > GROUND && playerY < GROUND + OBST_H
      ) {
        setOver(true);
        setHitIdx(idx);
        setObstacles(obs => obs.map((ob, i) => i === idx ? { ...ob, hit: true } : ob));
        setTimeout(() => {
          setObstacles(obs => obs.filter((_, i) => i !== idx));
          setHitIdx(null);
        }, 400);
      }
    });
  }, [obstacles, playerY, over]);

  // 新增：暴露jump和restart到window，供ScreenControls直接调用
  useEffect(() => {
    window.__game31_jump = () => {
      if (!over && playerY >= GROUND) {
        vy.current = -13;
        setJump(true);
        setTimeout(() => setJump(false), 200);
      }
    };
    window.__game31_restart = restart;
    return () => {
      delete window.__game31_jump;
      delete window.__game31_restart;
    };
  }, [over, playerY]);

  const restart = () => {
    setScore(0); setOver(false); setPlayerY(GROUND); setObstacles([{ x: 400 }]); vy.current = 0;
  };

  // 屏幕操作面板
  const jumpAction = () => {
    if (!over && playerY >= GROUND) {
      vy.current = -13;
      setJump(true);
      setTimeout(() => setJump(false), 200);
    }
  };
  const controls = [
    { label: '跳跃', onClick: jumpAction },
    { label: '重开', onClick: restart },
  ];

  return (
    <div style={{ width: GAME_W, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>分数: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <svg width={GAME_W} height={GAME_H} style={{ background: '#e0e7ef', borderRadius: 12 }}>
        <rect x={0} y={GROUND + PLAYER_H} width={GAME_W} height={GAME_H - GROUND - PLAYER_H} fill="#64748b" />
        <rect x={40} y={playerY} width={PLAYER_W} height={PLAYER_H} rx={6} fill={jump ? '#fbbf24' : '#2563eb'} />
        {obstacles.map((o, i) => (
          <rect key={i} x={o.x} y={GROUND} width={OBST_W} height={OBST_H} rx={4} fill="#ef4444"
            style={o.hit ? { transform: 'scale(1.2) rotate(-18deg)', transition: 'transform 0.2s cubic-bezier(.68,-0.55,.27,1.55)', filter: 'brightness(1.2)' } : { transition: 'transform 0.2s' }} />
        ))}
      </svg>
      {over && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>游戏结束！分数: {score}，按R重开</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>空格或下方按钮跳跃，躲避障碍物，挑战高分！</div>
      {/* 屏幕操作面板 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
        {controls.map((c, i) => (
          <button key={i} onClick={c.onClick} style={{ minWidth: 64, minHeight: 48, fontSize: 20, borderRadius: 12, background: '#f3f4f6', border: '2px solid #2563eb', color: '#2563eb', fontWeight: 700, boxShadow: '0 1px 4px #0001', cursor: 'pointer', margin: 4 }}>{c.label}</button>
        ))}
      </div>
    </div>
  );
} 