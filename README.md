# SnapBooth

Turn moments into memories.

SnapBooth is a client-side online photobooth. Open it on your phone or computer, pick a frame, take a countdown photo session, and download a composed photobooth strip — all in the browser.

## Features

- Mobile-first photobooth flow
- Configurable PNG frame overlays (`public/layouts/`)
- Front/back camera switching
- Countdown capture session
- Canvas composition (photos under frame)
- Download + Web Share (when available)
- Photos stay on device — nothing is uploaded

## Quick start

```bash
npm install
npm run dev
```

Camera access requires **localhost** or **HTTPS**.

## Add a new frame later

1. Export a transparent PNG from Canva (photo holes = transparent).
2. Save it to `public/layouts/your-frame.png`.
3. Add a layout entry in `src/data/layouts.ts` with canvas size and slot rectangles.

No camera or composition code changes required.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run preview` — preview the production build

## Stack

React · TypeScript · Vite · Tailwind CSS · Framer Motion · MediaDevices · Canvas
