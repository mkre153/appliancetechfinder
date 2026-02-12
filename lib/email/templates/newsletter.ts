/**
 * Newsletter Email Template
 *
 * Plain HTML string builder -- no React dependency.
 * Renders a weekly digest of featured companies and repair tips.
 *
 * Phase 12: Marketing -- Email System
 */

interface NewsletterPost {
  title: string
  description: string
  slug: string
}

interface FeaturedCompany {
  name: string
  city: string
  state: string
  slug: string
  stateSlug: string
  citySlug: string
}

import { SITE_URL } from '@/lib/config'
import { getAllStatesUrl, getCityUrl, getBlogPostUrl } from '@/lib/urls'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderNewsletterHtml(
  posts: NewsletterPost[],
  featuredCompanies: FeaturedCompany[],
  unsubscribeUrl: string
): string {
  const postCards = posts
    .map(
      (post) => `
      <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin-bottom:16px;border-left:3px solid #1d4ed8;">
        <tbody><tr>
          <td style="padding:12px 16px;background-color:#f8fafc;">
            <h3 style="color:#1e293b;font-size:16px;font-weight:600;margin:0 0 6px 0;">${escapeHtml(post.title)}</h3>
            <p style="color:#475569;font-size:14px;line-height:20px;margin:0 0 8px 0;">${escapeHtml(post.description)}</p>
            <a href="${SITE_URL}${getBlogPostUrl(post.slug)}" style="color:#1d4ed8;font-size:14px;font-weight:600;text-decoration:none;">Read more &rarr;</a>
          </td>
        </tr></tbody>
      </table>`
    )
    .join('\n')

  const companyCards = featuredCompanies
    .map(
      (company) => `
      <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin-bottom:12px;">
        <tbody><tr>
          <td style="padding:12px 16px;background-color:#eff6ff;border-radius:6px;">
            <h4 style="color:#1e293b;font-size:15px;font-weight:600;margin:0 0 4px 0;">${escapeHtml(company.name)}</h4>
            <p style="color:#475569;font-size:13px;margin:0 0 6px 0;">${escapeHtml(company.city)}, ${escapeHtml(company.state)}</p>
            <a href="${SITE_URL}${getCityUrl({ slug: company.stateSlug }, { slug: company.citySlug })}" style="color:#1d4ed8;font-size:13px;text-decoration:none;">View listing &rarr;</a>
          </td>
        </tr></tbody>
      </table>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;">
<table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;background-color:#f1f5f9;">
  <tbody><tr>
    <td align="center" style="padding:24px 0;">
      <table cellpadding="0" cellspacing="0" role="presentation" style="width:600px;max-width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <tbody>
          <!-- Header -->
          <tr>
            <td style="background-color:#1d4ed8;padding:32px 24px;text-align:center;">
              <h1 style="color:#ffffff;font-size:26px;font-weight:bold;margin:0 0 4px 0;">Appliance Tech Finder</h1>
              <p style="color:#bfdbfe;font-size:14px;margin:0;">Your weekly repair tips &amp; featured companies</p>
            </td>
          </tr>

          <!-- Featured Companies -->
          ${
            companyCards
              ? `<tr>
            <td style="padding:32px 24px 16px;">
              <h2 style="color:#1e293b;font-size:20px;font-weight:bold;margin-top:0;margin-bottom:20px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">Featured Repair Companies</h2>
              ${companyCards}
            </td>
          </tr>`
              : ''
          }

          <!-- Latest Tips -->
          ${
            postCards
              ? `<tr>
            <td style="padding:16px 24px;">
              <h2 style="color:#1e293b;font-size:20px;font-weight:bold;margin-top:0;margin-bottom:20px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">Repair Tips &amp; Advice</h2>
              ${postCards}
            </td>
          </tr>`
              : ''
          }

          <!-- Quick Tip -->
          <tr>
            <td style="padding:0 24px 24px;">
              <h2 style="color:#1e293b;font-size:18px;font-weight:bold;margin-top:0;margin-bottom:8px;">Quick Tip</h2>
              <p style="color:#475569;font-size:14px;line-height:22px;margin:0;padding:12px 16px;background-color:#eff6ff;border-radius:6px;border:1px solid #bfdbfe;">
                Regular maintenance extends appliance life by 30-50%. Clean refrigerator coils every 6 months and check washing machine hoses yearly to prevent costly repairs.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 24px 32px;text-align:center;">
              <a href="${SITE_URL}${getAllStatesUrl()}" style="display:inline-block;background-color:#1d4ed8;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">Find Repair Services Near You</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 24px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0 0 8px 0;">Appliance Tech Finder &mdash; Find trusted appliance repair services near you</p>
              <p style="color:#94a3b8;font-size:12px;margin:0 0 8px 0;">
                <a href="${escapeHtml(unsubscribeUrl)}" style="color:#94a3b8;font-size:12px;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr></tbody>
</table>
</body>
</html>`
}
