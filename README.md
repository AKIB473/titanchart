<div align="center">

# WebToAPK

**Turn any web app into an Android app — in 3 minutes.**

[![Build](https://github.com/AKIB473/web-to-apk/actions/workflows/build.yml/badge.svg)](https://github.com/AKIB473/web-to-apk/actions/workflows/build.yml)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Android](https://img.shields.io/badge/Android-7.0%2B-green)](https://developer.android.com)

</div>

---

## How to use

### Step 1 — Fork this repo

Click **Fork** (top right of this page) → name it anything you want.

### Step 2 — Put your files in `www/`

Edit or replace the files in the `www/` folder:

```
www/
  index.html   ← your main page (required)
  style.css    ← your styles (optional)
  app.js       ← your JavaScript (optional)
  images/      ← your images (optional)
```

**That's it.** HTML, CSS, JavaScript, images — everything goes in `www/`.

### Step 3 — Push to main

```bash
git add .
git commit -m "my app"
git push
```

Or edit directly on GitHub (click any file → pencil icon → commit changes).

### Step 4 — Download your APK

1. Click **Actions** tab
2. Click the latest build
3. Scroll down to **Artifacts**
4. Download **APK-v1.0.0**
5. Transfer to your Android phone and install!

---

## Install the APK on Android

1. Send the APK to your phone (WhatsApp, Telegram, email, USB cable — anything)
2. Open it on your phone
3. If asked, allow **"Install from unknown sources"**
4. Tap **Install**

That's it — your web app is now an Android app!

---

## Build time

| Step | Time |
|------|------|
| First build (downloads Android tools) | ~8-10 min |
| Repeat builds (cached) | ~4-5 min |

---

## Want to publish on Google Play Store?

Run the **Setup Keystore** workflow once:

1. Go to **Actions** tab
2. Click **Setup Keystore (Run Once for Play Store)**
3. Click **Run workflow**
4. Fill in your app name, key alias, and a password
5. Done — your next builds will be Play Store ready

---

## Project structure

```
web-to-apk/
├── www/                  ← PUT YOUR FILES HERE
│   ├── index.html        ← your app's main page
│   └── ...
├── ci/
│   ├── setup_keystore.py ← handles signing automatically
│   └── save_secrets.py   ← saves Play Store key to GitHub
├── .github/
│   └── workflows/
│       ├── build.yml           ← main build pipeline
│       └── setup-keystore.yml  ← one-time Play Store setup
├── capacitor.config.json ← Capacitor config
└── package.json
```

---

## Troubleshooting

**"www/index.html not found"**
→ Make sure your main HTML file is named `index.html` and is inside the `www/` folder.

**"Install blocked"**
→ On your Android phone: Settings → Security → Enable "Unknown sources" or "Install unknown apps".

**Build taking too long**
→ First build downloads Android build tools (~500 MB). Repeat builds are much faster thanks to caching.

**App crashes on open**
→ Check your HTML/JS for errors. Open Chrome DevTools (`chrome://inspect`) while connected via USB to see console errors.

---

## Built with

- [Capacitor](https://capacitorjs.com) — wraps web apps as native Android
- [GitHub Actions](https://github.com/features/actions) — free CI/CD

---

MIT License · Built by [AKIBUZZAMAN AKIB](https://github.com/AKIB473)
