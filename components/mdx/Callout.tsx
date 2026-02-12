/**
 * Callout component for blog posts
 * Types: info (blue), warning (amber), tip (green), danger (red)
 */

import { ReactNode } from 'react'

type CalloutType = 'info' | 'warning' | 'tip' | 'danger'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

const styles: Record<
  CalloutType,
  { bg: string; border: string; icon: string; title: string }
> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'i',
    title: 'text-blue-900',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: '!',
    title: 'text-amber-900',
  },
  tip: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: '*',
    title: 'text-green-900',
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'X',
    title: 'text-red-900',
  },
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const style = styles[type]

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 my-6`}>
      {title && (
        <div
          className={`flex items-center gap-2 font-semibold ${style.title} mb-2`}
        >
          <span className="w-5 h-5 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold">
            {style.icon}
          </span>
          <span>{title}</span>
        </div>
      )}
      <div className="text-slate-700 text-sm leading-relaxed [&>p]:my-0">
        {children}
      </div>
    </div>
  )
}
