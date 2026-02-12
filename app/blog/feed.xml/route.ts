/**
 * RSS Feed for Appliance Tech Finder Blog
 * Returns RSS 2.0 XML with all published posts
 */

import { SITE_URL, SITE_NAME } from '@/lib/config'

interface Post {
  slug: string
  title: string
  description: string
  date: string
  published: boolean
  category: string
}

async function getPosts(): Promise<Post[]> {
  try {
    const { posts } = await import('../../../.velite/index.js')
    return posts as Post[]
  } catch {
    return []
  }
}

export async function GET() {
  const posts = await getPosts()
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

  const rssItems = publishedPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}/</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
    </item>`
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <link>${SITE_URL}/blog/</link>
    <description>Tips, guides, and expert advice for appliance repair. Learn when to repair vs. replace, how to find reliable technicians, and how to maintain your appliances.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/feed.xml/" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/icon</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
