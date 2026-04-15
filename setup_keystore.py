"""
Writes signing config block to android/app/build.gradle.
Called by CI after keystore is already decoded and verified.

Usage:
    python3 setup_keystore.py android/app/build.gradle
"""

import sys
import os
import pathlib

gradle_path = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "android/app/build.gradle")

store_pass = os.environ.get("SIGNING_STORE_PASSWORD", "")
key_alias  = os.environ.get("SIGNING_KEY_ALIAS",      "")
key_pass   = os.environ.get("SIGNING_KEY_PASSWORD",   "")

if not all([store_pass, key_alias, key_pass]):
    print("ERROR: SIGNING_STORE_PASSWORD, SIGNING_KEY_ALIAS, SIGNING_KEY_PASSWORD must all be set.")
    sys.exit(1)

gradle_content = gradle_path.read_text()

if "signingConfigs" in gradle_content:
    print(f"signingConfigs already present in {gradle_path} — skipping")
    sys.exit(0)

signing_block = f"""
android {{
    signingConfigs {{
        release {{
            storeFile file("release.keystore")
            storePassword System.getenv("SIGNING_STORE_PASSWORD")
            keyAlias      System.getenv("SIGNING_KEY_ALIAS")
            keyPassword   System.getenv("SIGNING_KEY_PASSWORD")
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
            versionNameSuffix "-debug"
            debuggable true
        }}
    }}
}}
"""

gradle_path.write_text(gradle_content + signing_block)
print(f"Signing config written to {gradle_path}")
