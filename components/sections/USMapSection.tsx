'use client'

import { useRouter } from 'next/navigation'
import { USMap, StateConfig } from '@/components/us-map'

const ABBR_TO_SLUG: Record<string, string> = {
  AL: 'alabama', AK: 'alaska', AZ: 'arizona', AR: 'arkansas',
  CA: 'california', CO: 'colorado', CT: 'connecticut', DE: 'delaware',
  FL: 'florida', GA: 'georgia', HI: 'hawaii', ID: 'idaho',
  IL: 'illinois', IN: 'indiana', IA: 'iowa', KS: 'kansas',
  KY: 'kentucky', LA: 'louisiana', ME: 'maine', MD: 'maryland',
  MA: 'massachusetts', MI: 'michigan', MN: 'minnesota', MS: 'mississippi',
  MO: 'missouri', MT: 'montana', NE: 'nebraska', NV: 'nevada',
  NH: 'new-hampshire', NJ: 'new-jersey', NM: 'new-mexico', NY: 'new-york',
  NC: 'north-carolina', ND: 'north-dakota', OH: 'ohio', OK: 'oklahoma',
  OR: 'oregon', PA: 'pennsylvania', RI: 'rhode-island', SC: 'south-carolina',
  SD: 'south-dakota', TN: 'tennessee', TX: 'texas', UT: 'utah',
  VT: 'vermont', VA: 'virginia', WA: 'washington', WV: 'west-virginia',
  WI: 'wisconsin', WY: 'wyoming',
}

const stateConfig: Record<string, StateConfig> = Object.fromEntries(
  Object.keys(ABBR_TO_SLUG).map((abbr) => [
    abbr,
    { color: '#3b82f6', hoverColor: '#2563eb' },
  ])
)

export default function USMapSection() {
  const router = useRouter()

  const handleStateClick = (stateCode: string) => {
    const slug = ABBR_TO_SLUG[stateCode]
    if (slug) router.push(`/appliance-repair/${slug}/`)
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
          Find Appliance Repair by State
        </h2>
        <p className="mb-10 text-center text-gray-600">
          Click your state to find appliance repair companies near you.
        </p>
        <USMap
          stateConfig={stateConfig}
          onStateClick={handleStateClick}
          showLabels
          labelColor="#ffffff"
          labelSize={11}
          strokeColor="#ffffff"
          strokeWidth={1.5}
        />
      </div>
    </section>
  )
}
