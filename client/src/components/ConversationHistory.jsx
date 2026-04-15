import { Trash2 } from 'lucide-react'

function ConversationHistory({ conversations, currentConversationId, onSelect, onDelete }) {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-emerald-600 text-sm">
        No conversations yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map(conv => (
        <div
          key={conv.id}
          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            currentConversationId === conv.id
              ? 'bg-emerald-100 border border-emerald-400'
              : 'hover:bg-emerald-50 border border-transparent'
          }`}
          onClick={() => onSelect(conv)}
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
                onDelete(conv.id)
              }}
              className="text-emerald-400 hover:text-red-500 transition-colors duration-200 mt-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ConversationHistory