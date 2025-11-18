# SenseAid Theme System & Profile Page Updates

## 🎨 New Theme Switcher

All pages now support dynamic color themes! Switch themes from the navigation bar.

### Available Themes

1. **Ocean** - Blue → Cyan (Default)

   - Primary: `from-blue-500 to-cyan-500`
   - Vibrant and tech-focused

2. **Forest** - Green → Emerald

   - Primary: `from-green-500 to-emerald-500`
   - Natural and calming

3. **Sunset** - Orange → Red

   - Primary: `from-orange-500 to-red-500`
   - Warm and energetic

4. **Midnight** - Indigo → Violet

   - Primary: `from-indigo-500 to-violet-500`
   - Deep and sophisticated

5. **Coral** - Rose → Pink

   - Primary: `from-rose-500 to-pink-500`
   - Modern and trendy

6. **Lavender** - Purple → Fuchsia
   - Primary: `from-purple-500 to-fuchsia-500`
   - Classic and vibrant

## 🎯 How Theme System Works

### Theme Store (`src/store/themeStore.ts`)

- Uses Zustand for state management
- 6 color themes defined
- Each theme includes:
  - `primary` - Main gradient for buttons and highlights
  - `secondary` - Alternative gradient
  - `accent` - Accent gradient
  - `gradient` - Full 3-color gradient for hero sections
  - `bgDark` - Dark background gradient
  - `bgLight` - Light/card background gradient
  - `text` - Text color classes
  - `textMuted` - Muted text color

### Theme Switcher Component (`src/components/ThemeSwitcher.tsx`)

- Palette icon in navigation bar
- Dropdown menu showing all themes
- Color preview circles
- Checkmark for current theme
- Smooth animations

### Usage in Components

```typescript
import { useThemeStore } from "@/store/themeStore";

export default function MyComponent() {
  const colors = useThemeStore((state) => state.colors);

  return (
    <div className={`bg-gradient-to-br ${colors.bgDark} text-white`}>
      <button className={`bg-gradient-to-r ${colors.primary}`}>Click Me</button>
    </div>
  );
}
```

## 👤 New Profile Page (`/profile`)

Complete user profile management page with:

### Features

- **User Avatar** - Display user's initials in gradient
- **Personal Info** - Name, email, student ID, department
- **Student Category** - Blind, Mute, Deaf, or General
- **Account Stats** - Courses enrolled, join date, status
- **Enrolled Courses** - List of all courses with progress
- **Account Settings** - Notification preferences and security
- **Logout Button** - Sign out and return to home

### Profile Page Flow

1. Only accessible when logged in
2. Shows all user information
3. Displays enrolled courses
4. Settings for notifications and 2FA
5. Easy logout button

## 📝 Updated Pages

All pages now support themes:

- ✅ Home page (`/`)
- ✅ Login page (`/login`)
- ✅ Dashboard (`/dashboard`)
- ✅ Courses (`/courses`)
- ✅ Messages (`/messages`)
- ✅ Blog (`/blog`)
- ✅ Profile (`/profile`) - NEW

## 🚀 How to Use

### Switch Themes

1. Click the **Palette icon** (🎨) in the navigation bar
2. Choose any theme from the dropdown
3. Watch the entire app change color instantly!

### Access Profile

1. After logging in, click your name/profile in navigation
2. Or navigate directly to `/profile`
3. View and manage all your settings

## 💻 Code Structure

```
src/
├── store/
│   └── themeStore.ts          # Theme definitions and state
├── components/
│   └── ThemeSwitcher.tsx      # Theme switcher dropdown
└── app/
    └── profile/
        └── page.tsx           # Profile page
```

## 🎨 Color Customization

To add a new theme, edit `src/store/themeStore.ts`:

```typescript
export const themes: Record<ThemeName, ThemeColors> = {
  myTheme: {
    primary: "from-[color1]-500 to-[color2]-500",
    secondary: "from-[color2]-500 to-[color1]-500",
    accent: "from-[color1]-600 to-[color2]-600",
    gradient: "from-[color1]-600 via-[color2]-600 to-[color3]-600",
    bgDark: "from-slate-900 via-[color1]-900 to-slate-900",
    bgLight: "from-slate-800/50 to-[color1]-900/50",
    text: "text-white",
    textMuted: "text-[color1]-100",
  },
};
```

## 🌐 Browser Support

- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Mobile browsers

## 🔄 Theme Persistence

Themes are stored in component state. To add persistence:

```typescript
useEffect(() => {
  const saved = localStorage.getItem("theme");
  if (saved) setTheme(saved);
}, []);

useEffect(() => {
  localStorage.setItem("theme", currentTheme);
}, [currentTheme]);
```

## ✨ Features

- 🎨 6 beautiful color themes
- 🔄 Instant theme switching
- 📱 Mobile responsive
- ♿ Accessibility friendly
- 🎯 Consistent across all pages
- 👤 Complete profile management
- 🔐 User settings and preferences
- 📊 Account information display

## 🎉 What's Next

- Add theme persistence to localStorage
- Create custom theme builder
- Add more predefined themes
- Save user's preferred theme
- Export theme as JSON

---

**Enjoy your new themes!** 🌈
