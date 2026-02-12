'use client'

/**
 * Repair Company Submission Form
 *
 * Client component with two-step flow:
 * 1. Fill out company details -> POST /api/submissions/start
 * 2. Enter 6-digit verification code -> POST /api/submissions/verify
 */

import { useState, type FormEvent } from 'react'
import { US_STATES } from '@/lib/store-submission'

type FormStep = 'details' | 'verify' | 'success'

interface FormErrors {
  [key: string]: string
}

export function SubmissionForm() {
  const [step, setStep] = useState<FormStep>('details')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [globalError, setGlobalError] = useState('')
  const [submissionId, setSubmissionId] = useState('')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  // Form fields
  const [companyName, setCompanyName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [emailField, setEmailField] = useState('')
  const [services, setServices] = useState('')
  const [description, setDescription] = useState('')

  // =========================================================================
  // Client-side validation
  // =========================================================================

  function validateDetails(): FormErrors {
    const errs: FormErrors = {}

    if (!companyName.trim()) errs.companyName = 'Company name is required'
    if (!address.trim()) errs.address = 'Street address is required'
    if (!city.trim()) errs.city = 'City is required'
    if (!state) errs.state = 'State is required'

    if (!zip.trim()) {
      errs.zip = 'ZIP code is required'
    } else if (!/^\d{5}(-\d{4})?$/.test(zip.trim())) {
      errs.zip = 'Please enter a valid ZIP code'
    }

    if (!phone.trim()) {
      errs.phone = 'Phone number is required'
    } else {
      const digits = phone.replace(/\D/g, '')
      if (digits.length < 10 || digits.length > 11) {
        errs.phone = 'Please enter a valid phone number'
      }
    }

    if (!emailField.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.trim())) {
      errs.email = 'Please enter a valid email address'
    }

    if (website.trim()) {
      try {
        new URL(website)
      } catch {
        errs.website = 'Please enter a valid URL (e.g., https://example.com)'
      }
    }

    return errs
  }

  // =========================================================================
  // Step 1: Submit details
  // =========================================================================

  async function handleSubmitDetails(e: FormEvent) {
    e.preventDefault()
    setGlobalError('')

    const validationErrors = validateDetails()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    setSubmitting(true)

    try {
      const response = await fetch('/api/submissions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          address,
          city,
          state,
          zip,
          phone,
          email: emailField,
          website: website || undefined,
          services: services || undefined,
          description: description || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setGlobalError(data.error || 'Something went wrong. Please try again.')
        }
        return
      }

      setSubmissionId(data.submissionId)
      setEmail(data.email)
      setStep('verify')
    } catch {
      setGlobalError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // =========================================================================
  // Step 2: Verify code
  // =========================================================================

  async function handleVerify(e: FormEvent) {
    e.preventDefault()
    setGlobalError('')

    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setGlobalError('Please enter the 6-digit verification code.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/submissions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          code: verificationCode.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setGlobalError(
          data.error || 'Verification failed. Please try again.'
        )
        return
      }

      setStep('success')
    } catch {
      setGlobalError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // =========================================================================
  // Render: Success
  // =========================================================================

  if (step === 'success') {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Submission Received!
        </h2>
        <p className="mt-2 text-gray-600">
          Thank you for suggesting a repair company. Our team will review your
          submission and add it to the directory if approved.
        </p>
      </div>
    )
  }

  // =========================================================================
  // Render: Verification Code
  // =========================================================================

  if (step === 'verify') {
    return (
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-gray-600">
            We sent a 6-digit verification code to{' '}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        {globalError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {globalError}
          </div>
        )}

        <div>
          <label
            htmlFor="verificationCode"
            className="block text-sm font-medium text-gray-700"
          >
            Verification Code
          </label>
          <input
            id="verificationCode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, ''))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-2xl tracking-widest shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="000000"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting ? 'Verifying...' : 'Verify Email'}
        </button>

        <p className="text-center text-sm text-gray-500">
          The code expires in 10 minutes.
        </p>
      </form>
    )
  }

  // =========================================================================
  // Render: Details Form
  // =========================================================================

  return (
    <form onSubmit={handleSubmitDetails} className="space-y-6">
      {globalError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {globalError}
        </div>
      )}

      {/* Company Name */}
      <div>
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700"
        >
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            errors.companyName
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="ABC Appliance Repair"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            errors.address
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="123 Main St"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      {/* City + State row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
              errors.city
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="San Diego"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
              errors.state
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          >
            <option value="">Select state</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state}</p>
          )}
        </div>
      </div>

      {/* ZIP + Phone row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="zip"
            className="block text-sm font-medium text-gray-700"
          >
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            id="zip"
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
              errors.zip
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="92101"
            maxLength={10}
          />
          {errors.zip && (
            <p className="mt-1 text-sm text-red-600">{errors.zip}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
              errors.phone
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="(619) 555-1234"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={emailField}
          onChange={(e) => setEmailField(e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            errors.email
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="info@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          We will send a verification code to this email.
        </p>
      </div>

      {/* Website */}
      <div>
        <label
          htmlFor="website"
          className="block text-sm font-medium text-gray-700"
        >
          Website
        </label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 ${
            errors.website
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="https://example.com"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website}</p>
        )}
      </div>

      {/* Services */}
      <div>
        <label
          htmlFor="services"
          className="block text-sm font-medium text-gray-700"
        >
          Services Offered
        </label>
        <input
          id="services"
          type="text"
          value={services}
          onChange={(e) => setServices(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Refrigerator repair, washer repair, dryer repair"
        />
        <p className="mt-1 text-xs text-gray-500">
          Separate multiple services with commas.
        </p>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Brief description of the company and services..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Company'}
      </button>
    </form>
  )
}
