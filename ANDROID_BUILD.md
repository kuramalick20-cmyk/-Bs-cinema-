# BS Cinema — Android App (Capacitor)

This project is wrapped as an Android app using [Capacitor](https://capacitorjs.com/).
The website code is unchanged — Capacitor wraps the built web app in a native Android WebView.

## App Details

- **App name:** BS Cinema
- **Package ID:** `com.bsstudio.bscinema`

## Build Commands

### 1. Install dependencies
```bash
npm install
```

### 2. Build the web app and sync to Android
```bash
npm run build:android
```
(This runs `vite build && cap sync android`)

### 3. Open the Android project in Android Studio
```bash
npm run open:android
```
Or directly:
```bash
npx cap open android
```

### 4. Build a debug APK for testing
In Android Studio:
- Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**

Or from the command line:
```bash
cd android
./gradlew assembleDebug
```
The debug APK will be at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### 5. Build a release AAB for Google Play
In Android Studio:
- Select **Build > Generate Signed Bundle / APK > Android App Bundle**
- Create or select a keystore, then build

Or from the command line (requires a keystore):
```bash
cd android
./gradlew bundleRelease
```
The release AAB will be at:
`android/app/build/outputs/bundle/release/app-release.aab`

**Note:** For release builds, you need a keystore file. Create one with:
```bash
keytool -genkey -v -keystore release.keystore -alias bscinema -keyalg RSA -keysize 2048 -validity 10000
```
Then add to `android/app/build.gradle` under `android { signingConfigs { release { ... } } }`.

## Development Workflow

1. Make changes to the web app (src/)
2. Run `npm run build:android` to rebuild and sync
3. Open Android Studio and run on a device/emulator

## What Capacitor Does

- Wraps the built web app (`dist/`) in a native Android WebView
- Provides native plugins: StatusBar, SplashScreen, Browser (external links)
- Handles back button, app lifecycle, and permissions
- All existing authentication, database, and API calls work as-is
