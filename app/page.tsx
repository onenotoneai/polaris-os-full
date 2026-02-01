"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- 配置连接 Supabase (请确保这里是你自己的值) ---
const supabaseUrl = 'https://jbwvabwctlandtanwnwu.supabase.co';
const supabaseKey = 'sb_publishable_mrFycPurMeeN9VYPkkhG5g_3ZaM1nUh';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [view, setView] = useState('home');
  // 修正点 1：明确告诉 TypeScript，这个列表可以存放任何类型的数据
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .order('created_at', { ascending: false });
    
    // 修正点 2：如果没报错，强制转换数据类型
    if (!error && data) {
      setRecords(data as any[]);
    }
    setLoading(false);
  }

  const saveRecord = async (formData: any) => {
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
      await fetchData();
      setView('home');
    } else {
      alert('保存失败，请检查 Supabase 表名和权限');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen text-gray-200">
      {view === 'home' ? (
        <div className="flex flex-col items-center text-center space-y-12 py-10 animate-fade-in px-4">
          <h1 className="text-6xl md:text-7xl text-[var(--polaris-gold)] gold-glow font-serif">Polaris</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button onClick={() => setView('scanner')} className="p-8 border border-[var(--polaris-gold)] bg-[var(--polaris-gold)]/5 rounded-xl hover:bg-[var(--polaris-gold)]/10 transition group">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--polaris-gold)] transition">WindowGuard</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">启动云端三轴扫描</p>
            </button>
            <button className="p-8 border border-white/5 bg-white/5 rounded-xl opacity-30 cursor-not-allowed">
              <h3 className="text-xl font-bold text-white mb-2">Game Lab</h3>
              <p className="text-[10px] text-gray-400 font-mono italic tracking-tighter text-nowrap">Visualizing...</p>
            </button>
          </div>
          
          <div className="w-full max-w-2xl text-left">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
              <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Cloud Signals / 云端数据</h3>
              {loading && <span className="text-[10px] text-yellow-500 animate-pulse font-mono">SYNCING...</span>}
            </div>

            <div className="space-y-4">
              {records.length === 0 && !loading ? (
                <p className="text-gray-700 italic text-sm text-center py-12 border border-dashed border-white/5 rounded-xl">云端暂无数据</p>
              ) : (
                records.map((r: any) => (
                  <div key={r.id} className="p-5 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center group hover:border-white/20 transition">
                    <div>
                      <div className="text-white font-medium mb-1 group-hover:text-[var(--polaris-gold)] transition">{r.title}</div>
                      <div className="text-[9px] text-gr
