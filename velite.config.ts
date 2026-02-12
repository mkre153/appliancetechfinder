import { defineConfig, defineCollection, s } from 'velite'

// Blog Post collection
const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/*.mdx',
  schema: s
    .object({
      title: s.string().max(70),
      description: s.string().max(160),
      slug: s.slug('posts'),
      date: s.isodate(),
      updated: s.isodate().optional(),
      category: s.enum(['tips', 'guides', 'maintenance', 'savings']),
      published: s.boolean().default(true),
      // Content
      body: s.raw(),
      raw: s.raw(),
    })
    .transform((data) => {
      // Calculate reading time (~200 wpm)
      const wordCount = data.raw.split(/\s+/).length
      const minutes = Math.ceil(wordCount / 200)
      return {
        ...data,
        readingTime: `${minutes} min read`,
        wordCount,
      }
    }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts },
})
