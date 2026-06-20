# ReviewWala

Collect Google reviews via WhatsApp. Show them on a free website widget. Built for Indian small businesses.

## How it works

1. **Share link** — Customer taps WhatsApp link after service
2. **Rate & review** — 30s, no login, no OTP, no app download
3. **Widget auto-updates** — 1-line embed on any website

## Plans

| Plan | Price | Key features |
|------|-------|-------------|
| Free | ₹0 | 15 reviews, basic widget, watermark, email support |
| Pro | ₹199/mo | Unlimited reviews, no watermark, CSV export, priority support, custom colors |

## Stack

- **Frontend** — Next.js (App Router), TypeScript, Tailwind CSS
- **Backend** — Next.js API routes
- **Database** — Supabase (PostgreSQL)
- **Widget** — Vanilla JS, 1-line embed, no framework dependency

## Getting started

```
npm run dev
```

Open http://localhost:3000

## Widget embed

```html
<script src="https://your-domain.com/widget.js" data-business="your-slug"></script>
```

## Deploy

Push to GitHub → connect to Vercel. Set Supabase env vars in Vercel dashboard.
