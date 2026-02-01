"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- 1. 核心配置 (请确保填入你自己的值) ---
const supabaseUrl = 'https://jbwvabwctlandtanwnwu.supabase.co';
const supabaseKey = 'sb_publishable_mrFycPurMeeN9VYPkkhG5g_3ZaM1nUh';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [view, setView] = useState('home');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取数据
  async function fetchData() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setRecords(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 保存数据
  async function handleSave(formData: any) {
    try {
      const { error } = await supabase
        .from('scans')
        .insert([{ 
          title: formData.title, 
          risk: formData.risk, 
          axis1: formData.axis1, 
          axis2: formData.axis2 
        }]);

      if (!error) {
        await fetchData();
        setView('home');
      } else {
        alert('保存失败，请检查数据库权限');
      }
    } catch (err) {
      alert('网络错误');
    }
  }

  // --- 2. 界面渲染 ---
  return (
    <div className="min-h-screen text-gray-200 w-full max-w-2xl mx-auto px-4">
      {view === 'home' ? (
        <div className="flex flex-col items-center text-center space-y-12 py-10 animate-fade-in">
          <h1 className="text-6xl md:text-7xl text-[#d4af37] font-serif tracking-tighter" style={{textShadow: '0 0 20px rgba(212,175,55,0.2)'}}>
            Polaris
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <button 
              onClick={() => setView('scanner')} 
              className="p-8 border border-[#d4af37]/30 bg-[#d4af37]/5 rounded-xl hover:bg-[#d4af37]/10 transition group text-left"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition">WindowGuard</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">启动云端三轴扫描协议</p>
            </button>
            <div className="p-8 border border-white/5 bg-white/5 rounded-xl opacity-30 cursor-not-allowed text-left">
              <h3 className="text-xl font-bold text-white mb-2">Game Lab</h3>
              <p className="text-[10px] text-gray-500 font-mono italic">Visualizing Power...</p>
            </div>
          </div>
          
          <div className="w-full text-left">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
              <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Cloud Signals / 云端数据</h3>
              {loading && <span className="text-[10px] text-yellow-500 animate-pulse font-mono">SYNCING...</span>}
            </div>

            <div className="space-y-3">
              {records.length === 0 && !loading ? (
                <div className="text-center py-12 border border-dashed border-white/5 rounded-xl text-gray-600 text-sm">暂无云端数据</div>
              ) : (
                records.map((r: any) => (
                  <div key={r.id} className="p-5 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center hover:border-white/20 transition group">
                    <div>
                      <div className="text-white font-medium mb-1 group-hover:text-[#d4af37] transition">{r.title}</div>
                      <div className="text-[9px] text-gray-600 font-mono uppercase">
                        {new Date(r.created_at).toLocaleString()}
                      </div>
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${r.risk === 'HIGH' ? 'border-red-900/50 text-red-500 bg-red-900/10' : 'border-green-900/50 text-green-500 bg-green-900/10'}`}>
                      {r.risk}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto py-10 space-y-8 px-2">
          <h2 className="text-3xl font-serif text-[#d4af37]">三轴风险扫描协议</h2>
          <ScannerView onSave={handleSave} onBack={() => setView('home')} />
        </div>
      )}
    </div>
  );
}

// --- 3. 子组件：扫描表单 ---
function ScannerView({ onSave, onBack }: any) {
  const [title, setTitle] = useState('');
  const [axis1, setAxis1] = useState('');
  const [axis2, setAxis2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title) return alert('请输入目标名称');
    setLoading(true);
    const risk = (axis1.length > 10 || axis2.length > 10) ? 'HIGH' : 'LOW';
    await onSave({ title, axis1, axis2, risk });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[10px] text-[#d4af37] block mb-2 font-mono uppercase font-bold tracking-widest">扫描目标 / Target</label>
        <input 
          className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[#d4af37] outline-none transition" 
          placeholder="例如：某创业公司的邀请" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="text-[10px] text-gray-500 block mb-2 font-mono uppercase font-bold tracking-widest">轴心一：缓慢恶化？</label>
        <textarea 
          className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[#d4af37] outline-none transition h-24"
          placeholder="该环境是否会消耗你的核心竞争力？"
          value={axis1}
          onChange={(e) => setAxis1(e.target.value)}
        />
      </div>
      <div>
        <label className="text-[10px] text-gray-500 block mb-2 font-mono uppercase font-bold tracking-widest">轴心二：不可逆点？</label>
        <textarea 
          className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[#d4af37] outline-none transition h-24"
          placeholder="你需要付出多大代价才能全身而退？"
          value={axis2}
          onChange={(e) => setAxis2(e.target.value)}
        />
      </div>
      
      <div className="flex gap-4 pt-6">
        <button onClick={onBack} className="flex-1 py-4 text-gray-600 hover:text-white transition uppercase text-xs font-mono tracking-widest">Cancel</button>
        <button 
          disabled={loading}
          onClick={handleSubmit} 
          className="flex-1 py-4 bg-[#d4af37] text-[#1a2332] font-bold rounded-lg hover:bg-yellow-500 transition shadow-lg shadow-yellow-900/20 disabled:opacity-50 uppercase text-xs tracking-widest"
        >
          {loading ? 'Syncing...' : 'Sync to Cloud'}
        </button>
      </div>
    </div>
  );
}
