"""
Setup keystore for Android signing.

- If KEYSTORE_BASE64 + signing secrets are set: uses the real keystore.
- If secrets are missing: auto-generates a demo keystore.
  The demo APK works on any Android device but is NOT suitable for Play Store.

Usage: python3 setup_keystore.py android/app/build.gradle
"""

import sys
import os
import base64
import subprocess
import pathlib

GRADLE_PATH  = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "android/app/build.gradle")
KEYSTORE_OUT = pathlib.Path("android/app/release.keystore")

keystore_b64 = os.environ.get("KEYSTORE_BASE64", "").strip()
store_pass   = os.environ.get("SIGNING_STORE_PASSWORD", "").strip()
key_alias    = os.environ.get("SIGNING_KEY_ALIAS", "").strip()
key_pass     = os.environ.get("SIGNING_KEY_PASSWORD", "").strip()

has_real = bool(keystore_b64 and store_pass and key_alias and key_pass)

if has_real:
    # ── Real keystore from GitHub Secret ──────────────────────────────────────
    print("Using real keystore from KEYSTORE_BASE64 secret...")
    try:
        raw = base64.b64decode(keystore_b64)
        KEYSTORE_OUT.write_bytes(raw)
        print(f"  Keystore written: {KEYSTORE_OUT} ({len(raw)} bytes)")
        if len(raw) < 100:
            print("  ERROR: Keystore too small — KEYSTORE_BASE64 may be invalid.")
            sys.exit(1)
    except Exception as e:
        print(f"  ERROR decoding keystore: {e}")
        sys.exit(1)
    print("  This is a REAL signed build.")

else:
    # ── Auto-generate demo keystore ───────────────────────────────────────────
    print("No signing secrets found — generating demo keystore...")
    print("  NOTE: Add KEYSTORE_BASE64 + signing secrets for a Play Store release.")
    store_pass = "android"
    key_alias  = "androiddebugkey"
    key_pass   = "android"

    result = subprocess.run([
        "keytool", "-genkeypair",
        "-keystore", str(KEYSTORE_OUT),
        "-alias",    key_alias,
        "-keyalg",   "RSA",
        "-keysize",  "2048",
        "-validity", "365",
        "-storepass", store_pass,
        "-keypass",   key_pass,
        "-dname",     "CN=Demo Build, OU=Dev, O=Demo, L=City, ST=State, C=US",
        "-storetype", "JKS",
        "-noprompt",
    ], capture_output=True, text=True)

    if result.returncode != 0:
        print("keytool stdout:", result.stdout[-500:])
        print("keytool stderr:", result.stderr[-500:])
        sys.exit(1)

    print(f"  Demo keystore: {KEYSTORE_OUT} ({KEYSTORE_OUT.stat().st_size} bytes)")

    # Write env file so gradle picks up the passwords
    env_path = pathlib.Path("android/signing.env")
    env_path.write_text(
        f"SIGNING_STORE_PASSWORD={store_pass}\n"
        f"SIGNING_KEY_ALIAS={key_alias}\n"
        f"SIGNING_KEY_PASSWORD={key_pass}\n"
    )
    # Also export for current process (so subsequent steps can use them)
    os.environ["SIGNING_STORE_PASSWORD"] = store_pass
    os.environ["SIGNING_KEY_ALIAS"]      = key_alias
    os.environ["SIGNING_KEY_PASSWORD"]   = key_pass

    # Write to GITHUB_ENV so the gradle build steps pick them up
    github_env = os.environ.get("GITHUB_ENV", "")
    if github_env:
        with open(github_env, "a") as genv:
            genv.write(f"SIGNING_STORE_PASSWORD={store_pass}\n")
            genv.write(f"SIGNING_KEY_ALIAS={key_alias}\n")
            genv.write(f"SIGNING_KEY_PASSWORD={key_pass}\n")
        print("  Passwords exported to GITHUB_ENV for Gradle steps.")

# ── Write signing config to build.gradle ──────────────────────────────────────
gradle_content = GRADLE_PATH.read_text()

if "signingConfigs" in gradle_content:
    print(f"signingConfigs already in {GRADLE_PATH} — skipping")
    sys.exit(0)

block = f"""
android {{
    signingConfigs {{
        release {{
            storeFile file("release.keystore")
            storePassword System.getenv("SIGNING_STORE_PASSWORD") ?: "{store_pass}"
            keyAlias      System.getenv("SIGNING_KEY_ALIAS")      ?: "{key_alias}"
            keyPassword   System.getenv("SIGNING_KEY_PASSWORD")   ?: "{key_pass}"
        }}
    }}
    buildTypes {{
        release {{
            minifyEnabled   true
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
            signingConfig signingConfigs.release
        }}
        debug {{
            applicationIdSuffix ".debug"
            versionNameSuffix   "-debug"
            debuggable true
        }}
    }}
}}
"""

GRADLE_PATH.write_text(gradle_content + block)
print(f"Signing config written to {GRADLE_PATH}")
print("Setup complete.")
