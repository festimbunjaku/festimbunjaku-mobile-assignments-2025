# E2E Tests with Detox

This directory contains end-to-end tests for the Pomodoro app using Detox.

## Prerequisites

1. Install Detox CLI globally:
```bash
npm install -g detox-cli
```

2. Install Detox dependencies:
```bash
npm install --save-dev detox @detox/cli
```

3. For iOS:
   - Xcode and Xcode Command Line Tools
   - iOS Simulator

4. For Android:
   - Android Studio
   - Android SDK
   - Android Emulator

## Setup

1. Build the app for testing:
```bash
npm run test:e2e:build
```

2. Run E2E tests:
```bash
npm run test:e2e
```

## Test Structure

- `auth.e2e.ts` - Authentication flow tests
- `timer.e2e.ts` - Timer functionality tests
- `settings.e2e.ts` - Settings screen tests
- `stats.e2e.ts` - Statistics screen tests
- `history.e2e.ts` - History screen tests
- `error-recovery.e2e.ts` - Error handling tests

## Notes

- E2E tests require the app to be built before running
- Tests should be run on a clean simulator/emulator
- Some tests may require test user accounts in your Supabase instance
- Network conditions can be simulated using Detox's network mocking features

## Troubleshooting

If tests fail:
1. Ensure the app is built: `npm run test:e2e:build`
2. Check that simulators/emulators are running
3. Verify test IDs are correctly set in components
4. Check Detox configuration in `.detoxrc.js`

