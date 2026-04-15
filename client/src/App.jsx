import { useState, useRef, useEffect } from 'react'
import { Send, Plus, Menu, X, MessageCircle, Trash2 } from 'lucide-react'
import ChatMessage from './components/ChatMessage'
import './App.css'

function App() {
  // State for messages
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  
  // State for sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  
  // Ref for auto-scroll
  const chatRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, loading])

  // Send message function
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Store the current input for the message
    const messageText = input

    // Add user message
    const userMessage = { 
      text: messageText, 
      sender: 'user', 
      timestamp: new Date(),
      id: Date.now()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Call the backend API
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      })

      const data = await response.json()
      const botMessage = { 
        text: data.response, 
        sender: 'bot', 
        timestamp: new Date(),
        id: Date.now() + 1
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = { 
        text: 'Sorry, something went wrong. Please try again.', 
        sender: 'bot', 
        timestamp: new Date(),
        id: Date.now() + 1
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // New conversation
  const startNewConversation = () => {
    const conversationId = Date.now()
    if (messages.length > 0) {
      setConversations(prev => [...prev, {
        id: conversationId,
        title: messages[0]?.text.substring(0, 30) + '...' || 'New Conversation',
        messages: messages,
        timestamp: new Date()
      }])
    }
    setMessages([])
    setCurrentConversationId(null)
  }

  // Load conversation
  const loadConversation = (conversation) => {
    setMessages(conversation.messages)
    setCurrentConversationId(conversation.id)
  }

  // Delete conversation
  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(conv => conv.id !== id))
    if (currentConversationId === id) {
      setMessages([])
      setCurrentConversationId(null)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'w-64' : 'w-0'
      } transition-all duration-300 bg-white border-r border-emerald-200 shadow-lg overflow-hidden flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-emerald-900">Conversations</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-emerald-600 hover:text-emerald-700"
            >
              <X size={20} />
            </button>
          </div>
          <button
            onClick={startNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-emerald-600 text-sm">
              No conversations yet
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={`p-3 mx-2 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentConversationId === conv.id
                    ? 'bg-emerald-100 border border-emerald-400'
                    : 'hover:bg-emerald-50 border border-transparent'
                }`}
                onClick={() => loadConversation(conv)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-emerald-900 truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      {conv.messages.length} messages
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteConversation(conv.id)
                    }}
                    className="text-emerald-400 hover:text-red-500 transition-colors duration-200 mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-emerald-200 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-emerald-600 hover:text-emerald-700"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-emerald-900">MediBot</h1>
                <p className="text-xs text-emerald-600">Medical Assistant AI</p>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <MessageCircle size={48} className="text-emerald-700" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">
                  Welcome to MediBot
                </h2>
                <p className="text-emerald-700 mb-6">
                  Ask me anything about medical symptoms, treatments, or health guidance. I'm here to help!
                </p>
                <div className="space-y-2 text-left">
                  <p className="text-sm font-semibold text-emerald-800">Try asking:</p>
                  <div className="text-sm text-emerald-600 space-y-1">
                    <p>• What should I do for a headache?</p>
                    <p>• Describe the symptoms of the flu</p>
                    <p>• Tell me about diabetes</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-emerald-900 px-6 py-4 rounded-2xl rounded-bl-none shadow-md border border-emerald-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-emerald-600 font-medium">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-emerald-200">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a medical question..."
                  rows="1"
                  disabled={loading}
                  className="w-full p-4 pr-14 border border-emerald-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none min-h-[56px] max-h-32 bg-white text-emerald-900 placeholder-emerald-400 transition-all duration-200"
                  onInput={(e) => {
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage(e)
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-3 bottom-3 w-10 h-10 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-3 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
