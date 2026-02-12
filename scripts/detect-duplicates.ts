#!/usr/bin/env npx tsx
/**
 * Detect Duplicate Repair Companies
 *
 * Finds duplicate repair_companies by:
 * 1. Normalized name + city_id key (strong match)
 * 2. Phone number (strong match)
 * 3. Address similarity (soft match - manual review)
 *
 * Usage:
 *   npx tsx scripts/detect-duplicates.ts [--export]
 *
 * Options:
 *   --export    Export results to CSV files in /tmp/atf-dedup/
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { normalizeBusinessName, normalizePhone } from '../lib/utils/address-normalizer'

// =============================================================================
// Supabase client (self-contained, no Next.js imports)
// =============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// =============================================================================
// Types
// =============================================================================

interface CompanyInfo {
  id: number
  name: string
  address: string | null
  phone: string | null
  city_id: number | null
  city_name: string
  state_name: string
  google_place_id: string | null
  is_approved: boolean
  created_at: string
}

interface DuplicateGroup {
  key: string
  companyIds: number[]
  companies: CompanyInfo[]
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const shouldExport = process.argv.includes('--export')

  console.log('='.repeat(60))
  console.log('Duplicate Repair Company Detection')
  console.log('='.repeat(60))
  console.log('')

  // Fetch all repair companies with pagination
  console.log('Fetching repair companies...')
  const PAGE_SIZE = 1000
  const companies: any[] = []
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const { data, error: fetchError } = await supabase
      .from('repair_companies')
      .select(`
        id,
        name,
        address,
        phone,
        city_id,
        google_place_id,
        is_approved,
        created_at,
        city:cities(name),
        state:states(name)
      `)
      .order('id')
      .range(offset, offset + PAGE_SIZE - 1)

    if (fetchError) {
      console.error('Failed to fetch repair companies:', fetchError.message)
      process.exit(1)
    }

    if (data && data.length > 0) {
      companies.push(...data)
      console.log(`  Fetched ${companies.length} companies...`)
      offset += PAGE_SIZE
      hasMore = data.length === PAGE_SIZE
    } else {
      hasMore = false
    }
  }

  if (companies.length === 0) {
    console.log('No repair companies found.')
    return
  }

  console.log(`Found ${companies.length} repair companies\n`)

  // Transform data
  const companyData: CompanyInfo[] = companies.map((c: any) => ({
    id: c.id,
    name: c.name,
    address: c.address,
    phone: c.phone,
    city_id: c.city_id,
    city_name: (c.city as any)?.name || '',
    state_name: (c.state as any)?.name || '',
    google_place_id: c.google_place_id,
    is_approved: c.is_approved,
    created_at: c.created_at,
  }))

  // =========================================================================
  // 1. Normalized Name + City ID Duplicates (Strong Match)
  // =========================================================================
  console.log('-'.repeat(60))
  console.log('1. NAME + CITY DUPLICATES (Strong Match)')
  console.log('-'.repeat(60))

  const byNameCity = new Map<string, CompanyInfo[]>()
  for (const company of companyData) {
    if (!company.city_id) continue
    const normalizedName = normalizeBusinessName(company.name)
    const key = `${normalizedName}|${company.city_id}`
    const existing = byNameCity.get(key) || []
    existing.push(company)
    byNameCity.set(key, existing)
  }

  const nameCityDupes: DuplicateGroup[] = []
  for (const [key, group] of byNameCity) {
    if (group.length > 1) {
      nameCityDupes.push({
        key,
        companyIds: group.map((c) => c.id),
        companies: group.sort((a, b) => {
          // Prefer: approved first, then has google_place_id, then oldest
          if (a.is_approved && !b.is_approved) return -1
          if (!a.is_approved && b.is_approved) return 1
          if (a.google_place_id && !b.google_place_id) return -1
          if (!a.google_place_id && b.google_place_id) return 1
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        }),
      })
    }
  }

  console.log(`Found ${nameCityDupes.length} duplicate groups by normalized name+city\n`)
  for (const group of nameCityDupes.slice(0, 5)) {
    const [name, cityId] = group.key.split('|')
    console.log(`  Key: "${name}" (city_id=${cityId})`)
    for (const company of group.companies) {
      const marker = company === group.companies[0] ? 'KEEP' : '    '
      console.log(`  ${marker} [${company.id}] ${company.name}`)
      console.log(`        ${company.address || 'no address'}, ${company.city_name}, ${company.state_name}`)
      console.log(`        Approved: ${company.is_approved ? 'Yes' : 'No'} | Google: ${company.google_place_id ? 'Yes' : 'No'}`)
    }
    console.log('')
  }
  if (nameCityDupes.length > 5) {
    console.log(`  ... and ${nameCityDupes.length - 5} more groups\n`)
  }

  // =========================================================================
  // 2. Phone Number Duplicates (Strong Match)
  // =========================================================================
  console.log('-'.repeat(60))
  console.log('2. PHONE NUMBER DUPLICATES (Strong Match)')
  console.log('-'.repeat(60))

  const byPhone = new Map<string, CompanyInfo[]>()
  for (const company of companyData) {
    const normalizedPhone = normalizePhone(company.phone)
    if (!normalizedPhone) continue
    const existing = byPhone.get(normalizedPhone) || []
    existing.push(company)
    byPhone.set(normalizedPhone, existing)
  }

  const phoneDupes: DuplicateGroup[] = []
  for (const [phone, group] of byPhone) {
    if (group.length > 1) {
      phoneDupes.push({
        key: phone,
        companyIds: group.map((c) => c.id),
        companies: group,
      })
    }
  }

  console.log(`Found ${phoneDupes.length} duplicate groups by phone\n`)
  for (const group of phoneDupes.slice(0, 5)) {
    console.log(`  Phone: ${group.key}`)
    for (const company of group.companies) {
      console.log(`    [${company.id}] ${company.name} - ${company.city_name}, ${company.state_name}`)
    }
    console.log('')
  }
  if (phoneDupes.length > 5) {
    console.log(`  ... and ${phoneDupes.length - 5} more groups\n`)
  }

  // =========================================================================
  // 3. Same Exact Name + City Name (Soft Match - catches cross-city-id dupes)
  // =========================================================================
  console.log('-'.repeat(60))
  console.log('3. SAME EXACT NAME + CITY NAME (Soft Match - Manual Review)')
  console.log('-'.repeat(60))

  const byExactNameCity = new Map<string, CompanyInfo[]>()
  for (const company of companyData) {
    const key = `${company.name.toLowerCase().trim()}|${company.city_name.toLowerCase().trim()}`
    const existing = byExactNameCity.get(key) || []
    existing.push(company)
    byExactNameCity.set(key, existing)
  }

  const exactNameCityDupes: DuplicateGroup[] = []
  for (const [key, group] of byExactNameCity) {
    if (group.length > 1) {
      exactNameCityDupes.push({
        key,
        companyIds: group.map((c) => c.id),
        companies: group,
      })
    }
  }

  console.log(`Found ${exactNameCityDupes.length} groups with same exact name+city\n`)
  for (const group of exactNameCityDupes.slice(0, 5)) {
    const [name, city] = group.key.split('|')
    console.log(`  "${name}" in ${city}:`)
    for (const company of group.companies) {
      console.log(`    [${company.id}] ${company.address || 'no address'}`)
    }
    console.log('')
  }
  if (exactNameCityDupes.length > 5) {
    console.log(`  ... and ${exactNameCityDupes.length - 5} more groups\n`)
  }

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('='.repeat(60))
  console.log('Summary')
  console.log('='.repeat(60))
  console.log(`Total repair companies:       ${companyData.length}`)
  console.log(`Name+city duplicates:         ${nameCityDupes.length} groups (${nameCityDupes.reduce((sum, g) => sum + g.companies.length, 0)} companies)`)
  console.log(`Phone duplicates:             ${phoneDupes.length} groups`)
  console.log(`Exact name+city duplicates:   ${exactNameCityDupes.length} groups`)

  // =========================================================================
  // Export to CSV
  // =========================================================================
  if (shouldExport) {
    const exportDir = '/tmp/atf-dedup'
    fs.mkdirSync(exportDir, { recursive: true })

    // Export name+city duplicates
    const nameCityCsv = [
      'group_id,normalized_key,company_id,name,address,city,state,approved,google_place_id,is_canonical',
      ...nameCityDupes.flatMap((group, groupIdx) =>
        group.companies.map((company, companyIdx) =>
          [
            groupIdx + 1,
            `"${group.key.replace(/"/g, '""')}"`,
            company.id,
            `"${company.name.replace(/"/g, '""')}"`,
            `"${(company.address || '').replace(/"/g, '""')}"`,
            company.city_name,
            company.state_name,
            company.is_approved ? 'Yes' : 'No',
            company.google_place_id || '',
            companyIdx === 0 ? 'Yes' : 'No',
          ].join(',')
        )
      ),
    ].join('\n')
    fs.writeFileSync(path.join(exportDir, 'name-city-duplicates.csv'), nameCityCsv)
    console.log(`\nExported: ${exportDir}/name-city-duplicates.csv`)

    // Export phone duplicates
    const phoneCsv = [
      'group_id,phone,company_id,name,address,city,state',
      ...phoneDupes.flatMap((group, groupIdx) =>
        group.companies.map((company) =>
          [
            groupIdx + 1,
            group.key,
            company.id,
            `"${company.name.replace(/"/g, '""')}"`,
            `"${(company.address || '').replace(/"/g, '""')}"`,
            company.city_name,
            company.state_name,
          ].join(',')
        )
      ),
    ].join('\n')
    fs.writeFileSync(path.join(exportDir, 'phone-duplicates.csv'), phoneCsv)
    console.log(`Exported: ${exportDir}/phone-duplicates.csv`)

    // Export exact name+city soft matches
    const exactCsv = [
      'group_id,name,city,company_id,address,approved',
      ...exactNameCityDupes.flatMap((group, groupIdx) =>
        group.companies.map((company) =>
          [
            groupIdx + 1,
            `"${company.name.replace(/"/g, '""')}"`,
            company.city_name,
            company.id,
            `"${(company.address || '').replace(/"/g, '""')}"`,
            company.is_approved ? 'Yes' : 'No',
          ].join(',')
        )
      ),
    ].join('\n')
    fs.writeFileSync(path.join(exportDir, 'exact-name-city-duplicates.csv'), exactCsv)
    console.log(`Exported: ${exportDir}/exact-name-city-duplicates.csv`)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
