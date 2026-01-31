import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in space-y-12">
      
      {/* 头部区域 */}
      <div className="space-y-4 mt-10">
        <h1 className="text-6xl md:text-8xl text-[var(--polaris-gold)] gold-glow">
          Polaris
        </h1>
        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
          不要在伪装成机遇的陷阱中浪费时间。<br/>
          这是您的外部认知硬盘。
        </p>
      </div>

      {/* 功能卡片区 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
        <Card 
          title="WindowGuard" 
          subtitle="三轴风险扫描" 
          desc="识别缓慢恶化与不可逆点" 
          active={true}
        />
        <Card 
          title="Game Lab" 
          subtitle="博弈实验室" 
          desc="权力结构可视化 (开发中)" 
          active={false} 
        />
        <Card 
          title="Evolution Map" 
          subtitle="能力路线图" 
          desc="2026 北极星指标追踪" 
          active={false} 
        />
      </div>

      {/* 模拟数据库状态 */}
      <div className="mt-16 border-t border-white/5 pt-8 w-full">
        <div className="flex justify-between items-center text-xs font-mono text-gray-600">
          <span>SYSTEM STATUS: ONLINE</span>
          <span>DB CONNECTION: <span className="text-green-500">READY (Vercel Postgres)</span></span>
        </div>
      </div>
    </div>
  )
}

function Card({ title, subtitle, desc, active }: any) {
  return (
    <div className={`p-8 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 group
      ${active 
        ? 'bg-white/5 border-white/10 hover:border-[var(--polaris-gold)] hover:bg-white/10 cursor-pointer' 
        : 'bg-transparent border-white/5 opacity-50 cursor-not-allowed'
      }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
        ${active ? 'bg-[var(--polaris-gold-dim)] text-[var(--polaris-gold)]' : 'bg-white/5 text-gray-500'}`}>
        {/* 简单的图标占位 */}
        <div className="w-6 h-6 border-2 border-current rounded-sm" />
      </div>
      <h3 className="text-2xl font-serif text-white">{title}</h3>
      <div className="text-xs font-bold uppercase tracking-widest text-[var(--polaris-gold)]">{subtitle}</div>
      <p className="text-sm text-gray-500 font-light">{desc}</p>
    </div>
  )
}