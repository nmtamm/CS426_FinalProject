# Nuti Plan

**Course:** CS426 - Mobile Device Application Development
**Final Project**

React Native (Expo) app with a FastAPI backend for ingredient-based recipe discovery, calorie calculation, custom recipes, and favorites.

## Group Info

| Student ID | Name            |
| ---------- | --------------- |
| 23125030   | Phan Tan Dat    |
| 24125042   | Nguyen Minh Tam |
| 24125055   | Tran Trung Hau  |
| 24125074   | Le Gia Phuc     |

GitHub repository: https://github.com/nmtamm/CS426_FinalProject

## Test Credentials

No accounts are pre-seeded. Register via the app's **Register** screen or `POST /api/auth/register`, then log in with the same credentials. Example:

- Username: `testuser`
- Password: `testpass123`

## Backend Setup

Take a look at `backend\README.md` for more detail

## Frontend Setup (Dev)

```bash
cd frontend
yarn install
cp .env.example .env    # physical device only, see below
yarn start               # press "a" for Android, "i" for iOS
```

Requires [Expo Go](https://expo.dev/go) on a physical device, or an emulator/simulator, with the backend running.

- Android emulator / iOS simulator / web: no config needed.
- Physical device: set `EXPO_PUBLIC_API_URL` in `frontend/.env` to the backend machine's LAN IP, then restart `yarn start`.

## Build an APK

Requires Android SDK + NDK and JDK 17.

```bash
cd frontend
npx expo prebuild -p android
cd android
echo sdk.dir=C:/path/to/Android/Sdk > local.properties
./gradlew assembleRelease "-PreactNativeArchitectures=arm64-v8a" "-Pandroid.enableMinifyInReleaseBuilds=true" "-Pandroid.enableShrinkResourcesInReleaseBuilds=true" "-Pexpo.useLegacyPackaging=true"

`local.properties` is wiped on every `expo prebuild` re-run — for a persistent alternative, set `ANDROID_HOME` as an OS environment variable instead.

Output: `frontend/android/app/build/outputs/apk/release/app-release.apk`. Signed with the checked-in debug keystore.

Flags (all optional, each reduces APK size):

| Flag                                                  | Effect                                  |
| ----------------------------------------------------- | --------------------------------------- |
| `-PreactNativeArchitectures=arm64-v8a`                | Build one CPU architecture instead of 4 |
| `-Pandroid.enableMinifyInReleaseBuilds=true`          | R8 code shrinking                       |
| `-Pandroid.enableShrinkResourcesInReleaseBuilds=true` | Unused-resource removal                 |
| `-Pexpo.useLegacyPackaging=true`                      | Compress native `.so` libraries         |

With all flags: ~20 MB. With none: 200+ MB (4 architectures, unminified, uncompressed).

**Android Studio:** `Build → Build Bundle(s) / APK(s) → Build APK(s)`. Applies the flags above only if set in `frontend/android/gradle.properties`; otherwise builds the unoptimized 200+ MB variant.

**Windows path-length limit:** `react-native-gesture-handler`'s codegen can exceed 260 characters if the repo path is long. `LongPathsEnabled=1` does not fix this — the SDK's bundled Ninja predates Windows long-path support. Fix: replace `<sdk>/cmake/<version>/bin/ninja.exe` with a build ≥1.11 from https://github.com/ninja-build/ninja/releases.
```
