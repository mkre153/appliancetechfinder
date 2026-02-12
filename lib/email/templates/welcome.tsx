/**
 * Welcome Email Template
 *
 * Sent to new users after signup.
 * Uses React for email templating (Resend supports this natively).
 *
 * Phase 12: Marketing — Email System
 */

import * as React from 'react'
import { SITE_URL } from '@/lib/config'
import { getAllStatesUrl } from '@/lib/urls'

interface WelcomeEmailProps {
  userEmail: string
}

export function WelcomeEmail({ userEmail }: WelcomeEmailProps) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>Appliance Tech Finder</h1>
      </div>

      <div style={styles.content}>
        <h2 style={styles.heading}>Welcome aboard!</h2>

        <p style={styles.text}>
          Thanks for signing up. You now have access to:
        </p>

        <ul style={styles.list}>
          <li style={styles.listItem}>
            <strong>Claim your business</strong> - Get your repair company listed and verified
          </li>
          <li style={styles.listItem}>
            <strong>Featured listings</strong> - Boost your visibility with premium placement
          </li>
          <li style={styles.listItem}>
            <strong>Customer reach</strong> - Connect with homeowners searching for appliance repair
          </li>
        </ul>

        <a href={`${SITE_URL}${getAllStatesUrl()}`} style={styles.button}>
          Browse the Directory
        </a>

        <p style={styles.textSmall}>
          Questions? Just reply to this email - we are here to help.
        </p>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Appliance Tech Finder - Find trusted appliance repair services near you
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#1d4ed8',
    padding: '24px',
    textAlign: 'center' as const,
  },
  logo: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold' as const,
    margin: 0,
  },
  content: {
    padding: '32px 24px',
  },
  heading: {
    color: '#111827',
    fontSize: '24px',
    fontWeight: 'bold' as const,
    marginBottom: '16px',
  },
  text: {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '24px',
  },
  textSmall: {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    marginTop: '24px',
  },
  list: {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '28px',
    paddingLeft: '20px',
    marginBottom: '24px',
  },
  listItem: {
    marginBottom: '8px',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#1d4ed8',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold' as const,
    fontSize: '16px',
  },
  footer: {
    backgroundColor: '#f3f4f6',
    padding: '24px',
    textAlign: 'center' as const,
  },
  footerText: {
    color: '#6b7280',
    fontSize: '12px',
    margin: 0,
  },
} as const
