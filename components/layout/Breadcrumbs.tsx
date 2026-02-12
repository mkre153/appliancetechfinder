/**
 * Breadcrumbs Component
 *
 * Server component. Renders a breadcrumb trail with separators.
 */

import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  current: string
}

export function Breadcrumbs({ items, current }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <Link
              href={item.href}
              className="hover:text-blue-700 hover:underline"
            >
              {item.label}
            </Link>
            <span aria-hidden="true" className="text-gray-400">
              /
            </span>
          </li>
        ))}
        <li className="text-gray-900 font-medium" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  )
}
