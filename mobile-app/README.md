# Mobile app

Passenger and driver app for the [Ride-Pooling Platform](../README.md), built with **Expo 51 / React Native 0.74**.

| Area | Folder |
|---|---|
| Intro, role selection, sign-in (email and phone OTP) | `screens/` |
| Passenger flows: GO, Pooling, Sharing | `userUI/` |
| Driver flows: incoming requests, navigation to passenger | `riderUI/` |
| In-ride chat and map navigation | `components/` |
| App state (screens, location, essentials) with persistence | `redux/` |

## Run

```bash
npm install
# 1. Add google-services.json from your Firebase project
# 2. Replace YOUR_GOOGLE_API_KEY in app.json and the map components
npx expo run:android      # builds the Expo dev client (needs native Firebase modules)
```

The app calls the callable Cloud Functions in [`../backend`](../backend), so deploy those to the same Firebase project first.
