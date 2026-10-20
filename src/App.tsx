import { useState } from 'react'

function App() {
  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState([
    { id: 1, role: "ai", content: "你好！我是你的 AI 助手，今天想学点什么？" }
  ])

  const handleSend = async () => {
    // 1. 判空
    if (inputText.trim() === "") return;

    // 2. 先把用户的消息上屏
    const newUserMsg = { id: Date.now(), role: "user", content: inputText };
    setMessages((prev) => [...prev, newUserMsg]);
    
    // 3. 暂存当前输入，并清空输入框
    const currentInput = inputText;
    setInputText("");

    // 4. 发起真实的网络请求给 Python 后端
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: currentInput })
      });

      // 解析后端返回的 JSON 数据
      const data = await response.json();

      // 5. 把后端的回复上屏
      const newAiMsg = { 
        id: Date.now() + 1, 
        role: "ai", 
        content: data.reply 
      };
      setMessages((prev) => [...prev, newAiMsg]);

    } catch (error) {
      // 如果后端没开，或者网络报错，咱们就弹昨天写的那个黄色警告气泡！
      console.error("请求失败:", error);
      const errorMsg = { 
        id: Date.now() + 2, 
        role: "warn", 
        content: "网络请求失败，请检查 Python 后端是否启动！" 
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* 顶部导航 */}
      <header className="bg-white p-4 shadow-sm text-center font-bold text-xl text-gray-700">
        🤖 My AI Assistant
      </header>

      {/* 聊天区域 */}
      <main className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg) => {
          // 用 if-else 处理我们自定义的三种样式
          let align = "justify-start";
          let bubbleColor = "bg-white text-gray-800";

          if (msg.role === "user") {
            align = "justify-end";
            bubbleColor = "bg-blue-500 text-white";
          } else if (msg.role === "warn") {
            align = "justify-center"; // 警告居中
            bubbleColor = "bg-yellow-500 text-white"; // 警告用黄色
          }

          return (
            <div key={msg.id} className={`flex ${align}`}>
              <div className={`p-3 rounded-lg shadow-sm max-w-md ${bubbleColor}`}>
                {msg.content}
              </div>
            </div>
          )
        })}
      </main>

      {/* 底部输入区 */}
      <footer className="bg-white p-4 flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入你的问题..." 
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSend} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          发送
        </button>
      </footer>
    </div>
  )
}

export default App