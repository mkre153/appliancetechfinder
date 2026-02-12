/**
 * Blog Post Detail Page
 * Renders individual blog posts with MDX content
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { compileMDX } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx'
import { SITE_NAME, SITE_URL } from '@/lib/config'
import { JsonLd } from '@/lib/schema'
import { getAllStatesUrl, getBlogUrl, getBlogPostUrl } from '@/lib/urls'

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
  body: string
  raw: string
}

async function getPosts(): Promise<Post[]> {
  try {
    const { posts } = await import('../../../.velite/index.js')
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

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts
    .filter((post) => post.published)
    .map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const posts = await getPosts()
  const post = posts.find((p) => p.slug === slug && p.published)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    alternates: {
      canonical: `${SITE_URL}${getBlogPostUrl(post.slug)}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}${getBlogPostUrl(post.slug)}`,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
    },
  }
}

function generateArticleSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

function generateBreadcrumbSchema(post: Post) {
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
        item: `${SITE_URL}${getBlogUrl()}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}${getBlogPostUrl(post.slug)}`,
      },
    ],
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const posts = await getPosts()
  const post = posts.find((p) => p.slug === slug && p.published)

  if (!post) {
    notFound()
  }

  // Compile MDX content server-side
  const { content } = await compileMDX({
    source: post.body,
    components: mdxComponents,
  })

  const articleSchema = generateArticleSchema(post)
  const breadcrumbSchema = generateBreadcrumbSchema(post)

  return (
    <>
      {/* Structured Data */}
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <article className="pt-8 pb-16">
        {/* Header */}
        <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog/" className="hover:text-blue-600">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900">{post.title}</span>
          </nav>

          {/* Category badge */}
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full mb-4">
            {categoryLabels[post.category] || post.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 max-w-2xl">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-600 max-w-2xl mb-4">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="font-medium text-slate-700">
              {SITE_NAME}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{post.readingTime}</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl prose prose-slate prose-lg prose-headings:scroll-mt-24">
            {content}
          </div>
        </div>

        {/* Find a Technician CTA */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Find a Repair Technician
            </h2>
            <div className="grid gap-4">
              <Link
                href={getAllStatesUrl()}
                className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
              >
                <span className="text-xs text-blue-600 uppercase tracking-wide font-medium">
                  Directory
                </span>
                <span className="block mt-1 font-medium text-slate-900">
                  Browse Appliance Repair Companies by State &rarr;
                </span>
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}
