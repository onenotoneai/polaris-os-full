"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- 配置连接 Supabase ---
const supabaseUrl = 'https://jbwvabwctlandtanwnwu.supabase.co';
const supabaseKey = 'sb_publishable_mrFycPurMeeN9VYPkkhG5g_3ZaM1nUh';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [view, setView] = useState('home');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 从云端数据库读取数据
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setRecords(data);
    setLoading(false);
  }

  // 💾 保存数据到云端
  const saveRecord = async (formData) => {
    const { error } = await supabase
      .from('scans')
      .insert([
        { 
          title: formData.title, 
          risk: formData.risk, 
          axis1: formData.axis1, 
          axis2: formData.axis2 
        }
      ]);

    if (!error) {
      fetchData();
      setView('home');
    } else {
      alert('保存失败，请检查配置');
    }
  };

  return (
    <div className="min-h-screen text-gray-200">
      {view === 'home' ? (
        <div className="flex flex-col items-center text-center space-y-12 py-10 animate-fade-in">
          <h1 className="text-7xl text-[var(--polaris-gold)] gold-glow font-serif">Polaris</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button onClick={() => setView('scanner')} className="p-8 border border-[var(--polaris-gold)] bg-[var(--polaris-gold)]/5 rounded-xl hover:bg-[var(--polaris-gold)]/10 transition group">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--polaris-gold)] transition">WindowGuard</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">启动云端三轴扫描</p>
            </button>
            <button className="p-8 border border-white/5 bg-white/5 rounded-xl opacity-30 cursor-not-allowed">
              <h3 className="text-xl font-bold text-white mb-2">Game Lab</h3>
              <p className="text-xs text-gray-400 font-mono italic">Syncing...</p>
            </button>
          </div>
          
          <div className="w-full max-w-2xl text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Cloud Database / 云端信号</h3>
              {loading && <span className="text-[10px] text-yellow-500 animate-pulse font-mono">LOADING...</span>}
            </div>

            <div className="space-y-4">
              {records.length === 0 && !loading ? (
                <p className="text-gray-700 italic text-sm text-center py-10 border border-dashed border-white/5 rounded-xl">云端暂无数据，请开始第一次决策扫描</p>
              ) : (
                records.map((r) => (
                  <div key={r.id} className="p-5 bg-white/5 border border-white/5 hover:border-white/10 rounded-lg flex justify-between items-center transition">
                    <div>
                      <div className="text-white font-medium mb-1">{r.title}</div>
                      <div className="text-[10px] text-gray-500 font-mono">ID: {r.id.slice(0,8)} • {new Date(r.created_at).toLocaleDateString()}</div>
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
        <Scanner onSave={saveRecord} onBack={() => setView('home')} />
      )}
    </div>
  );
}

function Scanner({ onSave, onBack }) {
  const [form, setForm] = useState({ title: '', axis1: '', axis2: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.title) return alert('请输入名称');
    setIsSubmitting(true);
    // 简单的风险算法逻辑
    const risk = (form.axis1.length > 10 || form.axis2.length > 10) ? 'HIGH' : 'LOW';
    await onSave({ ...form, risk });
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-8 animate-fade-in px-4">
      <h2 className="text-3xl font-serif text-[var(--polaris-gold)]">三轴风险扫描协议</h2>
      <div className="space-y-6">
        <div>
          <label className="text-xs text-[var(--polaris-gold)] block mb-2 font-mono uppercase font-bold">扫描目标 / Target</label>
          <input className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[var(--polaris-gold)] outline-none transition" 
            placeholder="例如：某创业公司的VP邀请" onChange={e => setForm({...form, title: e.target.value})} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-2 font-mono uppercase">轴心一：缓慢恶化？</label>
          <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[var(--polaris-gold)] outline-none transition" rows={2}
            placeholder="随着时间推移，该环境是否会消耗你的核心竞争力？" onChange={e => setForm({...form, axis1: e.target.value})} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-2 font-mono uppercase">轴心二：不可逆点？</label>
          <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-[var(--polaris-gold)] outline-none transition" rows={2}
            placeholder="一旦投入，你需要付出多大代价才能全身而退？" onChange={e => setForm({...form, axis2: e.target.value})} />
        </div>
        
        <div className="flex gap-4 pt-6">
          <button onClick={onBack} className="flex-1 py-4 text-gray-500 hover:text-white transition">取消</button>
          <button 
            disabled={isSubmitting}
            onClick={handleSubmit} 
            className="flex-1 py-4 bg-[var(--polaris-gold)] text-[#1a2332] font-bold rounded-lg hover:bg-yellow-500 transition shadow-lg shadow-yellow-900/20 disabled:opacity-50"
          >
            {isSubmitting ? '上传云端中...' : '同步至全栈数据库'}
          </button>
        </div>
      </div>
    </div>
  );
}
