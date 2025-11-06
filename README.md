# FocusEdge

A modern, feature-rich Pomodoro Technique timer application built with React Native and Expo. FocusEdge helps you boost productivity through focused work sessions with customizable timers, detailed analytics, profile management, and beautiful UI design.

## ✨ Features

### 🎯 Smart Timer System

- Customizable work and break durations (1-60 minutes)
- Visual session indicators
- Background timer support
- Alarm sound notifications
- Pause, resume, and stop functionality
- Session completion tracking

### 📊 Analytics & Statistics

- Track your productivity over time
- Visual charts and graphs (react-native-chart-kit)
- Session history with detailed insights
- Daily, weekly, and monthly statistics
- Total focus time tracking
- Sessions completed counter

### 👤 User Profile Management

- User profile with email
- Profile picture upload (JPG/PNG, max 3MB)
- Profile picture storage via Supabase Storage
- Profile editing capabilities
- Persistent user data

### 🧘 Meditation Reminders

- Optional meditation reminders during work sessions
- Configurable reminder intervals (default: 5 minutes)
- Sound notifications for meditation breaks
- Toggle meditation feature on/off

### 🎨 Modern UI/UX

- Beautiful, clean interface with muted color palette
- Light and dark mode support
- Custom theme system
- Smooth animations and transitions
- Responsive design for all screen sizes
- Bottom tab navigation

### 🔐 User Authentication

- Secure user accounts via Supabase
- Email and password authentication
- Persistent login sessions
- User-specific settings and data
- Row Level Security (RLS) policies

### ⚙️ Customizable Settings

- Adjustable work/break durations
- Enable/disable alarm sounds
- Dark mode toggle
- Meditation reminders toggle
- Meditation interval configuration
- Test sound functionality

### 📱 Cross-Platform

- iOS support (with native builds)
- Android support
- Web support
- Expo Go compatible

## 🛠️ Tech Stack

### Core Technologies

- **Framework**: React Native 0.81.5
- **Platform**: Expo ~54.0.20
- **Language**: TypeScript 5.9.2
- **React**: 19.1.0

### Navigation & UI

- **Navigation**: React Navigation 7.x
  - Bottom Tabs Navigator
  - Stack Navigator
- **State Management**: React Context API
- **Icons**: Expo Vector Icons (@expo/vector-icons)
- **Fonts**: Inter (via @expo-google-fonts/inter)
- **Charts**: react-native-chart-kit

### Backend & Storage

- **Backend**: Supabase
  - Authentication
  - PostgreSQL Database
  - Storage (for profile pictures)
- **Local Storage**: AsyncStorage (@react-native-async-storage/async-storage)

### Media & Notifications

- **Audio**: expo-av (for alarm sounds)
- **Image Picker**: expo-image-picker
- **Notifications**: expo-notifications
- **Background Tasks**: expo-background-fetch, expo-task-manager

### Testing

- **Unit Testing**: Jest 30.2.0
- **Component Testing**: React Native Testing Library
- **E2E Testing**: Detox 20.20.0
- **Test Coverage**: Jest Coverage Reports

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### For iOS Development (macOS only)

- **Xcode** (latest version) - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **CocoaPods** - Install: `sudo gem install cocoapods`
- **iOS Simulator** (comes with Xcode)

### For Android Development

- **Android Studio** - [Download](https://developer.android.com/studio)
- **Android SDK** and **Platform Tools**
- **Java JDK** (11 or higher)
- **Android Emulator** or physical device

### For Testing

- **Expo Go App** (for quick testing) - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779) | [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/festimbunjaku/festimbunjaku-mobile-assignments-2025.git
cd festimbunjaku-mobile-assignments-2025/pomodoro-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all project dependencies and automatically run `patch-package` post-install to apply any necessary patches.

### 3. Set Up Environment Variables

Create a `.env` file in the `pomodoro-app` directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: Get your Supabase credentials from your [Supabase Dashboard](https://app.supabase.com/) → Settings → API.

### 4. Install iOS Dependencies (macOS only)

If you're planning to run on iOS:

```bash
cd ios
pod install
cd ..
```

## 🏃 Running the Application

### Quick Start

Start the Expo development server:

```bash
npm start
```

This will open the **Expo Developer Tools** in your browser, displaying a QR code and providing all the options you need:

- **Press `i`** - Run on iOS Simulator (macOS only)
- **Press `a`** - Run on Android Emulator/Device
- **Press `w`** - Run on Web Browser
- **Scan QR Code** - Open in Expo Go app on your physical device

### Running on Physical Devices with Expo Go

1. **Install Expo Go** on your mobile device:

   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Connect to the same network**: Ensure your computer and mobile device are on the same Wi-Fi network.

3. **Scan the QR code**:
   - **iOS**: Open the Camera app and scan the QR code from the terminal or browser
   - **Android**: Open the Expo Go app and tap "Scan QR code"

### Alternative: Direct Platform Commands

**iOS Simulator** (macOS only):

```bash
npm run ios
```

**Android Emulator/Device** (make sure emulator is running first):

```bash
npm run android
```

**Web Browser**:

```bash
npm run web
```

## 📁 Project Structure

```
pomodoro-app/
├── __mocks__/              # Mock files for testing
│   ├── expo/              # Expo mocks
│   └── soundFile.js       # Sound file mocks
├── __tests__/             # Unit and integration tests
│   ├── components/        # Component tests
│   ├── context/           # Context tests
│   ├── hooks/             # Hook tests
│   ├── screens/           # Screen tests
│   ├── services/          # Service tests
│   ├── utils/             # Utility tests
│   └── error/             # Error handling tests
├── android/               # Android native code (generated)
├── assets/                # App icons and images
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── e2e/                   # End-to-end tests
│   ├── auth.e2e.ts
│   ├── error-recovery.e2e.ts
│   ├── history.e2e.ts
│   ├── settings.e2e.ts
│   ├── stats.e2e.ts
│   └── timer.e2e.ts
├── ios/                   # iOS native code (generated)
├── patches/               # Patch files for dependencies
│   └── expo+54.0.20.patch
├── src/
│   ├── assets/
│   │   └── sounds/        # Alarm sound files
│   │       ├── alarm.mp3
│   │       └── README.md
│   ├── components/        # Reusable UI components
│   │   ├── Common/        # Common components
│   │   │   ├── Avatar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── index.ts
│   │   └── Timer/         # Timer-specific components
│   │       ├── SessionIndicator.tsx
│   │       ├── TimerControls.tsx
│   │       ├── TimerDisplay.tsx
│   │       └── index.ts
│   ├── constants/         # App constants
│   │   ├── colors.ts      # Color definitions
│   │   ├── defaults.ts    # Default values
│   │   ├── index.ts
│   │   └── typography.ts  # Typography definitions
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ProfileContext.tsx
│   │   ├── SettingsContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useStats.ts
│   │   └── useTimer.ts
│   ├── navigation/        # Navigation configuration
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── UnauthNavigator.tsx
│   ├── screens/           # Screen components
│   │   ├── Auth/          # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── TimerScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/          # API and service integrations
│   │   ├── supabase.ts    # Supabase client
│   │   ├── storage.service.ts
│   │   ├── timer.service.ts
│   │   ├── profile.service.ts
│   │   ├── meditation.service.ts
│   │   └── background.service.ts
│   ├── types/             # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── session.types.ts
│   │   ├── timer.types.ts
│   │   └── user.types.ts
│   └── utils/             # Utility functions
│       ├── dateUtils.ts
│       ├── errorTracker.ts
│       ├── soundManager.ts
│       ├── timeFormatter.ts
│       └── index.ts
├── App.tsx                # Main app component
├── app.json              # Expo configuration
├── index.ts              # Entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest configuration
├── jest.setup.js         # Jest setup file
├── jest.setup.early.js   # Early Jest setup
└── .gitignore           # Git ignore rules
```

## ⚙️ Configuration

### Supabase Setup

1. **Create a new project** at [Supabase](https://app.supabase.com/)

2. **Get your credentials**:

   - Go to Settings → API
   - Copy your Project URL and anon/public key
   - Add them to your `.env` file

3. **Create the database tables**:

**Profiles Table**:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sessions Table**:

```sql
CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  work_duration INTEGER NOT NULL,
  break_duration INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Settings Table**:

```sql
CREATE TABLE user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  work_duration INTEGER DEFAULT 25,
  break_duration INTEGER DEFAULT 5,
  alarm_sound_enabled BOOLEAN DEFAULT true,
  dark_mode_enabled BOOLEAN DEFAULT false,
  meditation_enabled BOOLEAN DEFAULT false,
  meditation_interval_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. **Set up Row Level Security (RLS)**:

   - Enable RLS on all tables
   - Create policies for authenticated users to:
     - Read their own data
     - Update their own data
     - Insert their own data

5. **Create Supabase Storage bucket**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `profile-pictures`
   - Set it to **Public** (or configure RLS policies for authenticated users)
   - Add RLS policy: Users can upload/delete their own profile pictures

### Sound Files

Alarm sounds should be placed in `src/assets/sounds/` directory. The default alarm file is `alarm.mp3`.

Supported formats: MP3, WAV, M4A, AAC, OGG

## 📝 Available Scripts

### Development

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator/device
- `npm run web` - Run on web browser

### Testing

- `npm test` - Run all unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:ci` - Run tests in CI mode with coverage
- `npm run test:e2e:build` - Build app for E2E testing
- `npm run test:e2e` - Run E2E tests
- `npm run test:e2e:ios` - Run iOS E2E tests

## 🧪 Testing

FocusEdge includes a comprehensive test suite covering unit tests, integration tests, and end-to-end (E2E) tests to ensure code quality and reliability.

### Test Structure

The project follows a testing pyramid approach:

- **Unit Tests (70%)** - Services, hooks, utilities, and components
- **Integration Tests (20%)** - Component interactions
- **E2E Tests (10%)** - Critical user flows

### Running Tests

#### Unit Tests

Run all unit tests:

```bash
npm test
```

Run tests in watch mode (for development):

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

Run tests in CI mode:

```bash
npm run test:ci
```

#### End-to-End (E2E) Tests

**Prerequisites for E2E Testing:**

- iOS: Xcode and iOS Simulator (macOS only)
- Android: Android Studio and Android Emulator

**Build the app for E2E testing:**

```bash
npm run test:e2e:build
```

**Run E2E tests:**

```bash
npm run test:e2e
```

**Run iOS E2E tests specifically:**

```bash
npm run test:e2e:ios
```

### Test Coverage

The project maintains high test coverage across all modules:

- **Services**: 80%+ coverage (Timer, Storage, Background, Profile, Meditation services)
- **Hooks**: 70%+ coverage (useTimer, useAuth, useStats)
- **Utilities**: 90%+ coverage (Time formatter, Date utils, Sound manager)
- **Components**: 70%+ coverage (Common and Timer components)
- **Screens**: All screens have basic rendering tests

### Test Files Structure

```
pomodoro-app/
├── __tests__/
│   ├── components/          # Component unit tests
│   │   ├── Common/         # Button, Input, LoadingSpinner, Avatar
│   │   └── Timer/          # TimerDisplay, TimerControls, SessionIndicator
│   ├── hooks/              # Hook tests (useTimer, useAuth, useStats)
│   ├── services/           # Service tests
│   │   ├── timer.service.test.ts
│   │   ├── storage.service.test.ts
│   │   ├── background.service.test.ts
│   │   ├── profile.service.test.ts
│   │   └── meditation.service.test.ts
│   ├── utils/              # Utility tests
│   ├── screens/            # Screen tests
│   │   └── Auth/           # Login and Register screen tests
│   └── error/              # Error handling tests
└── e2e/                    # End-to-end tests
    ├── auth.e2e.ts         # Authentication flow
    ├── timer.e2e.ts        # Timer flow
    ├── settings.e2e.ts     # Settings flow
    ├── stats.e2e.ts        # Statistics flow
    ├── history.e2e.ts      # History flow
    └── error-recovery.e2e.ts # Error recovery flow
```

### Test Categories

#### 1. Unit Tests

**Services:**

- Timer Service: Session creation, updates, statistics calculation
- Storage Service: State persistence, theme storage
- Background Service: Background task handling
- Profile Service: Profile CRUD operations, image upload
- Meditation Service: Meditation reminder logic

**Hooks:**

- `useTimer`: Timer state management, start/pause/resume/stop, completion handling
- `useAuth`: Authentication, session management, validation
- `useStats`: Statistics loading, refresh, error handling

**Utilities:**

- Time formatting and conversion
- Date manipulation and grouping
- Sound management
- Error tracking

**Components:**

- Common components (Button, Input, LoadingSpinner, ErrorBoundary, Avatar)
- Timer components (TimerDisplay, TimerControls, SessionIndicator)

**Screens:**

- All screen components have rendering tests

#### 2. Error Testing

Comprehensive error handling tests for:

- Network errors (Supabase connection, API failures)
- Storage errors (AsyncStorage failures, corrupted data)
- Authentication errors (invalid credentials, expired sessions)
- Timer errors (state corruption, background task failures)
- Sound errors (missing files, permission issues)
- Image upload errors (file size, format validation)
- Component errors (ErrorBoundary, missing context)

#### 3. E2E Tests

End-to-end tests covering critical user flows:

- **Authentication**: User registration, login, logout
- **Timer**: Start, pause, resume, stop, completion
- **Settings**: Update durations, toggle dark mode, toggle alarm sound, meditation settings
- **Profile**: Update profile, upload profile picture
- **Stats**: Display statistics, pull to refresh
- **History**: View session history, scroll through sessions
- **Error Recovery**: Network error handling, app state recovery

### Testing Tools

- **Jest**: Test runner and assertion library
- **React Native Testing Library**: Component testing utilities
- **Detox**: E2E testing framework for React Native
- **Jest Coverage**: Code coverage reporting

### Continuous Integration

Tests are designed to run in CI/CD pipelines. The `test:ci` script runs tests with:

- Coverage reporting enabled
- Optimized worker count for CI environments
- Non-interactive mode

### Writing New Tests

When adding new features, follow these guidelines:

1. **Unit Tests First**: Write unit tests for services, hooks, and utilities
2. **Component Tests**: Test component rendering and interactions
3. **E2E Tests**: Add E2E tests for new user flows
4. **Error Cases**: Always test error scenarios
5. **Coverage**: Maintain >70% coverage for new code

### Test Best Practices

- ✅ Each test should be independent and isolated
- ✅ Use descriptive test names that explain what is being tested
- ✅ Follow AAA pattern: Arrange, Act, Assert
- ✅ Mock external dependencies (Supabase, AsyncStorage, etc.)
- ✅ Clean up after each test
- ✅ Test both success and error scenarios

### iOS Build

Using EAS Build (recommended):

```bash
npm install -g eas-cli
eas build --platform ios
```

Or using Expo CLI:

```bash
npx expo build:ios
```

### Android Build

Using EAS Build (recommended):

```bash
npm install -g eas-cli
eas build --platform android
```

Or using Expo CLI:

```bash
npx expo build:android
```

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add comments for complex logic

### File Organization

- Keep components in `src/components/`
- Keep screens in `src/screens/`
- Keep services in `src/services/`
- Keep utilities in `src/utils/`
- Keep types in `src/types/`

### State Management

- Use Context API for global state
- Use local state for component-specific state
- Avoid prop drilling

### Error Handling

- Use ErrorBoundary for component errors
- Implement try-catch blocks in async functions
- Provide user-friendly error messages
- Log errors appropriately



## 📄 License

This project is private and proprietary. All rights reserved.

## 👨‍💻 Author

**Festim Bunjaku**

- Website: [festimbunjaku.dev](https://festimbunjaku.dev)
- GitHub: [@festimbunjaku](https://github.com/festimbunjaku)

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI components styled with React Native
- Backend powered by [Supabase](https://supabase.com/)
- Fonts provided by [Google Fonts](https://fonts.google.com/)
- Charts powered by [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit)

---

Made with ❤️ using React Native and Expo
