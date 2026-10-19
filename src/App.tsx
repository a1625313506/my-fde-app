import { useState } from "react";
function App(){
  const [inputText,setInputText]=useState("")
  const [messages,setMessages]=useState([
    {id:1,role:"ai",content:"你好，我是您的AI助手，今天想学什么？"}
  ])
  const handleSend=()=>{
    if(inputText.trim()===""){
      return
    }

    const newUserMsg={
      id:Date.now(),
      role:"user",
      content:inputText
    }
    setMessages([...messages,newUserMsg])
    setInputText("")
    // 4. 模拟 AI 回复（延迟 1 秒）
    setTimeout(() => {
      const newAiMsg = {
        id: Date.now() + 1,
        role: "ai",
        content: `我收到你的消息啦！你刚才说的是："${inputText}"`
      }
      
      // 注意这里：我们要用 setMessages(prev => ...) 的写法
      // 因为 1 秒后，messages 可能已经变了，直接用 messages 会拿到旧数据
      setMessages((prevMessages) => [...prevMessages, newAiMsg])
    }, 1000)
    }
  return(
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* 导航栏 */}
      <header className="headline bg-white font-bold text-center p-4 text-xl text-gray-700">🤖 My AI Assistant</header>
      {/* 聊天栏 */}
      <main className="bg-while flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {messages.map((messages)=>(
        <div key={messages.id} className={`flex ${messages.role ==='user'? 'justify-end':'justify-start'}`}>
          <div className={`p-4 rounded-lg shadow-sm max-w-md ${messages.role =='user'?'bg-blue-500 text-white':'bg-white text-gray-800'}`}>{messages.content}</div>
        </div>
      ))}  
      </main>
      {/* 底部 */}
      <footer className="flex bg-white p-4 gap-4">
        <input type="text" value={inputText} onChange={(e)=>setInputText(e.target.value)} placeholder="输入你的问题..." className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">发送</button>
      </footer>
    </div>
  )
}
export default App