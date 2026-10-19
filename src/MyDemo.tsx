function Mydemo(){
  return(
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* 导航栏 */}
      <header className="headline bg-white font-bold text-center p-4 text-xl text-gray-700">🤖 My AI Assistant</header>
      {/* 聊天栏 */}
      <main className="bg-while flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* AI */}
        <div className=" flex justify-start">
          <div className=" bg-white p-4 rounded-lg shadow-sm max-w-md text-gray-800">你好！我是你的 AI 助手，今天想学点什么？</div>
        </div>
        {/* 用户 */}
        {/* AI */}
        <div className=" flex justify-end">
          <div className=" bg-blue-500 p-4 rounded-lg shadow-sm max-w-md text-gray-800">我想做全栈开发，还要懂 AI 落地！</div>
        </div>
      </main>
      {/* 底部 */}
      <footer className="flex bg-white p-4 gap-4">
        <input type="text" placeholder="输入你的问题..." className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">发送</button>
      </footer>
    </div>
  )
}
export default Mydemo