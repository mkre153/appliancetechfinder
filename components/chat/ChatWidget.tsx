'use client'

import { useState } from 'react'
import { ChatToggleButton } from './ChatToggleButton'
import { ChatWindow } from './ChatWindow'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      <ChatToggleButton isOpen={isOpen} onClick={handleToggle} />
    </div>
  )
}
