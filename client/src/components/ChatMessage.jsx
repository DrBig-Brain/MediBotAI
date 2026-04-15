function ChatMessage({ message }) {
  const isUser = message.sender === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div
        className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
          isUser
            ? 'bg-emerald-600 text-white rounded-br-none'
            : 'bg-white text-emerald-900 rounded-bl-none border border-emerald-200'
        }`}
      >
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.text}
        </p>
        <p
          className={`text-xs mt-2 ${
            isUser ? 'text-emerald-200' : 'text-emerald-500'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}

export default ChatMessage