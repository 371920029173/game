import { Routes, Route, useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Game01 from './games/Game01.jsx';
import Game02 from './games/Game02.jsx';
import Game03 from './games/Game03.jsx';
import Game04 from './games/Game04.jsx';
import Game05 from './games/Game05.jsx';
import Game06 from './games/Game06.jsx';
import Game07 from './games/Game07.jsx';
import Game08 from './games/Game08.jsx';
import Game09 from './games/Game09.jsx';
import Game10 from './games/Game10.jsx';
import Game11 from './games/Game11.jsx';
import Game12 from './games/Game12.jsx';
import Game13 from './games/Game13.jsx';
import Game14 from './games/Game14.jsx';
import Game15 from './games/Game15.jsx';
import Game16 from './games/Game16.jsx';
import Game17 from './games/Game17.jsx';
import Game18 from './games/Game18.jsx';
import Game19 from './games/Game19.jsx';
import Game20 from './games/Game20.jsx';
import Game21 from './games/Game21.jsx';
import Game22 from './games/Game22.jsx';
import Game23 from './games/Game23.jsx';
import Game24 from './games/Game24.jsx';
import Game25 from './games/Game25.jsx';
import Game26 from './games/Game26.jsx';
import Game27 from './games/Game27.jsx';
import Game28 from './games/Game28.jsx';
import Game29 from './games/Game29.jsx';
import Game30 from './games/Game30.jsx';
import Game31 from './games/Game31.jsx';
import Game32 from './games/Game32.jsx';
import Game33 from './games/Game33.jsx';
import Game34 from './games/Game34.jsx';
import Game35 from './games/Game35.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="game/:id" element={<GamePage />} />
    </Routes>
  )
}

const adImages = [
  'https://via.placeholder.com/900x120?text=广告1',
  'https://via.placeholder.com/900x120?text=广告2',
  'https://via.placeholder.com/900x120?text=广告3',
  'https://via.placeholder.com/900x120?text=广告4',
  'https://via.placeholder.com/900x120?text=广告5',
  'https://via.placeholder.com/900x120?text=广告6',
]

function AdBanner() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % adImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])
  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', height: 120, overflow: 'hidden', borderRadius: 32, boxShadow: '0 2px 12px #0001', marginBottom: 32, position: 'relative', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#333', fontWeight: 600, border: '3px solid #fbbf24' }}>
      <span style={{ zIndex: 3, position: 'relative', background: 'rgba(255,255,255,0.8)', padding: '0 24px', borderRadius: 8 }}>益智小游戏乐园广告位，欢迎投放！</span>
      {adImages.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`广告${i+1}`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === index ? 0.3 : 0,
            transition: 'opacity 1s',
            zIndex: 1,
            borderRadius: 32
          }}
        />
      ))}
    </div>
  )
}

function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 游戏中文名，顺序与gameComponents一致
const gameNames = [
  '2048合成', // 1
  '贪吃蛇',
  '扫雷',
  '五子棋',
  '翻牌配对',
  '华容道',
  '推箱子',
  '俄罗斯方块',
  '连连看',
  '迷宫闯关',
  '记忆翻牌',
  '消消乐',
  '打地鼠',
  '九宫拼图',
  '彩色消除',
  '单词拼拼乐',
  '单词拼写',
  '数独',
  '灯泡开关',
  '黑白翻转棋',
  '记忆配对',
  '数字华容道',
  '极速打字',
  '数字找规律',
  '颜色记忆大师',
  '大型扫雷',
  '数字顺序挑战',
  '图片拼图',
  '反应力测试',
  '数字合成',
  '横版跑酷',
  '竖版躲避',
  '星星收集',
  '跳跃攀爬',
  '金币跑酷',
];

// 游戏分组顺序（按分类固定）
const gameGroups = [
  {
    name: '益智闯关',
    games: [0, 5, 6, 8, 9, 13, 14, 17, 21, 22, 25, 26, 27], // 2048, 华容道, 推箱子, 连连看, 迷宫, 九宫拼图, 彩色消除, 数独, 数字华容道, 极速打字, 数字找规律, 颜色记忆, 数字顺序
  },
  {
    name: '反应挑战',
    games: [1, 12, 28, 29, 30, 31, 32, 33, 34], // 贪吃蛇, 打地鼠, 反应力, 数字合成, 横版跑酷, 竖版躲避, 星星收集, 跳跃攀爬, 金币跑酷
  },
  {
    name: '记忆力',
    games: [4, 10, 20, 24], // 翻牌配对, 记忆翻牌, 记忆配对, 颜色记忆大师
  },
  {
    name: '数字逻辑',
    games: [2, 16, 18, 19, 23], // 扫雷, 单词拼写, 灯泡开关, 黑白翻转棋, 数独
  },
  {
    name: '休闲趣味',
    games: [3, 7, 11, 15, 35], // 五子棋, 俄罗斯方块, 消消乐, 单词拼拼乐, 金币跑酷
  },
];

function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f8fafc 0%,#e0e7ef 100%)', paddingBottom: 40, boxSizing: 'border-box' }}>
      <AdBanner />
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2d3a4b', marginBottom: 8 }}>益智小游戏乐园</h1>
        <p style={{ color: '#4b5563', fontSize: '1.2rem', marginBottom: 32 }}>欢迎来到益智小游戏乐园，点击下方按钮开始游戏！</p>
        {gameGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.4rem', margin: '24px 0 12px' }}>{group.name}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              {group.games.map(idx => (
                <a key={idx} href={`#/game/${idx+1}`} style={{ textDecoration: 'none', minWidth: 120 }}>
                  <button aria-label={gameNames[idx]} title={gameNames[idx]}
                    style={{ width: '100%', minWidth: 100, padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '8px', margin: '0.5rem 0', cursor: 'pointer', background: '#fff', boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb', transition: 'transform .2s', fontWeight: 700, color: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                    {gameNames[idx]}
                  </button>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GoogleAd() {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.setAttribute('crossorigin', 'anonymous');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <ins className="adsbygoogle"
      style={{ display: 'block', textAlign: 'center', margin: '16px 0' }}
      data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
      data-ad-slot="1234567890"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
}

const gameComponents = [
  Game01, Game02, Game03, Game04, Game05, Game06, Game07, Game08, Game09, Game10,
  Game11, Game12, Game13, Game14, Game15, Game16, Game17, Game18, Game19, Game20,
  Game21, Game22, Game23, Game24, Game25, Game26, Game27, Game28, Game29, Game30,
  Game31, Game32, Game33, Game34, Game35
];
function GamePage() {
  const { id } = useParams();
  const idx = Number(id) - 1;
  const GameComp = gameComponents[idx];
  const contentRef = useRef();
  useEffect(() => {
    document.title = `${gameNames[idx] || `游戏${id}`} - 益智小游戏乐园`;
    if (contentRef.current) {
      contentRef.current.style.opacity = 0;
      contentRef.current.style.transform = 'translateY(40px)';
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = 'opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1)';
          contentRef.current.style.opacity = 1;
          contentRef.current.style.transform = 'translateY(0)';
        }
      }, 60);
    }
  }, [id]);
  // 互动区本地存储
  const likeKey = `game_like_${id}`
  const commentKey = `game_comment_${id}`
  const [likes, setLikes] = useState(() => Number(localStorage.getItem(likeKey)) || 0)
  const [comments, setComments] = useState(() => JSON.parse(localStorage.getItem(commentKey) || '[]'))
  const [commentInput, setCommentInput] = useState('')

  const handleLike = () => {
    const newLikes = likes + 1
    setLikes(newLikes)
    localStorage.setItem(likeKey, newLikes)
  }
  const handleComment = () => {
    if (commentInput.trim()) {
      const newComments = [...comments, commentInput.trim()]
      setComments(newComments)
      localStorage.setItem(commentKey, JSON.stringify(newComments))
      setCommentInput('')
    }
  }

  // 顶部广告图片
  const adUrlH = (n) => `https://via.placeholder.com/900x80?text=广告${n}`;
  return (
    <div style={{ minHeight: '100vh', minWidth: 0, background: 'linear-gradient(135deg,#f8fafc 0%,#e0e7ef 100%)', padding: 0, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 顶部广告 */}
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', marginTop: 24, borderRadius: 24, overflow: 'hidden', border: '3px solid #fbbf24', boxSizing: 'border-box' }}>
        <img src={adUrlH(1)} alt="顶部广告" style={{ width: '100%', borderRadius: 24, display: 'block' }} />
      </div>
      <div style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24, boxSizing: 'border-box' }}>
        {/* 游戏区 */}
        <div ref={contentRef} style={{ maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, marginTop: 32 }}>
          <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '2rem', color: '#222', marginBottom: 16 }}>{gameNames[idx] || `游戏${id}`}</h2>
          <div style={{ width: '100%', height: 'min(320px,40vw)', background: '#f3f4f6', borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#9ca3af', minHeight: 180 }}>
            {GameComp ? <GameComp /> : `${gameNames[idx] || `游戏${id}`}内容区（待开发）`}
          </div>
          {/* 互动区 */}
          <div style={{ width: '100%', background: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 24, boxShadow: '0 1px 4px #0001', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <button onClick={handleLike} style={{ background: '#fbbf24', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, color: '#fff', cursor: 'pointer', fontSize: 18, boxShadow: '0 1px 4px #0001' }}>👍 点赞 {likes}</button>
              <input value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="写下你的评论..." style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 16 }} />
              <button onClick={handleComment} style={{ background: '#2563eb', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, color: '#fff', cursor: 'pointer', fontSize: 18, boxShadow: '0 1px 4px #0001' }}>评论</button>
            </div>
            <div style={{ maxHeight: 120, overflowY: 'auto', textAlign: 'left' }}>
              {comments.length === 0 ? <div style={{ color: '#9ca3af' }}>暂无评论</div> : comments.map((c, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 6, padding: 8, marginBottom: 6, boxShadow: '0 1px 2px #0001', fontSize: 15 }}>{c}</div>
              ))}
            </div>
          </div>
          {/* 玩法介绍区 */}
          <div style={{ width: '100%', background: '#f3f4f6', borderRadius: 8, padding: 18, color: '#374151', fontSize: 16, boxShadow: '0 1px 4px #0001', boxSizing: 'border-box' }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>玩法与目的</h3>
            <div>{gameNames[idx] || `游戏${id}`}的玩法与目标介绍。</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
