/**
 * FAQ Component
 *
 * 6 common questions about appliance repair with detailed answers.
 */

const FAQS = [
  {
    question: 'How much does appliance repair cost?',
    answer:
      'The cost of appliance repair varies depending on the type of appliance, the nature of the problem, and your location. On average, most repairs range from $100 to $400, including parts and labor. Simple fixes like replacing a belt or thermostat tend to be on the lower end, while compressor or motor replacements can cost more. Most technicians charge a diagnostic fee of $50 to $100, which is often applied toward the total repair cost.',
  },
  {
    question: 'Should I repair or replace my appliance?',
    answer:
      'A common rule of thumb is the 50% rule: if the repair costs more than 50% of what a new appliance would cost, replacement is usually the better investment. Also consider the age of the appliance. Most major appliances last 10 to 15 years. If yours is nearing the end of its expected lifespan and breaking down frequently, replacing it may save money in the long run. A qualified technician can help you weigh the options.',
  },
  {
    question: 'How do I find a reliable repair technician?',
    answer:
      'Look for technicians who are licensed, insured, and have positive customer reviews. Ask about warranty on their work, and check if they specialize in your appliance brand. Our directory makes it easy to compare local repair companies by rating, services offered, and contact information so you can make an informed choice.',
  },
  {
    question: 'What appliances do repair companies service?',
    answer:
      'Most repair companies service a wide range of household appliances including refrigerators, freezers, washers, dryers, dishwashers, ovens, ranges, microwaves, and garbage disposals. Some also handle commercial equipment or specialize in specific brands. Check the services listed on each company\'s listing to confirm they work on your particular appliance.',
  },
  {
    question: 'How long does a typical repair take?',
    answer:
      'Many common appliance repairs can be completed in a single visit lasting 1 to 2 hours. However, if the technician needs to order a specific part, the repair may require a follow-up visit, extending the total timeline to a few days or up to a week. Scheduling availability in your area can also affect how quickly you get an appointment.',
  },
  {
    question: 'Are repairs covered by warranty?',
    answer:
      'It depends. If your appliance is still under the manufacturer\'s warranty, repairs for covered defects are typically free. Extended warranties or home warranty plans may also cover repair costs. For out-of-warranty appliances, many repair companies offer their own guarantee on parts and labor, usually ranging from 30 to 90 days. Always ask about warranty coverage before authorizing work.',
  },
]

export function FAQ() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>

        <div className="mx-auto max-w-3xl space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.question} className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                {faq.question}
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
