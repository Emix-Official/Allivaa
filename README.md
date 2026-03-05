# SenseAid - Universal University Student Portal

A sleek, modern, and fully accessible web platform designed to empower students with disabilities at universities. Built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion for smooth animations and accessibility.

##Project Overview

SenseAid is a comprehensive educational portal tailored for three primary user groups:

- **Blind Students** - Screen reader optimized with braille mode support and audio descriptions
- **Mute Students** - Visual communication tools with real-time transcription and chat support
- **Deaf Students** - Full video captions, sign language support, and visual notifications

Additionally, the platform serves **General Students** with comprehensive course management and collaboration tools.

## ✨ Features

### Core Features

- **User Authentication** - Secure login/signup with role-based access
- **Dashboard** - Personalized student dashboard with stats and course tracking
- **Course Management** - Browse, enroll, and track courses with progress indicators
- **Messaging System** - Real-time messaging with instructors and peers
- **Blog Section** - Educational articles, tips, and community stories
- **Profile Management** - Student profile with preferences and settings

### Accessibility Features

- **High Contrast Mode** - Enhanced contrast for visual accessibility
- **Adjustable Font Sizes** - 4 font size options (Small, Normal, Large, XLarge)
- **Screen Reader Optimization** - WCAG 2.1 AA compliant
- **Reduced Motion** - Disable animations for users sensitive to motion
- **Caption Support** - Enable captions for video content
- **Braille Mode** - Support for braille display devices
- **Keyboard Navigation** - Full keyboard support throughout the application

### UI/UX Features

- **Modern Gradient Design** - Beautiful gradient backgrounds and animations
- **Responsive Layout** - Fully responsive on mobile, tablet, and desktop
- **Smooth Animations** - Framer Motion animations with reduce-motion support
- **Dark Theme** - Eye-friendly dark color scheme
- **Interactive Components** - Hover effects, transitions, and micro-interactions

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library
- **Zustand** - Lightweight state management

### State Management

- **Zustand** - Global state for authentication and accessibility settings
- **Client-side storage** - Local preferences persistence

### Development Tools

- **ESLint** - Code linting
- **Tailwind CSS** - Styling
- **Next.js CLI** - Build tools

## 📁 Project Structure

```
senseaid-universal/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home/landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── layout-client.tsx     # Client-side layout wrapper
│   │   ├── globals.css           # Global styles
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard page
│   │   ├── courses/
│   │   │   └── page.tsx          # Courses listing page
│   │   ├── messages/
│   │   │   └── page.tsx          # Messaging page
│   │   └── blog/
│   │       └── page.tsx          # Blog page
│   ├── components/
│   │   ├── Navigation.tsx        # Main navigation bar
│   │   └── AccessibilityPanel.tsx # Accessibility settings panel
│   ├── store/
│   │   ├── authStore.ts          # Authentication state
│   │   └── accessibilityStore.ts # Accessibility settings state
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**

```bash
cd senseaid-universal
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment variables:**
   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### For Users

#### Logging In

1. Navigate to the home page
2. Click "Get Started" or go to `/login`
3. Enter your email and password
4. Click "Sign In"

#### Accessing Dashboard

After login, you'll see:

- **Stats Cards** - Active courses, assignments, grades, achievements
- **Course List** - Enrolled courses with progress tracking
- **Upcoming Events** - Due assignments and exams
- **Quick Actions** - Shortcuts to common tasks

#### Adjusting Accessibility Settings

1. Click the **Settings** button (gear icon) in the navigation
2. Choose your preferences:
   - Font size (Small/Normal/Large/XLarge)
   - High contrast mode
   - Screen reader optimization
   - Reduce motion
   - Enable captions
   - Braille mode
3. Changes apply immediately
4. Use "Reset to Defaults" to revert changes

#### Browsing Courses

1. Navigate to **Courses** page
2. Search by course name or code
3. Filter by difficulty level
4. Click **Enroll Now** to join a course
5. View course materials and resources

#### Messaging

1. Go to **Messages** page
2. Select a conversation from the left panel
3. Type and send messages
4. Create new conversations with the **+** button

### For Developers

#### Adding New Pages

1. Create a new folder in `src/app/` with the route name
2. Add a `page.tsx` file with your component
3. Import `Navigation` component for consistent layout
4. Use Zustand stores for state management

#### Adding Accessibility Features

1. Use the `useAccessibilityStore` hook
2. Check accessibility settings and apply styles conditionally
3. Test with screen readers and keyboard navigation

#### Customizing Styles

1. Modify Tailwind classes in components
2. Update `tailwind.config.ts` for custom themes
3. Use gradient utilities: `bg-gradient-to-r from-blue-500 to-purple-500`

## 🎨 Design System

### Color Palette

- **Primary Gradient** - Blue → Purple → Pink
- **Background** - Slate-900, Slate-800
- **Text** - White, Gray-300, Gray-400
- **Accent** - Purple-500, Purple-600

### Typography

- **Headings** - Bold, large sizes (3xl-7xl)
- **Body** - Regular weight, readable sizes
- **Captions** - Small, gray text for secondary info

### Components

- **Cards** - Rounded borders with gradient backgrounds
- **Buttons** - Gradient backgrounds, hover effects
- **Inputs** - Dark backgrounds, purple focus rings
- **Icons** - Lucide React icons throughout

## 📱 Responsive Breakpoints

- **Mobile** - 320px to 640px
- **Tablet** - 641px to 1024px
- **Desktop** - 1025px and above

Using Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`

## ♿ Accessibility Compliance

The platform follows **WCAG 2.1 Level AA** standards:

- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Sufficient color contrast
- ✅ Resizable text
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ ARIA labels where appropriate

## 🔐 Security Considerations

- Credentials are handled securely in `.env.local`
- Never commit sensitive keys to version control
- Implement proper authentication in production
- Validate user input on backend
- Use HTTPS in production

## 🚀 Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with one click

### Firebase Hosting (no Cloud Functions)

This repository is configured to run entirely client-side with Firebase Hosting and Firestore. Cloud Functions are not used — any previous `functions/` build/deploy hooks have been removed to avoid unnecessary costs.

- Build the app locally:

```powershell
npm run build
```

- Deploy hosting and Firestore rules/indexes only:

```powershell
firebase deploy --only hosting,firestore:rules,firestore:indexes
```

Or deploy hosting alone:

```powershell
firebase deploy --only hosting
```

### Other Platforms

The app can also be deployed to any Node.js hosting if preferred:

- AWS Amplify
- Netlify
- Heroku
- DigitalOcean
- Railway

Build command: `npm run build`
Start command: `npm run start`

## 📚 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

## 🎓 Features by Student Category

### For Blind Students

- Screen reader optimized interface
- Braille display support
- Audio descriptions for images
- High contrast mode
- Keyboard-only navigation

### For Mute Students

- Text-based communication system
- Video transcription
- Chat with instructors and peers
- Written assignment submission
- Visual notifications

### For Deaf Students

- Video captions on all media
- Sign language interpreter scheduling
- Visual alerts and notifications
- Real-time transcription
- Written communication support

### For General Students

- All standard features
- Accessible course materials
- Inclusive community
- Support resources

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Video hosting with automatic captions
- [ ] AI-powered learning recommendations
- [ ] Assignment submissions with file upload
- [ ] Grade analytics and insights
- [ ] Calendar integration
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Advanced search and filtering
- [ ] Study groups and peer tutoring
- [ ] Virtual office hours

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support & Resources

- **Documentation** - Check README sections above
- **Issues** - Report bugs on GitHub Issues
- **Accessibility** - Test with screen readers and keyboard navigation
- **Performance** - Use Lighthouse for audits

## 👥 Team

- Built with accessibility as the foundation
- Designed for inclusive education
- Community-driven development

## 📞 Contact

For questions or suggestions about SenseAid, please reach out through the Contact page on the website.

---

**Happy Learning! 🎉** - SenseAid Team
#   s e n s a i d 
 
 
# alliva
# Allivaa
