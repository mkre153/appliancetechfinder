/**
 * HowItWorks Component
 *
 * 3-step guide showing how to use the directory.
 */

const STEPS = [
  {
    number: 1,
    title: 'Search Your Area',
    description:
      'Browse by state and city to find appliance repair companies near you.',
  },
  {
    number: 2,
    title: 'Compare Ratings & Services',
    description:
      'Review ratings, services offered, and contact details to find the right fit.',
  },
  {
    number: 3,
    title: 'Contact a Technician',
    description:
      'Reach out directly by phone or website to schedule your repair.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
          How It Works
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
