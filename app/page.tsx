"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [view, setView] = useState('home');
  const [records, setRecords] = useState([]);

  // 加载数据 (目前先用本地存储，等有了 Supabase 钥匙我们再换成远程)
  useEffect(() => {
    const saved = localStorage.getItem('polaris_data');
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  const saveRecord = (data) => {
    const newRecords = [data, ...records];
    setRecords(newRecords);
    localStorage.setItem('polaris_data', JSON.stringify(newRecords));
    setView('home');
  };

  return (
    <div className="min-h-screen">
      {view === 'home' ? (
        <div className="flex flex-col items-center text-center animate-fade-in space-y-12 py-10">
          <h1 className="text-6xl text-[var(--polaris-gold)] gold-glow font-serif">Polaris</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button onClick={() => setView('scanner')} className="p-8 border border-[var(--polaris-gold)] bg-[var(--polaris-gold)]/5 rounded-xl hover:bg-[var(--polaris-gold)]/10 transition">
              <h3 className="text-xl font-bold text-white mb-2">WindowGuard</h3>
              <p className="text-xs text-gray-500 italic uppercase tracking-widest">启动三轴扫描协议</p>
            </button>
            <button className="p-8 border border-white/5 bg-white/5 rounded-xl opacity-50 cursor-not-allowed">
              <h3 className="text-xl font-bold text-white mb-2">Game Lab</h3>
              <p className="text-xs text-gray-400">开发中...</p>
            </button>
          </div>
          
          <div className="w-full max-w-2xl text-left">
            <h3 className="text-xs font-mono text-gray-500 mb-4 uppercase">历史信号 / Records</h3>
            {records.length === 0 ? (
              <p className="text-gray-700 italic text-sm">暂无决策记录...</p>
            ) : (
              <div className="space-y-4">
                {records.map((r, i) => (
                  <div key={i} className="p-4 bg-white/5 border-l-2 border-[var(--polaris-gold)] rounded-r flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{r.title}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{r.date}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded font-bold ${r.risk === 'HIGH' ? 'bg-red-900/30 text-red-500' : 'bg-green-900/30 text-green-500'}`}>
                      {r.risk}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <Scanner onSave={saveRecord} onBack={() => setView('home')} />
      )}
    </div>
  );
}

function Scanner({ onSave, onBack }) {
  const [form, setForm] = useState({ title: '', a1: '', a2: '' });

  return (
    <div className="max-w-xl mx-auto py-10 space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif text-[var(--polaris-gold)]">三轴风险扫描</h2>
      <div className="space-y-6">
        <div>
          <label className="text-xs text-gray-500 block mb-2 font-mono uppercase">扫描对象 / Target</label>
          <input className="w-full bg-white/5 border border-white/10 rounded p-4 text-white focus:border-[var(--polaris-gold)] outline-none" 
            placeholder="输入项目或机会名称..." onChange={e => setForm({...form, title: e.target.value})} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-2 font-mono uppercase">轴心一：缓慢恶化？</label>
          <textarea className="w-full bg-white/5 border border-white/10 rounded p-4 text-white focus:border-[var(--polaris-gold)] outline-none" rows={2}
            placeholder="随着时间推移，价值是否会降低？" onChange={e => setForm({...form, a1: e.target.value})} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-2 font-mono uppercase">轴心二：不可逆点？</label>
          <textarea className="w-full bg-white/5 border border-white/10 rounded p-4 text-white focus:border-[var(--polaris-gold)] outline-none" rows={2}
            placeholder="一旦做了，还能回头吗？" onChange={e => setForm({...form, a2: e.target.value})} />
        </div>
        <div className="flex gap-4 pt-4">
          <button onClick={onBack} className="flex-1 py-4 border border-white/10 text-gray-400 hover:text-white rounded">取消</button>
          <button onClick={() => onSave({
            title: form.title,
            risk: form.a2.length > 5 ? 'HIGH' : 'LOW',
            date: new Date().toLocaleDateString()
          })} className="flex-1 py-4 bg-[var(--polaris-gold)] text-black font-bold rounded hover:bg-yellow-600 transition">完成分析并存档</button>
        </div>
      </div>
    </div>
  );
}
