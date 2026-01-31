import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Polaris OS | 北极星操作系统',
  description: '决策支持与能力进化系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col items-center">
        {/* 背景光效装饰 */}
        <div className="fixed top-[-20%] left-[50%] translate-x-[-50%] w-[600px] h-[600px] bg-[var(--polaris-gold)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none z-[-1]" />
        
        {/* 顶部导航 */}
        <nav className="w-full border-b border-white/5 bg-[#1a2332]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="text-xl font-bold text-[var(--polaris-gold)] tracking-wider">Polaris OS</div>
            <div className="text-xs font-mono text-gray-500">v1.0.0 Alpha</div>
          </div>
        </nav>

        <main className="w-full max-w-5xl px-6 py-10 flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}