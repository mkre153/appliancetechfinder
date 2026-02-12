/**
 * Blog Index Page
 * Lists all published blog posts sorted by date descending
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/config'
import { JsonLd } from '@/lib/schema'

interface Post {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  category: string
  published: boolean
  readingTime: string
  wordCount: number
}

async function getPosts(): Promise<Post[]> {
  try {
    const { posts } = await import('../../.velite/index.js')
    return posts as Post[]
  } catch {
    return []
  }
}

const categoryLabels: Record<string, string> = {
  tips: 'Tips',
  guides: 'Guides',
  maintenance: 'Maintenance',
  savings: 'Savings',
}

export const metadata: Metadata = {
  title: `Appliance Repair Tips & Guides | ${SITE_NAME}`,
  description:
    'Tips, guides, and expert advice for appliance repair. Learn when to repair vs. replace, how to find reliable technicians, and how to maintain your appliances.',
  alternates: {
    canonical: `${SITE_URL}/blog/`,
  },
}

function generateBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog/`,
      },
    ],
  }
}

export default async function BlogPage() {
  const posts = await getPosts()
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema()} />

      <div className="pt-8 pb-16">
        {/* Header */}
        <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <nav className="mb-4 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900">Blog</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Appliance Repair Tips & Guides
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Expert advice on appliance maintenance, repair decisions, and
            finding trusted technicians in your area.
          </p>

          {/* Category filter links */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1.5 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
              All
            </span>
            {Object.entries(categoryLabels).map(([key, name]) => (
              <Link
                key={key}
                href={`/blog/${key}/`}
                className="inline-flex items-center px-3 py-1.5 text-sm rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                {name}
              </Link>
            ))}
          </div>
        </header>

        {/* Posts Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {publishedPosts.length === 0 ? (
            <p className="text-slate-600">
              No posts yet. Check back soon for helpful content!
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {publishedPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Link href={`/blog/${post.slug}/`} className="block p-6">
                    {/* Category */}
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full mb-3">
                      {categoryLabels[post.category] || post.category}
                    </span>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{post.readingTime}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
