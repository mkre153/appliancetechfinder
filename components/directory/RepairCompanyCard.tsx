/**
 * RepairCompanyCard Component
 *
 * Displays a repair company card with name, address, services, and contact info.
 * Uses tracked CTA components for phone, directions, and website links.
 */

import type { RepairCompany } from '@/lib/types'
import { PhoneLink } from '@/components/cta/PhoneLink'
import { DirectionsLink } from '@/components/cta/DirectionsLink'
import { WebsiteLink } from '@/components/cta/WebsiteLink'

interface RepairCompanyCardProps {
  company: RepairCompany
  index: number
}

export function RepairCompanyCard({ company, index }: RepairCompanyCardProps) {
  return (
    <article className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Numbered Badge */}
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          {index + 1}
        </div>

        <div className="flex-1">
          {/* Name + Rating */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            {company.rating != null && (
              <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {company.rating} ({company.reviewCount})
              </span>
            )}
          </div>

          {/* Address + Directions */}
          {company.address && (
            <p className="mt-1 flex items-center gap-1 text-gray-600">
              <DirectionsLink
                address={company.address}
                companyId={company.id}
                className="inline-flex min-h-[44px] items-center gap-1 hover:text-blue-700 hover:underline"
              />
            </p>
          )}

          {/* Phone */}
          {company.phone && (
            <p className="mt-1 flex items-center gap-1 text-gray-600">
              <PhoneLink
                phone={company.phone}
                companyId={company.id}
                className="inline-flex min-h-[44px] items-center gap-1 hover:text-blue-700 hover:underline"
              />
            </p>
          )}

          {/* Website */}
          {company.website && (
            <p className="mt-1 flex items-center gap-1 text-gray-600">
              <WebsiteLink
                url={company.website}
                companyId={company.id}
                className="inline-flex min-h-[44px] items-center gap-1 hover:text-blue-700 hover:underline"
              />
            </p>
          )}

          {/* Services Tags */}
          {company.services && company.services.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {company.services.map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                >
                  {service}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {company.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {company.description}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
