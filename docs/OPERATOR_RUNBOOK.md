# Appliance Tech Finder — Operator Runbook

## Claim Approval Checklist

Before approving any company claim:

1. **Verify business ownership** — Confirm the submitter is the business owner or authorized representative
2. **Phone verification** — Call the listed business phone number and confirm the claim
3. **Email verification** — Ensure the email domain matches the business website (e.g., john@acmerepair.com for acmerepair.com)
4. **Google Maps cross-reference** — Verify the business exists at the listed address on Google Maps
5. **Duplicate check** — Search repair_companies for existing entries with the same phone, address, or name
6. **Document the approval** — Note the verification method and date in the admin notes

## Company Data Management

### Adding a New Company
1. Verify the company meets minimum data requirements: name, address, city, state, phone
2. Geocode the address to get lat/lng coordinates
3. Generate a URL-safe slug from the company name
4. Set `is_approved: true` only after verification
5. Confirm the city and state exist in the `cities` and `states` tables

### Editing a Company
1. Only edit verified fields — do not overwrite user-submitted data without reason
2. If address changes, re-geocode for updated lat/lng
3. Update `updated_at` timestamp
4. Log the change reason

### Removing a Company
1. **Soft-delete preferred** — Set `is_approved: false` rather than deleting the row
2. If hard-deleting, export the row to a backup CSV first
3. Document the removal reason (closed, duplicate, spam, owner request)

## Deals Moderation

### Approval Workflow
1. Review submitted deal content for accuracy and appropriateness
2. Verify the deal is associated with an approved company
3. Check for misleading pricing or expired offers
4. Approve or reject with a reason

### Content Guidelines
- Deals must include: company name, offer description, valid dates
- No profanity, discriminatory language, or misleading claims
- Prices must be in USD
- "Up to X% off" claims must be verifiable

## Submission Review

### New Company Submission Workflow
1. New submissions arrive with status `pending`
2. Email verification sends a code to the submitter's email
3. After email verification, status changes to `verified`
4. Operator reviews verified submissions:
   - Cross-reference with Google Maps / Google Business Profile
   - Check for duplicates in existing data
   - Verify phone number is active
5. Approve → status becomes `approved`, company is created in `repair_companies`
6. Reject → status becomes `rejected`, submitter is notified with reason

### Red Flags
- Multiple submissions from the same IP in a short period
- Generic email addresses (gmail, yahoo) for businesses claiming a branded website
- Address that doesn't match any known commercial location
- Phone number already associated with a different company

## Monitoring & Alerts

### Daily Checks
- Review pending submissions queue
- Check for error spikes in Vercel logs
- Monitor Supabase usage dashboard

### Weekly Checks
- Review CTA event analytics (phone clicks, direction clicks, website clicks)
- Check Google Search Console for indexing issues
- Verify sitemap is up to date with current city/state counts

### Monthly Checks
- Audit company data quality (missing phones, missing coordinates)
- Review AdSense performance
- Check for stale/outdated company listings

## Never Do

- **Never delete a company row without exporting a backup first**
- **Never approve a company without completing the verification checklist**
- **Never share the Supabase service role key** — it has full database access
- **Never run bulk updates without testing on a single row first**
- **Never modify the `states` or `cities` tables without coordinating with SDF** — these tables are shared
- **Never push directly to main** — always use a branch and PR
