import React, { useState, useRef } from 'react';

// 500个常用英文单词，涵盖趣味、科技、日常、动词、名词等
const WORDS = [
  'apple','banana','orange','grape','peach','lemon','melon','cherry','berry','mango','pear','plum','kiwi','date','fig','lime','apricot','coconut','guava','papaya',
  'cat','dog','mouse','horse','sheep','tiger','lion','zebra','panda','monkey','rabbit','wolf','fox','bear','deer','goose','duck','eagle','owl','swan','shark',
  'car','train','plane','truck','ship','bike','bus','metro','taxi','jeep','scooter','rocket','boat','canoe','subway','tram','van','yacht','wagon','skate',
  'table','chair','couch','sofa','bed','desk','shelf','lamp','clock','phone','pen','pencil','book','paper','board','bag','box','cup','plate','spoon',
  'water','juice','milk','tea','coffee','soup','bread','rice','noodle','pizza','cake','sugar','salt','honey','cheese','meat','fish','egg','fruit','salad',
  'happy','sad','angry','funny','brave','smart','quick','slow','strong','weak','tall','short','young','old','rich','poor','kind','mean','calm','wild',
  'blue','green','red','yellow','black','white','brown','purple','orange','pink','gray','gold','silver','beige','ivory','navy','teal','maroon','olive','cyan',
  'cloud','rain','storm','wind','snow','fog','sun','moon','star','sky','river','lake','sea','ocean','mountain','hill','valley','island','beach','desert',
  'music','dance','song','piano','guitar','violin','drum','flute','trumpet','singer','band','note','sound','voice','melody','rhythm','beat','tune','lyric','opera',
  'school','class','study','learn','teach','write','read','draw','paint','count','think','solve','test','quiz','score','grade','group','team','club','event',
  'robot','laser','space','earth','mars','venus','jupiter','saturn','pluto','comet','asteroid','galaxy','universe','rocket','alien','signal','code','data','logic','byte',
  'dream','hope','wish','plan','goal','luck','chance','risk','trust','faith','truth','fact','rule','law','order','peace','fight','win','lose','draw',
  'visit','travel','drive','walk','run','jump','swim','climb','fly','sail','ride','move','stop','start','open','close','push','pull','lift','drop',
  'light','dark','bright','dim','loud','quiet','soft','hard','warm','cold','hot','cool','dry','wet','clean','dirty','full','empty','thick','thin',
  'build','break','make','fix','find','lose','give','take','send','bring','show','hide','call','help','save','join','leave','meet','wait','follow',
  'smile','laugh','cry','shout','sing','talk','listen','watch','look','see','hear','touch','feel','taste','smell','think','guess','know','learn','teach',
  'money','price','cost','sale','shop','store','mall','bank','coin','bill','card','gift','deal','trade','stock','fund','loan','rent','tax','fee',
  'city','town','village','street','road','park','bridge','tower','house','home','room','door','window','wall','floor','roof','yard','garden','farm','field',
  'north','south','east','west','left','right','front','back','top','bottom','side','center','edge','corner','line','point','dot','area','shape','form',
  'family','friend','child','parent','sister','brother','uncle','aunt','cousin','grandpa','grandma','baby','kid','teen','adult','wife','husband','son','daughter','pet',
  'doctor','nurse','teacher','student','worker','farmer','driver','pilot','chef','cook','waiter','artist','actor','singer','dancer','writer','poet','coach','judge','guard'
];
function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function Game23() {
  const [word, setWord] = useState(randomWord());
  const [input, setInput] = useState('');
  const [start, setStart] = useState(null);
  const [msg, setMsg] = useState('');
  const [best, setBest] = useState(() => Number(localStorage.getItem('game23_best')) || 0);
  const inputRef = useRef();

  const handleChange = e => {
    if (!start) setStart(Date.now());
    setInput(e.target.value);
    if (e.target.value === word) {
      const t = Date.now() - start;
      setMsg(`用时：${t}ms`);
      if (!best || t < best) {
        setBest(t);
        localStorage.setItem('game23_best', t);
      }
      setTimeout(() => {
        setWord(randomWord());
        setInput('');
        setStart(null);
        setMsg('');
        inputRef.current.focus();
      }, 1200);
    }
  };
  const restart = () => {
    setWord(randomWord());
    setInput('');
    setStart(null);
    setMsg('');
    inputRef.current.focus();
  };
  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>极速打字 | 最佳: {best ? best + 'ms' : '无'}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#fbbf24', letterSpacing: 4 }}>{word}</div>
      <input ref={inputRef} value={input} onChange={handleChange} style={{ fontSize: 22, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', width: 180, textAlign: 'center', marginBottom: 12 }} placeholder="输入单词" autoFocus />
      <div style={{ color: '#22c55e', fontWeight: 700, minHeight: 24 }}>{msg}</div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>尽快输入上方单词，测试你的打字速度！</div>
    </div>
  );
} 