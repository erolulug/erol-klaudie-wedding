# 💍 Erol & Klaudie – Wedding Invitation

An interactive, story-style digital wedding invitation. Guests tap or swipe through scenes like Instagram Stories.

**Live site:** https://erolulug.github.io/erol-klaudie-wedding/

**Saturday, 14 August 2027 · Hotel Vitality, Vendryně, Czechia**

## ✨ Features

- **Story navigation**: tap the sides or swipe to move between scenes
- **Three languages**: Czech (default), Turkish and English, with a switcher in the top-left corner; the guest's choice is remembered
- **Countdown** to the wedding day
- **Save the Date**: add to Google Calendar, Outlook, or download an `.ics` file
- **Venue map**: opens the venue in Google Maps
- **Photo gallery** of our story
- **RSVP** via an embedded Google Form
- **Background music** with a mute button
- **Mobile-first** design

## 📱 Scenes

1. **Envelope**: tap to open the invitation
2. **Invitation**: our message, bilingual greeting and countdown
3. **Date & Venue**: date, map link, save-the-date buttons, timeline and contacts
4. **Dress Code & Theme**: wedding colours and attire
5. **Scripture**: Matthew 19:6
6. **Gallery**: our photos
7. **RSVP**: Google Form

## 🚀 Run locally

Requires Node.js 22+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Changes reload automatically.

## 📝 Editing content

| What | Where |
|---|---|
| All text in Czech, Turkish and English | `lib/i18n.tsx` |
| Venue map link, schedule, contact numbers, calendar times | `components/wedding/scenes/Scene3DateTheme.tsx` |
| Gallery photos | `components/wedding/scenes/Scene10Extras.tsx` + `public/images/` |
| Background photos | `Scene1Envelope.tsx`, `Scene8Scripture.tsx` |
| RSVP form link | `components/wedding/scenes/Scene11RSVP.tsx` |
| Countdown date | `components/wedding/scenes/Scene2Blessing.tsx` |
| Share preview (WhatsApp, social media) | `app/layout.tsx` |
| Music | `public/audio/wedding-music.mp3` |
| Colours and fonts | `app/globals.css` |

When changing text, update it in all three languages in `lib/i18n.tsx`.

**Photos:** use `.jpg` (browsers can't show iPhone `.heic` files) and keep them around 2000px wide so the site loads quickly. Images in `public/` must be referenced through `withBasePath('/images/...')` so they work on GitHub Pages.

## 📦 Deployment

Every push to `main` builds the site and publishes it to GitHub Pages automatically (`.github/workflows/deploy.yml`). It takes about 2 minutes.

The site is served from the `/erol-klaudie-wedding/` subfolder. If the repository is renamed, update `basePath` in `next.config.ts` to match.

To test the production build locally:

```bash
pnpm build   # outputs static files to out/
```

## 🛠️ Tech stack

Next.js 15 (static export) · React 19 · Tailwind CSS v4 · Framer Motion · use-sound · Lucide icons · React Swipeable
