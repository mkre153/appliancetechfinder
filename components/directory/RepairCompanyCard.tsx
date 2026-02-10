/**
 * RepairCompanyCard Component
 *
 * Displays a repair company card with name, address, services, and contact info.
 */

import type { RepairCompany } from '@/lib/types'

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

          {/* Address */}
          {company.address && (
            <p className="mt-1 flex items-center gap-1 text-gray-600">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {company.address}
            </p>
          )}

          {/* Phone */}
          {company.phone && (
            <p className="mt-1 flex items-center gap-1 text-gray-600">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${company.phone}`} className="hover:text-blue-700 hover:underline">
                {company.phone}
              </a>
            </p>
          )}

          {/* Website */}
          {company.website && (
            <p className="mt-1 flex items-center gap-1 text-gray-600">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700 hover:underline"
              >
                Visit Website
              </a>
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
