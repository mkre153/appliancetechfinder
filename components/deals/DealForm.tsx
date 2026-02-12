'use client'

/**
 * Deal Submission Form (Client Component)
 *
 * Handles deal submission with email verification via 6-digit code.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  validateDealSubmission,
  APPLIANCE_TYPES,
  type DealFormData,
} from '@/lib/deal-submission'

export function DealForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Email verification state
  const [showVerification, setShowVerification] = useState(false)
  const [dealId, setDealId] = useState<string | null>(null)

  const [formData, setFormData] = useState<DealFormData>({
    title: '',
    description: '',
    companyName: '',
    email: '',
    phone: '',
    discountType: '',
    discountValue: '',
    applianceTypes: [],
    expiresAt: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleApplianceToggle = (type: string) => {
    setFormData((prev) => {
      const current = prev.applianceTypes
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type]
      return { ...prev, applianceTypes: updated }
    })
    if (errors.applianceTypes) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.applianceTypes
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const result = validateDealSubmission(formData)
    if (!result.valid) {
      setErrors(result.errors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          throw new Error(data.error || 'Failed to submit')
        }
        return
      }

      setDealId(data.dealId)
      setShowVerification(true)
    } catch (err) {
      setSubmitError('Failed to submit deal. Please try again.')
      console.error('Deal submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerificationSuccess = () => {
    setShowVerification(false)
    setSubmitSuccess(true)
  }

  // Success state
  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Deal Submitted!</h3>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          Your deal is under review and will be published within 24 hours.
          We will email you when it goes live.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => router.push('/deals/')}
            className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
          >
            Browse Deals
          </button>
          <button
            onClick={() => {
              setSubmitSuccess(false)
              setDealId(null)
              setFormData({
                title: '',
                description: '',
                companyName: formData.companyName,
                email: formData.email,
                phone: formData.phone,
                discountType: '',
                discountValue: '',
                applianceTypes: [],
                expiresAt: '',
              })
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Post Another Deal
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {submitError && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">{submitError}</div>
        )}

        {/* Section: Company Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <p className="mt-1 text-xs text-gray-500">We will send a verification code</p>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone <span className="text-gray-400">(optional, shown on deal)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Section: Deal Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Details</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Deal Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='e.g., "20% Off All Refrigerator Repairs This Month"'
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your deal, any conditions, and why customers should take advantage of it."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.discountType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select type...</option>
                  <option value="percentage">Percentage Off</option>
                  <option value="flat">Dollar Amount Off</option>
                  <option value="free_diagnostic">Free Diagnostic</option>
                </select>
                {errors.discountType && (
                  <p className="mt-1 text-sm text-red-500">{errors.discountType}</p>
                )}
              </div>
              <div>
                <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                  Discount Value{' '}
                  {formData.discountType === 'free_diagnostic' ? (
                    <span className="text-gray-400">(not needed)</span>
                  ) : (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <div className="relative mt-1">
                  {formData.discountType === 'flat' && (
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                  )}
                  <input
                    type="number"
                    id="discountValue"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    disabled={formData.discountType === 'free_diagnostic'}
                    className={`block w-full rounded-lg border ${
                      formData.discountType === 'flat' ? 'pl-7' : 'pl-3'
                    } pr-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      errors.discountValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={
                      formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 50'
                    }
                  />
                  {formData.discountType === 'percentage' && (
                    <span className="absolute right-3 top-2 text-gray-500">%</span>
                  )}
                </div>
                {errors.discountValue && (
                  <p className="mt-1 text-sm text-red-500">{errors.discountValue}</p>
                )}
              </div>
            </div>

            {/* Appliance type checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appliance Types <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {APPLIANCE_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                      formData.applianceTypes.includes(type)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.applianceTypes.includes(type)}
                      onChange={() => handleApplianceToggle(type)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        formData.applianceTypes.includes(type)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {formData.applianceTypes.includes(type) && (
                        <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {type}
                  </label>
                ))}
              </div>
              {errors.applianceTypes && (
                <p className="mt-1 text-sm text-red-500">{errors.applianceTypes}</p>
              )}
            </div>

            {/* Expiration date */}
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
                Expires On <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="expiresAt"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.expiresAt ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiresAt && (
                <p className="mt-1 text-sm text-red-500">{errors.expiresAt}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Deal'}
          </button>
          <p className="mt-3 text-center text-sm text-gray-500">
            Deals are moderated and expire on the date you set. Free to post.
          </p>
        </div>
      </form>

      {/* Email Verification Modal */}
      {showVerification && dealId && (
        <VerificationModal
          email={formData.email}
          dealId={dealId}
          onSuccess={handleVerificationSuccess}
        />
      )}
    </>
  )
}

/**
 * Email verification modal with 6-digit code input
 */
function VerificationModal({
  email,
  dealId,
  onSuccess,
}: {
  email: string
  dealId: string
  onSuccess: () => void
}) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useState<(HTMLInputElement | null)[]>([])[0]

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError(null)

    if (value && index < 5) {
      inputRefs[index + 1]?.focus()
    }

    if (value && index === 5 && newCode.every((d) => d !== '')) {
      handleVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData.length === 6) {
      setCode(pastedData.split(''))
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (codeString: string) => {
    setIsVerifying(true)
    setError(null)

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', code: codeString }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid code')
        setCode(['', '', '', '', '', ''])
        inputRefs[0]?.focus()
        return
      }

      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setIsResending(true)
    setError(null)

    try {
      await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend' }),
      })
      setResendCooldown(60)
      setCode(['', '', '', '', '', ''])
      inputRefs[0]?.focus()
    } catch {
      setError('Failed to resend code.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 className="mt-4 text-xl font-semibold text-gray-900">Check your email</h3>
          <p className="mt-2 text-gray-600">We have sent a 6-digit code to</p>
          <p className="font-medium text-gray-900">{email}</p>

          <div className="mt-6 flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isVerifying}
                className={`h-14 w-12 rounded-lg border-2 text-center text-2xl font-bold transition-colors
                  ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
                  disabled:bg-gray-100 disabled:cursor-not-allowed`}
              />
            ))}
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            onClick={() => handleVerify(code.join(''))}
            disabled={code.some((d) => !d) || isVerifying}
            className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify & Submit'}
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Did not receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="font-medium text-blue-600 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              {isResending
                ? 'Sending...'
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend code'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
