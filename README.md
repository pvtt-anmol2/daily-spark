# Daily Spark

A tiny, polished Expo app: shows a random motivational quote, lets you save favorites (persisted locally with AsyncStorage), with a smooth fade animation between quotes.

## Run it locally

```bash
npm install
npx expo start
```

Scan the QR code with the Expo Go app (iOS/Android) to preview instantly.

## Ship it with EAS (from your Expo account)

You said you have an Expo account but no project yet — here's the fastest path to a real build:

1. **Log in and link the project**
   ```bash
   npx eas login
   npx eas init
   ```
   `eas init` creates a new project under your account and writes a real `projectId` into `app.json` (replacing the `REPLACE_WITH_YOUR_EAS_PROJECT_ID` placeholder).

2. **Push this code to a GitHub repo** and connect it on expo.dev (Project → GitHub) — the build tools need a linked repo to build from a git ref.

3. **Trigger a build** (either via CLI or hand me the project ID / repo and I can trigger it for you):
   ```bash
   npx eas build --platform ios --profile preview
   npx eas build --platform android --profile preview
   ```

4. **Submit to the stores** once you're happy with a production build:
   ```bash
   npx eas submit --platform ios
   npx eas submit --platform android
   ```

Once you have the EAS **project ID** (from step 1) and the code is pushed to GitHub, send me both and I can kick off the build directly for you.
