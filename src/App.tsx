import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function App() {
  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState<{id: number, role: string, content: string}[]>([])
  const [isLoading, setIsLoading] = useState(false);
  
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [historyList, setHistoryList] = useState<number[]>([]); 

  // 1. 页面初始化，只执行一次：建一个新房间
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/conversation/new", { method: "POST" });
        const data = await res.json();
        setConversationId(data.conversation_id);
        setHistoryList([data.conversation_id]);
      } catch (error) {
        console.error("初始化失败", error);
      }
    };
    init();
  }, []);

  // 2. 监听会话ID变化，拉取对应房间的历史记录
  useEffect(() => {
    if (!conversationId) return;
    
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/history/${conversationId}`);
        const data = await res.json();
        
        if (data.history && data.history.length > 0) {
          setMessages(data.history);
        } else {
          setMessages([{ id: Date.now(), role: "ai", content: "你好！这是一个新会话，今天想聊点什么？" }]);
        }
      } catch (error) {
        console.error("拉取历史失败", error);
      }
    };
    fetchHistory();
  }, [conversationId]); 

  // 3. 左侧边栏点击“新建对话”的函数
  const handleNewChat = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/conversation/new", { method: "POST" });
      const data = await res.json();
      setHistoryList(prev => [data.conversation_id, ...prev]);
      setConversationId(data.conversation_id);
    } catch (error) {
      console.error("新建房间失败", error);
    }
  }// 4. 发送消息
  const handleSend = async () => {
    if (inputText.trim() === "" || isLoading || !conversationId) return;

    const newUserMsg = { id: Date.now(), role: "user", content: inputText };
    setMessages((prev) => [...prev, newUserMsg]);
    
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);
    
    const updatedMessages = [...messages, newUserMsg];

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, conversation_id: conversationId })
      });

      if (!response.ok) throw new Error("网络请求失败");

      const aiMsgId = Date.now() + 1;
      setMessages((prev) => [...prev, { id: aiMsgId, role: "ai", content: "" }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiContent = ""; 

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]" || !dataStr) continue;
              try {
                const parsed = JSON.parse(dataStr);
                const textChunk = parsed.choices[0]?.delta?.content || "";
                if (textChunk) {
                  aiContent += textChunk; 
                  setMessages((prev) => 
                    prev.map((msg) => 
                      msg.id === aiMsgId ? { ...msg, content: aiContent } : msg
                    )
                  );
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (error) {
      const errorMsg = { id: Date.now() + 2, role: "warn", content: "网络请求失败！" };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false); 
    }
  }
  return (
    <div className="h-screen bg-gray-100 flex">
      {/* 左侧边栏 */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4">
          <button 
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition-colors"
          >
            + 新建对话
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2">
          {historyList.map((id) => (
            <div 
              key={id}
              onClick={() => setConversationId(id)}
              className={`p-3 mb-2 rounded-lg cursor-pointer text-sm truncate transition-colors ${
                conversationId === id ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
            >
              💬 会话 # {id}
            </div>
          ))}
        </div>
      </div>

      {/* 右侧主聊天区 */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <header className="bg-white p-4 shadow-sm text-center font-bold text-xl text-gray-700">
          🤖 My AI Assistant {conversationId ? `(当前房间: ${conversationId})` : ''}
        </header>

        <main className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg) => {
            let align = "justify-start";
            let bubbleColor = "bg-white text-gray-800";
            if (msg.role === "user") {
              align = "justify-end";
              bubbleColor = "bg-blue-500 text-white";
            } else if (msg.role === "warn") {
              align = "justify-center"; 
              bubbleColor = "bg-yellow-500 text-white"; 
            }
            return (
              <div key={msg.id} className={`flex ${align}`}>
                <div className={`p-3 rounded-lg shadow-sm max-w-md ${bubbleColor} overflow-hidden`}>
                  {msg.role === 'ai' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            )
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg shadow-sm text-gray-500 animate-pulse">AI 正在思考中... 💭</div>
            </div>
          )}
        </main>

        <footer className="bg-white p-4 flex gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的问题..." 
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading}
            className={`text-white px-6 py-2 rounded-lg font-medium transition-colors ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "发送中..." : "发送"}
          </button>
        </footer>
      </div>
    </div>
  )
}

export default App