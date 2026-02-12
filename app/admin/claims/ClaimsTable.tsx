'use client'

/**
 * Claims Table
 *
 * Client component for displaying claims with approve/reject actions.
 * Phase 12: Marketing — Claim System
 */

import { useState } from 'react'

interface Claim {
  id: string
  company_id: number
  claimer_name: string
  claimer_email: string
  claimer_phone: string
  claimer_role: string
  message: string
  status: string
  created_at: string
  repair_companies?: {
    id: number
    name: string
  }
}

interface ClaimsTableProps {
  claims: Claim[]
  showActions: boolean
}

export function ClaimsTable({ claims, showActions }: ClaimsTableProps) {
  const [processing, setProcessing] = useState<string | null>(null)
  const [localClaims, setLocalClaims] = useState(claims)

  const handleAction = async (claimId: string, action: 'approved' | 'rejected') => {
    setProcessing(claimId)
    try {
      const res = await fetch('/api/admin/claims', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId, status: action }),
      })

      if (res.ok) {
        setLocalClaims((prev) =>
          prev.map((c) => (c.id === claimId ? { ...c, status: action } : c))
        )
      }
    } catch (err) {
      console.error('Failed to update claim:', err)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg bg-white shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Company
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Claimer
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Message
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Date
            </th>
            {showActions && (
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {localClaims.map((claim) => (
            <tr key={claim.id}>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                {claim.repair_companies?.name || `Company #${claim.company_id}`}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                <div>{claim.claimer_name}</div>
                <div className="text-xs text-gray-400">{claim.claimer_email}</div>
                <div className="text-xs text-gray-400">{claim.claimer_phone}</div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-gray-600">
                {claim.claimer_role}
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-600">
                {claim.message}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    claim.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : claim.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {claim.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {new Date(claim.created_at).toLocaleDateString()}
              </td>
              {showActions && claim.status === 'pending' && (
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(claim.id, 'approved')}
                      disabled={processing === claim.id}
                      className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(claim.id, 'rejected')}
                      disabled={processing === claim.id}
                      className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              )}
              {showActions && claim.status !== 'pending' && (
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-400">
                  --
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
