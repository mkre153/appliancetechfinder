/**
 * Admin Layout
 *
 * Simple admin layout with navigation.
 * Non-discoverable: NOT in sitemap, NO public links.
 */

import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link
                href="/admin/"
                className="text-sm font-semibold text-gray-900 hover:text-blue-600"
              >
                Admin
              </Link>
              <Link
                href="/admin/submissions/"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Submissions
              </Link>
              <Link
                href="/admin/stores/"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Stores
              </Link>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
