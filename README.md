<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6C63FF,100:3B82F6&height=200&section=header&text=TitanChart&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=Professional%20Android%20Build%20Pipeline&descAlignY=58&descSize=18" width="100%"/>

<br/>

[![Build Status](https://github.com/AKIB473/titanchart/actions/workflows/build.yml/badge.svg)](https://github.com/AKIB473/titanchart/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/AKIB473/titanchart?color=6C63FF&label=Latest%20Release)](https://github.com/AKIB473/titanchart/releases)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%207.0%2B-green.svg)](https://developer.android.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-6.x-119EFF.svg)](https://capacitorjs.com)
[![Node](https://img.shields.io/badge/Node.js-20.x-339933.svg)](https://nodejs.org)
[![Java](https://img.shields.io/badge/Java-17-ED8B00.svg)](https://adoptium.net)

<br/>

**A production-grade Android CI/CD pipeline built with Capacitor.**  
Push your web app and get a signed APK + AAB in minutes — no Android Studio required.

<br/>

[📥 Download APK](https://github.com/AKIB473/titanchart/releases/latest) · [📖 Setup Guide](#-quick-setup) · [🐛 Report Bug](https://github.com/AKIB473/titanchart/issues/new?template=bug_report.md) · [💡 Request Feature](https://github.com/AKIB473/titanchart/issues/new?template=feature_request.md)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [⚡ Quick Setup](#-quick-setup)
- [🔐 Secrets Configuration](#-secrets-configuration)
- [🚀 Usage](#-usage)
- [🏷️ Versioning & Releases](#️-versioning--releases)
- [📣 Telegram Notifications](#-telegram-notifications)
- [🔧 Customization](#-customization)
- [🚨 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

<table>
<tr>
<td>

### 🤖 Build
- ✅ **Signed APK** — install directly on any Android device
- ✅ **Signed AAB** — ready to upload to Google Play Store
- ✅ **Debug APK** — for testing (optional)
- ✅ **Auto versioning** — from git tags or `package.json`
- ✅ **Version code** — auto-increments with each commit

</td>
<td>

### ⚡ Performance
- ✅ **Gradle caching** — ~50% faster repeat builds
- ✅ **npm caching** — skips re-downloading packages
- ✅ **Parallel jobs** — lint runs alongside build setup
- ✅ **Artifact retention** — 30 days for releases, 7 for debug
- ✅ **Build logs** — automatically saved on failure

</td>
</tr>
<tr>
<td>

### 🔐 Security
- ✅ **No plaintext secrets** — keystore stored as base64 secret
- ✅ **Keystore verification** — build fails if keystore is invalid
- ✅ **Env-based signing** — passwords never written to disk
- ✅ **ProGuard** — code minification + obfuscation in release
- ✅ **Resource shrinking** — smaller APK size

</td>
<td>

### 🎯 Developer Experience
- ✅ **Manual trigger** — build any time from GitHub UI
- ✅ **Build type selector** — release / debug / both
- ✅ **Version override** — bump version without code changes
- ✅ **Telegram notifications** — instant build status alerts
- ✅ **GitHub Release** — auto-created on version tags

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    🚀 TitanChart Pipeline                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  git push / git tag / manual trigger                              │
│         │                                                         │
│         ▼                                                         │
│  ╔════════════════════╗                                           │
│  ║  Job 1: Lint+Test  ║  ESLint · Jest · Coverage Report         │
│  ╚════════════════════╝                                           │
│         │                                                         │
│         ▼                                                         │
│  ╔════════════════════════════════════════════╗                   │
│  ║          Job 2: Android Build              ║                   │
│  ║                                            ║                   │
│  ║  npm ci → npm run build                    ║                   │
│  ║       ↓                                    ║                   │
│  ║  cap sync android                          ║                   │
│  ║       ↓                                    ║                   │
│  ║  Inject permissions + version              ║                   │
│  ║       ↓                                    ║                   │
│  ║  Decode keystore (base64 secret)           ║                   │
│  ║       ↓                                    ║                   │
│  ║  ./gradlew assembleRelease bundleRelease   ║                   │
│  ║       ↓                                    ║                   │
│  ║  TitanChart-v1.0.0-20260415.apk  ✅        ║                   │
│  ║  TitanChart-v1.0.0-20260415.aab  ✅        ║                   │
│  ╚════════════════════════════════════════════╝                   │
│         │                                                         │
│   ┌─────┴─────┐                                                   │
│   ▼           ▼                                                   │
│  ╔══════════╗ ╔══════════════════╗                                │
│  ║ Job 3:   ║ ║ Job 4: Notify   ║                                │
│  ║ Release  ║ ║                  ║                                │
│  ║ (on tag) ║ ║ Telegram · Email ║                                │
│  ╚══════════╝ ╚══════════════════╝                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Setup

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20.x | [nodejs.org](https://nodejs.org) |
| Git | Any | [git-scm.com](https://git-scm.com) |
| Java (local dev only) | 17 | [adoptium.net](https://adoptium.net) |

> **Note:** You do NOT need Android Studio or local Gradle. Everything runs in GitHub Actions.

---

### Step 1 — Clone or Fork

```bash
# Clone this template
git clone https://github.com/AKIB473/titanchart.git my-app
cd my-app

# Install dependencies
npm install
```

---

### Step 2 — Configure Your App

Edit `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.yourapp',   // ← Change this
  appName: 'Your App Name',            // ← Change this
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

Edit `package.json` version:

```json
{
  "name": "your-app",
  "version": "1.0.0",
  "scripts": {
    "build": "your-build-command",
    "lint": "eslint src/",
    "test": "jest"
  }
}
```

---

### Step 3 — Generate Signing Keystore

> ⚠️ **Do this once. Back up the `.jks` file securely. You need it forever.**

```bash
keytool -genkey -v \
  -keystore my-release-key.jks \
  -alias my-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Answer the prompts:
```
Enter keystore password:  [choose a strong password]
Re-enter new password:    [same password]
What is your first and last name? [Your Name]
What is the name of your city?    [City]
What is the two-letter country code? [US]
Is this correct? yes
```

---

### Step 4 — Convert Keystore to Base64

**macOS / Linux:**
```bash
base64 -i my-release-key.jks | tr -d '\n' > keystore_base64.txt
cat keystore_base64.txt  # Copy this entire output
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("my-release-key.jks")) | Out-File -NoNewLine keystore_base64.txt
```

---

### Step 5 — Add GitHub Secrets

Go to: **Your Repo → Settings → Secrets and variables → Actions**

Click **"New repository secret"** and add each one:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `KEYSTORE_BASE64` | Content of `keystore_base64.txt` | Your keystore encoded as base64 |
| `SIGNING_STORE_PASSWORD` | Your keystore password | The password you set in Step 3 |
| `SIGNING_KEY_ALIAS` | `my-key` | The alias you set in Step 3 |
| `SIGNING_KEY_PASSWORD` | Your key password | Usually same as store password |
| `TELEGRAM_BOT_TOKEN` | `1234567890:ABC...` | *(Optional)* For build notifications |
| `TELEGRAM_CHAT_ID` | `-100123456789` | *(Optional)* Your chat/channel ID |

<details>
<summary>📸 Screenshot — Where to find secrets settings</summary>

```
GitHub Repo
└── Settings
    └── Secrets and variables
        └── Actions
            └── Repository secrets
                ├── KEYSTORE_BASE64       ← Paste base64 here
                ├── SIGNING_STORE_PASSWORD
                ├── SIGNING_KEY_ALIAS
                └── SIGNING_KEY_PASSWORD
```

</details>

---

### Step 6 — Push and Build! 🎉

```bash
git add .
git commit -m "feat: initial setup"
git push origin main
```

Go to the **Actions** tab — your build is running! ✅

---

## 🚀 Usage

### Automatic Builds

| Event | What happens |
|-------|-------------|
| Push to `main` | Full build — lint + release APK + AAB |
| Push to `develop` | Full build — lint + release APK + AAB |
| Pull Request to `main` | Lint + tests only (no signing) |
| Push tag `v1.0.0` | Full build + creates GitHub Release |

### Manual Build (Workflow Dispatch)

1. Go to **Actions** → **🚀 TitanChart — Build & Release**
2. Click **"Run workflow"**
3. Fill in the options:

| Option | Description | Default |
|--------|-------------|---------|
| Build type | `release` / `debug` / `both` | `release` |
| Version override | e.g. `2.1.0` | Auto-detect |
| Notify | Send Telegram message | `true` |

### Download Build Artifacts

After a successful build:
1. Go to **Actions** → click your build run
2. Scroll down to **Artifacts**
3. Download:
   - `TitanChart-APK-vX.X.X` — signed APK
   - `TitanChart-AAB-vX.X.X` — Play Store bundle
   - `test-coverage` — test report

---

## 🏷️ Versioning & Releases

### Auto Version Detection

The pipeline detects your version in this priority order:

```
1. Manual override input (if using Workflow Dispatch)
2. Git tag (e.g. v1.2.3 → version "1.2.3")
3. package.json "version" field
4. Fallback → "1.0.0"
```

### Version Code

The `versionCode` (required by Android/Play Store) is automatically set to the **total number of git commits**. This means it always increases with each push — no manual management needed.

### Creating a Release

```bash
# 1. Update version in package.json
npm version 1.2.0

# 2. Commit the version bump
git add package.json
git commit -m "chore: bump version to 1.2.0"

# 3. Tag it — this triggers a GitHub Release
git tag v1.2.0
git push origin main --tags
```

The pipeline will automatically:
- Build signed APK + AAB
- Generate a changelog from your commit messages
- Create a GitHub Release with both files attached
- Tag it as a pre-release if version contains `-beta` or `-alpha`

---

## 📣 Telegram Notifications

Get instant build alerts in your Telegram:

### Setup

1. Message `@BotFather` → `/newbot` → follow prompts → copy your **token**
2. Add the bot to your Telegram group or channel
3. Get your chat ID — send a message to your group, then visit:
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
   ```
   Look for `"chat":{"id": -100XXXXXXXXX}` — that's your chat ID

4. Add to GitHub Secrets:
   - `TELEGRAM_BOT_TOKEN` = `1234567890:ABCdef...`
   - `TELEGRAM_CHAT_ID` = `-100123456789`

### Example notification

```
✅ TitanChart — Build Successful
📦 Version: v1.2.0
🌿 Branch: main
👤 Triggered by: AKIB473
🔗 View Build → https://github.com/...
```

---

## 🔧 Customization

### Add Android Permissions

In `build.yml`, find the **"Configure AndroidManifest.xml"** step and add:

```yaml
inject_perm "android.permission.CAMERA"
inject_perm "android.permission.RECORD_AUDIO"
inject_perm "android.permission.READ_EXTERNAL_STORAGE"
inject_perm "android.permission.WRITE_EXTERNAL_STORAGE"
inject_perm "android.permission.ACCESS_FINE_LOCATION"
```

### Change Minimum Android Version

```yaml
env:
  ANDROID_MIN_SDK: "24"    # Android 7.0 (change to 21 for Android 5.0)
  ANDROID_COMPILE_SDK: "34"
  ANDROID_TARGET_SDK: "34"
```

### Change Node / Java Version

```yaml
env:
  NODE_VERSION: "20"    # or "18", "22"
  JAVA_VERSION: "17"    # or "11", "21"
```

### Disable ProGuard (for debugging)

In `build.yml`, find the signing config injection and change:
```groovy
minifyEnabled false
shrinkResources false
```

### Add Environment Variables to Build

```yaml
- name: 🏗️ Build web app
  run: npm run build
  env:
    VITE_API_URL: ${{ secrets.API_URL }}
    VITE_APP_ENV: production
```

---

## 🚨 Troubleshooting

<details>
<summary>❌ BackendUnavailable: Cannot import 'setuptools.backends.legacy'</summary>

In `pyproject.toml`, change:
```toml
# ❌ Wrong
build-backend = "setuptools.backends.legacy:build"

# ✅ Correct
build-backend = "setuptools.build_meta"
```
</details>

<details>
<summary>❌ Keystore verification failed</summary>

1. Re-generate the base64: `base64 -i your.jks | tr -d '\n'`
2. Make sure there are NO newlines in the base64 secret
3. Verify the password matches exactly
4. Try on local machine: `keytool -list -keystore your.jks`
</details>

<details>
<summary>❌ Could not find method signingConfigs</summary>

Your `android/app/build.gradle` may already have an `android {}` block.  
Open it and manually add the `signingConfigs` inside the existing `android {}` block rather than appending a new one.
</details>

<details>
<summary>❌ No module named 'capacitor' / cap: command not found</summary>

```bash
npm install
npx cap add android    # or: npx cap sync
```
Make sure `@capacitor/cli` is in your `devDependencies`.
</details>

<details>
<summary>❌ Build takes 10+ minutes</summary>

First build is always slow (downloads Gradle, Android SDK). After that:
- Gradle cache kicks in → ~3-4 minutes
- npm cache kicks in → ~1 minute saved
- Total typical repeat build: **4-6 minutes**
</details>

<details>
<summary>❌ APK installs but app is blank/white screen</summary>

- Check `capacitor.config.ts` → `webDir` points to your actual build output
- Make sure `npm run build` actually creates files in that directory
- Check browser console via `adb logcat` or Chrome `chrome://inspect`
</details>

---

## 📁 Project Structure

```
titanchart/
├── .github/
│   ├── workflows/
│   │   └── build.yml              ← CI/CD pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── src/                           ← Your web app source code
│   ├── index.html
│   ├── main.js
│   └── styles.css
│
├── dist/                          ← Built web output (gitignored)
│
├── android/                       ← Capacitor Android project (gitignored)
│
├── capacitor.config.ts            ← Capacitor configuration
├── package.json                   ← Dependencies + scripts
├── .gitignore
├── LICENSE
├── CONTRIBUTING.md
└── README.md                      ← This file
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feat/amazing-feature

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push to the branch
git push origin feat/amazing-feature

# 5. Open a Pull Request
```

### Commit Message Format

```
type: short description

Types: feat | fix | docs | style | refactor | test | chore
```

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## 👨‍💻 Author

**AKIBUZZAMAN AKIB**

[![GitHub](https://img.shields.io/badge/GitHub-AKIB473-181717?logo=github)](https://github.com/AKIB473)

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6C63FF,100:3B82F6&height=100&section=footer" width="100%"/>

⭐ **Star this repo if it helped you!** ⭐

</div>
