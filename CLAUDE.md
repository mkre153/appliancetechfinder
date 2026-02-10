# Project Context: Appliance Tech Finder

## What This Project Is
- **Site:** appliancetechfinder.com — an appliance repair company directory covering 50 US states
- **Owner:** MK153 Inc.
- **Tech Stack:** Next.js 14 + Tailwind CSS, hosted on Vercel, data in Supabase (exanqdkidybtrppmngmy)
- **Business Model:** AdSense monetization

## Database
- Shared Supabase instance with scratchanddentfinder.com
- Tables: `states`, `cities` (shared), `repair_companies` (ATF-specific)
- No data in repair_companies yet — needs Prospector scrape

## Sister Site
- **scratchanddentfinder.com** — scratch-and-dent appliance store directory
- Cross-links between ATF and SDF for mutual SEO benefit

## Routes
- `/` — Homepage with state grid
- `/appliance-repair/` — All states directory
- `/appliance-repair/[state]/` — State page with cities
- `/appliance-repair/[state]/[city]/` — City page with repair companies
