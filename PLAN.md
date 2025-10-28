# Pomodoro Timer + Focus Stats - Implementation Plan

## 📋 Project Overview

A minimalistic Pomodoro timer mobile app with focus statistics, built with React Native (Expo), TypeScript, and Supabase.

### Core Requirements

- **Default Timer**: 30min work / 10min break (customizable)
- **Features**: Manual start, pause/resume, background support, alarm sounds
- **Auth**: Email/password with Supabase RLS
- **Tracking**: Focus time, session count, 30-day history
- **Design**: Minimalistic, modern, muted colors, dark mode support
- **Platform**: iOS (local development)

---

## 🏗️ Project Structure

```
pomodoro-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Timer/
│   │   │   ├── TimerDisplay.tsx
│   │   │   ├── TimerControls.tsx
│   │   │   └── SessionIndicator.tsx
│   │   ├── Stats/
│   │   │   ├── StatCard.tsx
│   │   │   ├── FocusGraph.tsx
│   │   │   └── SessionSummary.tsx
│   │   ├── History/
│   │   │   ├── HistoryList.tsx
│   │   │   └── HistoryItem.tsx
│   │   └── Common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── LoadingSpinner.tsx
│   ├── screens/             # Main screens
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── TimerScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/          # Navigation setup
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── services/            # Business logic
│   │   ├── supabase.ts
│   │   ├── timer.service.ts
│   │   ├── stats.service.ts
│   │   └── storage.service.ts
│   ├── hooks/               # Custom hooks
│   │   ├── useTimer.ts
│   │   ├── useAuth.ts
│   │   ├── useStats.ts
│   │   └── useTheme.ts
│   ├── context/             # Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── SettingsContext.tsx
│   ├── types/               # TypeScript types
│   │   ├── timer.types.ts
│   │   ├── session.types.ts
│   │   └── user.types.ts
│   ├── utils/               # Helper functions
│   │   ├── timeFormatter.ts
│   │   ├── dateUtils.ts
│   │   └── soundManager.ts
│   ├── constants/           # App constants
│   │   ├── colors.ts
│   │   └── defaults.ts
│   └── assets/              # Sounds, images
│       └── sounds/
│           └── alarm.mp3
├── .env
├── app.json
├── App.tsx
├── package.json
└── tsconfig.json
```

---

## 🗄️ Database Schema (Supabase)

### Tables

#### 1. `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. `settings`

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  work_duration INTEGER DEFAULT 30, -- minutes
  break_duration INTEGER DEFAULT 10, -- minutes
  alarm_sound_enabled BOOLEAN DEFAULT TRUE,
  dark_mode_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### 3. `sessions`

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('work', 'break')),
  duration INTEGER NOT NULL, -- seconds actually focused
  target_duration INTEGER NOT NULL, -- target duration in seconds
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE,
  paused_time INTEGER DEFAULT 0, -- total paused time in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_sessions_user_completed ON sessions(user_id, is_completed, started_at);
```

### Row Level Security (RLS) Policies

#### `profiles`

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### `settings`

```sql
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON settings FOR UPDATE
  USING (auth.uid() = user_id);
```

#### `sessions`

```sql
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🎨 Design System

### Color Palette (Muted, Minimalistic)

#### Light Mode

```typescript
{
  background: '#F7F7F5',      // Soft off-white
  surface: '#FFFFFF',         // Pure white for cards
  primary: '#7C8B9E',         // Muted blue-gray
  secondary: '#A8B5C4',       // Lighter blue-gray
  text: {
    primary: '#2D3436',       // Dark gray
    secondary: '#636E72',     // Medium gray
    tertiary: '#A8B5C4',      // Light gray
  },
  accent: {
    work: '#8FA89E',          // Muted sage green
    break: '#D4A373',         // Muted terracotta
    success: '#7FB685',       // Muted green
    warning: '#C9A67A',       // Muted amber
  },
  border: '#E8E8E6',          // Very light gray
}
```

#### Dark Mode

```typescript
{
  background: '#1C1C1E',      // Very dark gray
  surface: '#2C2C2E',         // Dark gray for cards
  primary: '#8FA8BC',         // Lighter muted blue
  secondary: '#6A7A8A',       // Muted slate
  text: {
    primary: '#E8E8E8',       // Off-white
    secondary: '#A8B5C4',     // Light gray
    tertiary: '#6A7A8A',      // Medium gray
  },
  accent: {
    work: '#9BB8A7',          // Lighter sage
    break: '#D9B896',         // Lighter terracotta
    success: '#8FC497',       // Lighter green
    warning: '#D4B48F',       // Lighter amber
  },
  border: '#3C3C3E',          // Medium-dark gray
}
```

---

## 🧭 Navigation Structure

```
Root Navigator
├── Auth Stack (not authenticated)
│   ├── Login Screen
│   └── Register Screen
└── Main Tab Navigator (authenticated)
    ├── Timer Tab → Timer Screen
    ├── Stats Tab → Stats Screen
    ├── History Tab → History Screen
    └── Settings Tab → Settings Screen
```

---

## 📱 Screen Specifications

### 1. Login Screen

- Email input
- Password input
- Login button
- Link to Register screen
- Minimalist form design

### 2. Register Screen

- Email input
- Password input
- Confirm password input
- Register button
- Link to Login screen
- Auto-create default settings on registration

### 3. Timer Screen (Home)

**Components:**

- Large circular timer display (MM:SS)
- Session type indicator (Work/Break) with color coding
- Start button (becomes Pause when running)
- Resume button (when paused)
- Stop/Reset button
- Progress ring around timer
- Current session count today

**States:**

- Idle: Timer shows target duration, Start button visible
- Running: Timer counts down, Pause button visible
- Paused: Timer frozen, Resume + Stop buttons visible
- Completed: Show completion message, reset to idle

**Behavior:**

- Manual start required
- Pause/resume supported
- Background timer continues (use background tasks)
- On session complete: play alarm sound, save to DB
- Persist timer state in AsyncStorage
- On app reopen: restore timer state and continue

### 4. Stats Screen

**Components:**

- Summary cards:
  - Total focus time (today)
  - Sessions completed (today)
  - Current streak
  - Average session time
- Line graph: Focus time over last 7 days
- Bar chart: Sessions per day over last 7 days

**Data:**

- Real-time updates from Supabase
- Pull to refresh
- Show loading states

### 5. History Screen

**Components:**

- List of sessions (last 30 days)
- Each item shows:
  - Date & time
  - Session type (Work/Break)
  - Duration
  - Completion status
- Filter by date range
- Empty state for no history

**Features:**

- Scroll to load more
- Grouped by date
- Swipe to delete (optional)

### 6. Settings Screen

**Sections:**

1. **Timer Settings**

   - Work duration slider (1-60 min)
   - Break duration slider (1-30 min)
   - Show current values

2. **Sound Settings**

   - Alarm sound toggle
   - Test sound button

3. **Appearance**

   - Dark mode toggle

4. **Account**
   - Email display (read-only)
   - Logout button

**Behavior:**

- Changes auto-save to Supabase
- Show success feedback
- Confirm logout

---

## 🔧 Core Features Implementation

### Timer Logic (useTimer hook)

**State Management:**

```typescript
{
  status: 'idle' | 'running' | 'paused' | 'completed',
  sessionType: 'work' | 'break',
  timeRemaining: number, // seconds
  targetDuration: number, // seconds
  currentSessionId: string | null,
  startedAt: Date | null,
  pausedAt: Date | null,
  totalPausedTime: number, // seconds
}
```

**Methods:**

- `startTimer()`: Create session in DB, start countdown
- `pauseTimer()`: Pause countdown, update paused time
- `resumeTimer()`: Resume countdown
- `stopTimer()`: Save session to DB if completed
- `resetTimer()`: Reset to idle state

**Persistence:**

- Save timer state to AsyncStorage on every change
- On app mount: restore state, recalculate time remaining
- Use background tasks to continue timer when app is backgrounded

### Background Timer

**Implementation:**

- Use `expo-task-manager` and `expo-background-fetch`
- Register background task to update timer
- Limitations: iOS allows ~30 seconds of background time
- Solution: Calculate elapsed time based on timestamps

**Strategy:**

- Store start time and target duration
- On app resume: calculate elapsed time = now - startTime - pausedTime
- If elapsed >= target: mark session complete
- If not: update timeRemaining

### Sound Management

**Implementation:**

- Use `expo-av` for audio playback
- Load alarm sound on app start
- Play on session completion
- Respect alarm_sound_enabled setting

### Stats Calculation

**Queries:**

```typescript
// Today's total focus time
SELECT SUM(duration) FROM sessions
WHERE user_id = $1
AND type = 'work'
AND DATE(started_at) = CURRENT_DATE;

// Sessions completed today
SELECT COUNT(*) FROM sessions
WHERE user_id = $1
AND is_completed = TRUE
AND DATE(started_at) = CURRENT_DATE;

// Last 7 days data (for graphs)
SELECT DATE(started_at) as date,
       SUM(duration) as total_time,
       COUNT(*) as session_count
FROM sessions
WHERE user_id = $1
AND started_at >= NOW() - INTERVAL '7 days'
AND type = 'work'
GROUP BY DATE(started_at)
ORDER BY date;
```

### History Fetching

**Query:**

```typescript
SELECT * FROM sessions
WHERE user_id = $1
AND started_at >= NOW() - INTERVAL '30 days'
ORDER BY started_at DESC
LIMIT 50 OFFSET $2;
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-av": "~14.0.0",
    "expo-background-fetch": "~12.0.0",
    "expo-task-manager": "~11.8.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "react-native-screens": "~3.31.0",
    "react-native-safe-area-context": "4.10.0",
    "@supabase/supabase-js": "^2.39.0",
    "@react-native-async-storage/async-storage": "1.23.0",
    "react-native-url-polyfill": "^2.0.0",
    "react-native-chart-kit": "^6.12.0",
    "react-native-svg": "15.2.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "^5.1.0"
  }
}
```

---

## 🚀 Implementation Steps

### Phase 1: Project Setup & Configuration

1. **Initialize Expo Project**

   - `npx create-expo-app pomodoro-app --template expo-template-blank-typescript`
   - Navigate to project directory
   - Install all dependencies

2. **Setup Environment Variables**

   - Create `.env` file
   - Add Supabase URL and ANON_KEY
   - Configure environment variable loading

3. **Configure Supabase**

   - Create `src/services/supabase.ts`
   - Initialize Supabase client
   - Setup AsyncStorage for session persistence

4. **Setup TypeScript**

   - Configure `tsconfig.json`
   - Create type definition files

5. **Create Folder Structure**
   - Set up all folders as per project structure
   - Create index files for exports

### Phase 2: Database Setup

6. **Create Supabase Tables**

   - Run SQL migrations for `profiles`, `settings`, `sessions`
   - Create indexes

7. **Setup RLS Policies**

   - Enable RLS on all tables
   - Create and test policies

8. **Create Database Triggers**
   - Auto-create settings on user registration
   - Update `updated_at` timestamps

### Phase 3: Authentication

9. **Create Auth Context**

   - Setup `AuthContext.tsx` with login/register/logout
   - Implement `useAuth` hook

10. **Build Auth Screens**

    - Create `LoginScreen.tsx`
    - Create `RegisterScreen.tsx`
    - Implement form validation
    - Add loading states and error handling

11. **Setup Auth Navigation**
    - Create `AuthNavigator.tsx`
    - Handle auth state changes

### Phase 4: Theme & Settings

12. **Create Theme System**

    - Setup `ThemeContext.tsx`
    - Define light/dark color schemes
    - Implement `useTheme` hook

13. **Create Settings Context**

    - Setup `SettingsContext.tsx`
    - Load settings from Supabase on mount
    - Sync changes to Supabase

14. **Build Settings Screen**
    - Create settings UI
    - Implement sliders for durations
    - Add toggles for sound and dark mode
    - Add logout functionality

### Phase 5: Timer Core

15. **Create Timer Service**

    - Implement `timer.service.ts`
    - Create session management functions
    - Add AsyncStorage persistence

16. **Build Timer Hook**

    - Create `useTimer.ts`
    - Implement all timer states and methods
    - Add persistence logic

17. **Setup Background Tasks**

    - Configure `expo-task-manager`
    - Implement background timer updates
    - Test background behavior

18. **Create Timer Screen**
    - Build `TimerScreen.tsx`
    - Create timer display component
    - Add control buttons
    - Implement timer UI with animations
    - Add session type indicator

### Phase 6: Sound System

19. **Setup Sound Manager**

    - Create `soundManager.ts`
    - Load alarm sound
    - Implement play/stop functions

20. **Add Alarm Sound**
    - Find/add alarm sound file
    - Integrate with timer completion
    - Respect sound settings

### Phase 7: Stats & History

21. **Create Stats Service**

    - Implement `stats.service.ts`
    - Write query functions for stats
    - Add caching logic

22. **Build Stats Hook**

    - Create `useStats.ts`
    - Fetch and aggregate data
    - Handle loading/error states

23. **Create Stats Screen**

    - Build `StatsScreen.tsx`
    - Create stat cards
    - Implement charts (react-native-chart-kit)
    - Add pull-to-refresh

24. **Create History Screen**
    - Build `HistoryScreen.tsx`
    - Create session list component
    - Group by date
    - Add pagination

### Phase 8: Navigation

25. **Setup Main Navigation**

    - Create `MainNavigator.tsx` with bottom tabs
    - Add tab icons and labels
    - Style tab bar with muted colors

26. **Integrate Navigation**
    - Connect auth and main navigators
    - Add navigation to `App.tsx`
    - Test navigation flow

### Phase 9: Polish & Testing

27. **Create Common Components**

    - Build reusable Button, Input components
    - Add loading spinner
    - Create consistent styling

28. **Add Error Handling**

    - Implement error boundaries
    - Add user-friendly error messages
    - Handle network failures gracefully

29. **Optimize Performance**

    - Add memoization where needed
    - Optimize re-renders
    - Test on iOS device

30. **Test on iOS Device**
    - Build development client: `npx expo run:ios`
    - Test all features on physical device
    - Test background timer behavior
    - Verify notifications/sounds

### Phase 10: Final Touches

31. **Add Loading States**

    - Implement skeleton screens
    - Add loading indicators
    - Improve perceived performance

32. **Add Empty States**

    - Create empty state for history
    - Add helpful messages

33. **Add Animations**

    - Smooth transitions between screens
    - Animate timer progress
    - Button feedback animations

34. **Final Testing**

    - Test all user flows
    - Verify data persistence
    - Test logout/login cycle
    - Verify RLS policies work

35. **Documentation**
    - Update README with setup instructions
    - Document environment variables
    - Add screenshots

---

## 🧪 Testing Checklist

### Authentication

- [ ] User can register with email/password
- [ ] User can login with email/password
- [ ] User can logout
- [ ] Settings auto-created on registration
- [ ] Session persists on app reload
- [ ] User data cleared on logout

### Timer

- [ ] Timer starts with manual click
- [ ] Timer counts down correctly
- [ ] Timer can be paused and resumed
- [ ] Timer can be stopped
- [ ] Timer continues in background
- [ ] Timer state restored on app reopen
- [ ] Session saved to DB on completion
- [ ] Alarm sound plays on completion (if enabled)
- [ ] Work/break sessions alternate correctly

### Settings

- [ ] Work duration slider works
- [ ] Break duration slider works
- [ ] Changes save to Supabase
- [ ] Dark mode toggle works
- [ ] Alarm sound toggle works
- [ ] Test sound button works

### Stats

- [ ] Today's focus time calculates correctly
- [ ] Session count shows correctly
- [ ] Graphs render with data
- [ ] Pull to refresh works
- [ ] Loading states show

### History

- [ ] Shows last 30 days
- [ ] Sessions grouped by date
- [ ] Scroll pagination works
- [ ] Empty state shows when no data

### General

- [ ] App works in light mode
- [ ] App works in dark mode
- [ ] No console errors
- [ ] RLS prevents unauthorized access
- [ ] Network errors handled gracefully
- [ ] App works offline (timer only)

---

## 📝 Notes

### Potential Challenges

1. **Background Timer**: iOS limits background execution. Solution: Calculate time based on timestamps.
2. **Sound Playback**: Requires proper audio session configuration.
3. **RLS Testing**: Ensure policies prevent cross-user data access.
4. **Real-time Updates**: May need Supabase subscriptions for live stats updates (optional).

### Future Enhancements (Out of Scope)

- Push notifications
- Widget support
- Apple Watch app
- Social features
- Task/project labels
- Pomodoro goals/streaks
- Export data
- Multiple timer presets

---

## 🎯 Success Criteria

- ✅ User can register and login
- ✅ Timer works in foreground and background
- ✅ Timer state persists across app restarts
- ✅ Sessions save to Supabase with RLS
- ✅ Stats show accurate data
- ✅ History shows last 30 days
- ✅ Settings sync with Supabase
- ✅ Dark mode works throughout app
- ✅ Alarm sound plays on session completion
- ✅ App has minimalistic, modern design with muted colors
- ✅ App runs smoothly on iOS device

---

**Ready to build! 🚀**
