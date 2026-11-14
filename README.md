# Abundant Home

Proof-of-concept site for Abundant Home ("Manifest at home"): free vision board and bedroom color content built from
Nancy Swanton's Guide to Living in Abundance, with email sign-ups as the success signal.

Stack: Next.js (App Router) on Vercel, Supabase for sign-ups, Vercel Web Analytics. Resend and Stripe come later.

## Pages

| Path | Target search | Notes |
| --- | --- | --- |
| `/vision-board-ideas` | vision board ideas (40,500/mo, 201,000 in Jan) | 40 ideas |
| `/how-to-make-a-vision-board` | how to make a vision board (8,100/mo) | HowTo + FAQ schema |
| `/vision-board-template` | vision board template, digital vision board | In-browser maker, PNG export |
| `/bedroom-colors` | bedroom colors, bedroom paint colors, feng shui bedroom colors | |
| `/declutter-challenge` | declutter challenge | Email sign-up for the January challenge |

The challenge start date lives in `lib/site.ts` (`challengeStart`).

## Environment variables

Set by the Vercel Supabase integration: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
Optional: `NEXT_PUBLIC_SITE_URL` (canonical URL, defaults to https://www.abundanthomedesign.com).

Without the Supabase variables the site still renders; the sign-up form returns "Sign-ups are not open yet."

## Database

`supabase/migrations/` holds the schema. The `subscribers` table has RLS on with no policies: only the server, using
the service role key, can read or write it. Read sign-ups in the Supabase dashboard (Table Editor, `subscribers`).

## Analytics

Turn on Web Analytics in the Vercel project (Analytics tab). Custom events: `signup` and `board_download`.

## Source material

`content/guide/` holds Nancy's paid workbooks and their extracted text. They are not served by the site. Keep them out
of `public/`, and keep this repository private.

## Develop

```bash
npm install
npm run dev
```
