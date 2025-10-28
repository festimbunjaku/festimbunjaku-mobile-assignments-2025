# 🍅 Pomodoro Timer App

A minimalistic Pomodoro timer mobile app with focus statistics, built with React Native (Expo), TypeScript, and Supabase.

## ✨ Features

- ⏱️ **Customizable Timer**: 30min work / 10min break (default)
- 🎯 **Focus Tracking**: Track sessions and focus time
- 📊 **Statistics**: View your productivity stats and graphs
- 📜 **30-Day History**: See all your past sessions
- 🌙 **Dark Mode**: Easy on the eyes
- 🔔 **Alarm Sounds**: Get notified when sessions complete
- 🔒 **Secure Auth**: Email/password authentication with Supabase RLS
- 📱 **Native iOS**: Optimized for iOS devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Xcode) or physical iOS device
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   cd pomodoro-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   Copy your Supabase credentials into `.env`:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   Find these in your Supabase project: **Settings → API**

4. **Setup Supabase Database**

   The database tables and policies are already created if you ran the SQL scripts. If not, see the `PLAN.md` file for the complete database schema.

5. **Add Alarm Sound (Optional)**

   Place an alarm sound file at: `src/assets/sounds/alarm.mp3`

### Running the App

**Start Development Server:**

```bash
npm start
```

**Run on iOS Simulator:**

```bash
npm run ios
```

**Run on iOS Device:**

```bash
npx expo run:ios
```

## 📁 Project Structure

```
pomodoro-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Timer/          # Timer-specific components (to be built)
│   │   ├── Stats/          # Stats components (to be built)
│   │   ├── History/        # History components (to be built)
│   │   └── Common/         # Common UI components (Button, Input, etc.)
│   ├── screens/            # App screens
│   │   ├── Auth/           # Login & Register screens
│   │   ├── TimerScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/         # Navigation configuration
│   ├── services/           # Business logic & API
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React Context providers
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   ├── constants/          # App constants (colors, defaults)
│   └── assets/             # Static assets (sounds, images)
├── App.tsx                 # Root component
└── .env                    # Environment variables (not in git)
```

## 🎨 Design System

### Light Mode Colors

- Background: `#F7F7F5` (Soft off-white)
- Primary: `#7C8B9E` (Muted blue-gray)
- Work Accent: `#8FA89E` (Muted sage green)
- Break Accent: `#D4A373` (Muted terracotta)

### Dark Mode Colors

- Background: `#1C1C1E` (Very dark gray)
- Primary: `#8FA8BC` (Lighter muted blue)
- Work Accent: `#9BB8A7` (Lighter sage)
- Break Accent: `#D9B896` (Lighter terracotta)

## 🔐 Authentication

- Email/password authentication via Supabase
- Row Level Security (RLS) enabled on all tables
- Default settings auto-created on registration
- Secure session management with AsyncStorage

## 📦 Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **Charts**: react-native-chart-kit
- **Audio**: expo-av
- **Background Tasks**: expo-task-manager

## 🛠️ Development Status

### ✅ Completed

- Project setup and configuration
- Folder structure
- TypeScript types
- Supabase client configuration
- Authentication flow (Login/Register)
- Navigation structure (Auth + Main tabs)
- Common UI components (Button, Input, LoadingSpinner)
- Utility functions (time formatting, date utils)
- Database schema and RLS policies

### 🚧 In Progress / To Do

- Timer functionality with pause/resume
- Background timer support
- Session tracking and database integration
- Statistics screen with charts
- History screen with session list
- Full settings screen (duration sliders, toggles)
- Theme system (dark mode)
- Sound management
- Performance optimization

## 📝 Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web browser
```

## 🧪 Testing

1. **Authentication**: Register a new account and login
2. **Database**: Verify profile and settings are auto-created
3. **Navigation**: Test navigation between tabs
4. **Logout**: Test logout functionality in Settings

## 📖 Documentation

See `PLAN.md` for the complete implementation plan, database schema, and feature specifications.

## 🤝 Contributing

This is a personal project for learning and portfolio purposes.

## 📄 License

MIT

---

**Built with ❤️ using React Native + Expo + Supabase**
