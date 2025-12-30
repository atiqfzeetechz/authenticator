# Google Sign-In Setup for Play Store

## Current Config
- Package: `com.authenticator.fzeetechz`
- Upload Key SHA-1: `70:FD:AB:E2:0F:D8:81:B0:12:CD:9D:CA:53:7C:AA:00:E9:24:5C:A9`

## Steps to Fix:

### 1. Get Play Console App Signing SHA-1
- Go to Play Console → Your App → Setup → App signing
- Copy "SHA-1 certificate fingerprint" from "App signing key certificate"

### 2. Add Both SHA-1 to Google Cloud Console
- Go to: https://console.cloud.google.com/
- APIs & Services → Credentials
- Edit Android OAuth 2.0 Client ID
- Add both SHA-1 fingerprints:
  - Upload key: `70:FD:AB:E2:0F:D8:81:B0:12:CD:9D:CA:53:7C:AA:00:E9:24:5C:A9`
  - App signing key: (from Play Console)

### 3. Verify Package Name
- Google Console: `com.authenticator.fzeetechz`
- Play Console: Should match exactly

### 4. Test
- Upload new AAB to Play Console
- Test Google Sign-In on production app