/**
 * Terms of Service Page
 *
 * Phase 12: Marketing -- Static Pages
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Appliance Tech Finder',
  description:
    'Terms of Service for Appliance Tech Finder — rules and guidelines for using our service.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: February 2026
          </p>

          <div className="prose prose-gray mt-8 max-w-none">
            <h2>1. Introduction</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to
              and use of the Appliance Tech Finder website, applications, and
              related services (collectively, the &quot;Service&quot;).
            </p>
            <p>
              Appliance Tech Finder is operated by{' '}
              <strong>MK153 Inc</strong>, a corporation incorporated in the{' '}
              <strong>State of California</strong>, United States
              (&quot;MK153&quot;, &quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;). Appliance Tech Finder is a brand operated by
              MK153 Inc.
            </p>
            <p>
              By accessing or using the Service, you agree to be bound by these
              Terms. If you do not agree, you may not use the Service.
            </p>

            <hr className="my-8" />

            <h2>2. Description of the Service</h2>
            <p>
              Appliance Tech Finder is an online directory designed to help users
              discover appliance repair companies and related businesses. The
              Service may include business listings, location-based search,
              featured placements, claim functionality, and related tools.
            </p>
            <p>
              We do not guarantee the accuracy, completeness, or availability of
              any listing or business information.
            </p>

            <hr className="my-8" />

            <h2>3. Eligibility</h2>
            <p>You must be at least 18 years old to use the Service.</p>

            <hr className="my-8" />

            <h2>4. Business Listings and Claims</h2>

            <h3>4.1 Listings</h3>
            <p>
              Business listings may be created using third-party data sources,
              automated processes, or user submissions. MK153 Inc does not
              guarantee that listings are accurate or up to date.
            </p>

            <h3>4.2 Claiming a Listing</h3>
            <p>
              Business owners or authorized representatives may submit a request
              to claim a listing. All claims are subject to manual review and
              approval. Submission does not guarantee approval.
            </p>
            <p>
              MK153 Inc reserves the right to reject, revoke, or remove claims
              at its sole discretion.
            </p>

            <hr className="my-8" />

            <h2>5. User Conduct</h2>
            <p>
              You agree not to submit false or misleading information,
              impersonate others, misuse the Service, or interfere with its
              operation.
            </p>

            <hr className="my-8" />

            <h2>6. Content Guidelines</h2>
            <p>
              All content submitted to the Service, including business
              information, reviews, and messages, must be accurate, lawful, and
              not infringe on any third-party rights. We reserve the right to
              remove any content that violates these guidelines.
            </p>

            <hr className="my-8" />

            <h2>7. Intellectual Property</h2>
            <p>
              All content, software, trademarks, logos, and technology used in
              the Service are owned by or licensed to MK153 Inc.
            </p>

            <hr className="my-8" />

            <h2>8. Disclaimers</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind. We do not warrant
              the quality, reliability, or availability of any repair service
              listed in the directory.
            </p>

            <hr className="my-8" />

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, MK153 Inc shall not be
              liable for indirect, incidental, consequential, or punitive
              damages arising from use of the Service. This includes but is not
              limited to damages resulting from reliance on directory listings or
              interactions with listed businesses.
            </p>

            <hr className="my-8" />

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless MK153 Inc from claims
              arising from your use of the Service or violation of these Terms.
            </p>

            <hr className="my-8" />

            <h2>11. Modifications</h2>
            <p>
              We may update the Service or these Terms at any time. Continued
              use constitutes acceptance of the updated Terms.
            </p>

            <hr className="my-8" />

            <h2>12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the{' '}
              <strong>State of California</strong>, without regard to
              conflict-of-law principles.
            </p>

            <hr className="my-8" />

            <h2>13. Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact:
            </p>
            <p>
              <strong>MK153 Inc</strong>
              <br />
              Email:{' '}
              <a href="mailto:support@appliancetechfinder.com">
                support@appliancetechfinder.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
