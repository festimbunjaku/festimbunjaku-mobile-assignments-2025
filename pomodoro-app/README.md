# FocusEdge

A modern, feature-rich Pomodoro Technique timer application built with React Native and Expo. FocusEdge helps you boost productivity through focused work sessions with customizable timers, detailed analytics, and beautiful UI design.

## ✨ Features

- 🎯 **Smart Timer System**

  - Customizable work and break durations (1-60 minutes)
  - Visual session indicators
  - Background timer support
  - Alarm sound notifications

- 📊 **Analytics & Statistics**

  - Track your productivity over time
  - Visual charts and graphs
  - Session history with detailed insights
  - Weekly and monthly statistics

- 🎨 **Modern UI/UX**

  - Beautiful, clean interface
  - Light and dark mode support
  - Custom brown theme palette
  - Smooth animations and transitions
  - Responsive design for all screen sizes

- 👤 **User Authentication**

  - Secure user accounts via Supabase
  - Email and password authentication
  - Persistent login sessions
  - User-specific settings and data

- ⚙️ **Customizable Settings**

  - Adjustable work/break durations
  - Enable/disable alarm sounds
  - Dark mode toggle
  - Test sound functionality

- 📱 **Cross-Platform**
  - iOS support
  - Android support
  - Web support
  - Expo Go compatible

## 🛠️ Tech Stack

- **Framework**: React Native 0.81.5
- **Platform**: Expo ~54.0.20
- **Language**: TypeScript 5.9.2
- **Navigation**: React Navigation 7.x
- **State Management**: React Context API
- **Backend**: Supabase
- **Storage**: AsyncStorage
- **Fonts**: Inter (via @expo-google-fonts/inter)
- **Icons**: Expo Vector Icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Expo Go App** - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779) | [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### For iOS Development (macOS only):

- **Xcode** (latest version) - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **CocoaPods** - Install: `sudo gem install cocoapods`

### For Android Development:

- **Android Studio** - [Download](https://developer.android.com/studio)
- **Android SDK** and **Platform Tools**
- **Java JDK** (11 or higher)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/festimbunjaku/festimbunjaku-mobile-assignments-2025/tree/claim-topic-05
cd festimbunjaku-mobile-assignments-2025/pomodoro-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: Get your Supabase credentials from your [Supabase Dashboard](https://app.supabase.com/).

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

Alternatively, you can use the menu options in the Expo Developer Tools interface to select your preferred platform.

### Running on Physical Devices with Expo Go

1. **Install Expo Go** on your mobile device:

   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Connect to the same network**: Ensure your computer and mobile device are on the same Wi-Fi network.

3. **Scan the QR code**:
   - **iOS**: Open the Camera app and scan the QR code from the terminal or browser
   - **Android**: Open the Expo Go app and tap "Scan QR code"

### Alternative: Direct Platform Commands

While `npm start` provides all options in one place, you can also use these direct commands:

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
├── assets/                 # App icons and images
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Common/        # Common components (Button, Input, etc.)
│   │   ├── Timer/         # Timer-specific components
│   │   ├── Stats/         # Statistics components
│   │   └── History/       # History components
│   ├── constants/         # App constants (colors, typography, defaults)
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx
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
│   │   ├── Auth/         # Authentication screens
│   │   ├── HomeScreen.tsx
│   │   ├── TimerScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/          # API and service integrations
│   │   ├── supabase.ts
│   │   ├── storage.service.ts
│   │   ├── timer.service.ts
│   │   └── background.service.ts
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
│       ├── soundManager.ts
│       ├── dateUtils.ts
│       └── timeFormatter.ts
├── App.tsx                # Main app component
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## ⚙️ Configuration

### Supabase Setup

1. Create a new project at [Supabase](https://app.supabase.com/)
2. Go to Settings → API to get your credentials
3. Create the following tables in your Supabase database:

**Users Table** (usually created automatically by Supabase Auth)

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Update Row Level Security (RLS) policies as needed for your use case.

### Sound Files

Alarm sounds should be placed in `src/assets/sounds/` directory. The default alarm file is `alarm.mp3`.

## 🏗️ Building for Production

### iOS Build

```bash
expo build:ios
```

Or using EAS Build:

```bash
npm install -g eas-cli
eas build --platform ios
```

### Android Build

```bash
expo build:android
```

## 📝 Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator/device
- `npm run web` - Run on web browser


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

---

Made with ❤️ using React Native and Expo
