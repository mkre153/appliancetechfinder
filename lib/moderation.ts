/**
 * Content Moderation
 *
 * Uses OpenAI Moderation API to check text for policy violations.
 * Fails open (returns not flagged on API error) to avoid blocking submissions.
 */

import OpenAI from 'openai'

export interface ModerationResult {
  flagged: boolean
  categories: string[]
}

/**
 * Moderate text content using OpenAI Moderation API
 */
export async function moderateText(text: string): Promise<ModerationResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.warn('[Moderation] OPENAI_API_KEY not set, skipping moderation')
      return { flagged: false, categories: [] }
    }

    const openai = new OpenAI({ apiKey })
    const response = await openai.moderations.create({ input: text })
    const result = response.results[0]

    if (result.flagged) {
      const flaggedCategories = Object.entries(result.categories)
        .filter(([, flagged]) => flagged)
        .map(([category]) => category)

      return {
        flagged: true,
        categories: flaggedCategories,
      }
    }

    return { flagged: false, categories: [] }
  } catch (error) {
    console.error('[Moderation] Text moderation failed:', error)
    // Fail open — don't block submissions on API error
    return { flagged: false, categories: [] }
  }
}
