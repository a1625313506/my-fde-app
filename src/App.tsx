function App() {
  return (
    // 外层大盒子：占满屏幕高度 (h-screen)，灰色背景，纵向排布
    <div className="h-screen bg-gray-100 flex flex-col">
      
      {/* 1. 顶部导航栏 */}
      <header className="bg-white p-10 shadow-sm text-center font-bold text-xl text-gray-700">
        🤖 My AI Assistant
      </header>

      {/* 2. 中间聊天区 (flex-1 让它占满剩余空间，overflow-y-auto 允许滚动) */}
      <main className="flex-1 p-1 overflow-y-auto flex flex-col gap-4">
        
        {/* AI 的气泡 (靠左，灰色) */}
        <div className="flex justify-stard">
          <div className="bg-white p-3 rounded-lg shadow-sm max-w-md text-gray-800">
            你好！我是你的 AI 助手，今天想学点什么？
          </div>
        </div>

        {/* 用户的气泡 (靠右，蓝色) */}
        <div className="flex justify-end">
          <div className="bg-blue-500 p-3 rounded-lg shadow-sm max-w-md text-white">
            我想做全栈开发，还要懂 AI 落地！
          </div>
        </div>

      </main>

      {/* 3. 底部输入区 */}
      <footer className="bg-white p-4 flex gap-2">
        <input 
          type="text" 
          placeholder="输入你的问题..." 
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          发送
        </button>
      </footer>

    </div>
  )
}

export default App