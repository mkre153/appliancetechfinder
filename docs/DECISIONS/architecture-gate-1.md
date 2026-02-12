# ADR: Architecture Gate 1 — Appliance Tech Finder

**Status:** Accepted
**Date:** 2026-02-11
**Decision Maker:** Mike Kwak

## Context

Appliance Tech Finder (ATF) is a directory site for appliance repair companies across the United States. The architecture must be simple, SEO-friendly, and scalable to thousands of cities without generating excessive pages or thin content.

## Decision: Guide-First Architecture

ATF uses a **guide-first** architecture where every page is a directory listing page (state or city level). There are **no individual repair company detail pages**. All repair company information is displayed inline on the city page where they are located.

### Routes (Locked)

| Route | Purpose |
|---|---|
| `/` | Homepage with hero, state grid, marketing sections |
| `/appliance-repair/` | All-states directory listing |
| `/appliance-repair/[state]/` | State page with city grid and inline listings |
| `/appliance-repair/[state]/[city]/` | City page with inline repair company cards |

### Why No Individual Company Pages

1. **Thin content risk:** Individual company pages would have minimal unique content (name, address, phone) and risk Google thin-content penalties.
2. **Crawl budget:** Fewer pages means Google crawls the pages that matter.
3. **Maintenance:** No need to manage thousands of individual slugs, redirects, or canonical URLs.
4. **User intent:** Users searching for "appliance repair in [city]" want to compare options, not land on a single company page.

### Entity Model

- **Table:** `repair_companies` in shared Supabase instance
- **Display:** Inline cards on city pages showing name, address, phone, rating, services
- **No individual URLs:** Companies are referenced by ID only for internal purposes

### Static Routes

Additional static pages (`/about/`, `/contact/`, `/privacy/`, `/terms/`, `/blog/`) exist outside the directory structure.

## Consequences

- All SEO value concentrates on state and city pages (higher authority per page)
- City pages become the canonical landing page for "[city] appliance repair" queries
- Adding a company detail page later would require a new ADR and route addition
- Cross-links to Scratch & Dent Finder operate at the state and city level
