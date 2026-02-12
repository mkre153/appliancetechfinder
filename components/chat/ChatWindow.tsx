'use client'

import { useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { useChatStream } from '@/lib/chat/hooks'

interface ChatWindowProps {
  onClose: () => void
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const { messages, isStreaming, limitReached, send, reset } = useChatStream()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex h-[384px] w-[500px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl max-sm:h-[85vh] max-sm:w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-blue-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
            ATF
          </div>
          <div>
            <p className="text-sm font-medium text-white">ATF Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={reset}
              className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Reset conversation"
              title="Start over"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close chat"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-6">
            <p className="text-center text-sm text-gray-500">
              Ask me anything about appliance repair, costs, or finding a technician.
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {limitReached && (
              <div className="rounded-lg bg-amber-50 p-3 text-center text-xs text-amber-800">
                Conversation limit reached. For more help, email{' '}
                <a href="mailto:support@appliancetechfinder.com" className="underline">
                  support@appliancetechfinder.com
                </a>
                .
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={send} disabled={isStreaming || limitReached} />
    </div>
  )
}
