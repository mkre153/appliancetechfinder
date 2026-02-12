/**
 * Business Outreach Email Template
 *
 * Professional email inviting appliance repair companies to claim their listing.
 * Plain HTML string builder -- no React dependency.
 *
 * Phase 12: Marketing -- Email System
 */

import { SITE_URL } from '@/lib/config'
import { getCityUrl } from '@/lib/urls'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface OutreachTemplateInput {
  companyName: string
  companyCity: string
  companyState: string
  stateSlug: string
  citySlug: string
  unsubscribeUrl: string
}

export function getOutreachSubject(companyName: string): string {
  return `${companyName} is listed on Appliance Tech Finder — claim your free listing`
}

export function renderOutreachHtml(input: OutreachTemplateInput): string {
  const name = escapeHtml(input.companyName)
  const city = escapeHtml(input.companyCity)
  const state = escapeHtml(input.companyState)
  const listingUrl = `${SITE_URL}${getCityUrl({ slug: input.stateSlug }, { slug: input.citySlug })}`

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
              <p style="color:#bfdbfe;font-size:14px;margin:0;">The appliance repair directory</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 24px 16px;">
              <h2 style="color:#1e293b;font-size:20px;font-weight:bold;margin-top:0;margin-bottom:20px;">${name} is listed on Appliance Tech Finder</h2>

              <p style="color:#475569;font-size:16px;line-height:26px;margin:0 0 16px 0;">
                Hi there,
              </p>
              <p style="color:#475569;font-size:16px;line-height:26px;margin:0 0 16px 0;">
                Your repair company, <strong>${name}</strong> in ${city}, ${state}, is already listed on
                <a href="${SITE_URL}/" style="color:#1d4ed8;text-decoration:underline;">Appliance Tech Finder</a>
                &mdash; a growing directory that connects homeowners with trusted appliance repair services.
              </p>
              <p style="color:#475569;font-size:16px;line-height:26px;margin:0 0 16px 0;">
                By claiming your listing, you can:
              </p>

              <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin-bottom:24px;">
                <tbody>
                  <tr>
                    <td style="padding:16px;background-color:#eff6ff;border-radius:6px;border-left:3px solid #1d4ed8;">
                      <p style="color:#1e293b;font-size:15px;line-height:24px;margin:0;">
                        <strong>1.</strong> Verify your business information is accurate<br/>
                        <strong>2.</strong> Add your services, hours, and specialties<br/>
                        <strong>3.</strong> Get found by homeowners searching for repair services in ${city}<br/>
                        <strong>4.</strong> Stand out from competitors with a verified badge
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style="color:#475569;font-size:16px;line-height:26px;margin:0 0 24px 0;">
                Claiming your listing is completely free and takes less than 2 minutes. No hidden fees, no obligations.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 24px 32px;text-align:center;">
              <a href="${listingUrl}?utm_source=email&utm_campaign=outreach" style="display:inline-block;background-color:#1d4ed8;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">Claim Your Free Listing</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 24px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0 0 8px 0;">Appliance Tech Finder &mdash; Find trusted appliance repair services near you</p>
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#94a3b8;font-size:12px;text-decoration:underline;">Unsubscribe from outreach emails</a>
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
