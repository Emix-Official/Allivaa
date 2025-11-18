# SenseAid - Quick Start Guide

Welcome to SenseAid! Get up and running in less than 5 minutes.

## 🚀 Installation (1 minute)

```bash
cd alliva-universal
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. That's it!

## 🎓 First Steps

### 1. Explore the Home Page

- Beautiful landing page with feature highlights
- Information about accessibility for Blind, Mute, and Deaf students
- Call-to-action buttons for Sign Up and Get Started

### 2. Try the Login

- Click "Get Started" or go to `/login`
- Use any email and password (demo uses mock authentication)
- Example: `student@university.edu` / `password123`

### 3. View Your Dashboard

After login, you'll see:

- **Stats Cards** showing active courses, assignments, grade, and achievements
- **Your Courses** with progress tracking
- **Upcoming Deadlines** with assignment due dates
- **Quick Actions** for messaging and materials

### 4. Test Accessibility Features

- Click the **Settings button** (⚙️) in the navigation
- Try different font sizes (Small, Normal, Large, XLarge)
- Toggle High Contrast, Screen Reader, and other accessibility features
- Changes apply instantly!

### 5. Browse Courses

- Go to **Courses** from navigation
- Search for courses by name or code
- Filter by difficulty level (Beginner, Intermediate, Advanced)
- View course resources and instructor info
- Click "Enroll Now" to join

### 6. Send Messages

- Navigate to **Messages**
- Select a conversation from the left panel
- Type and send messages to instructors and peers
- Create new conversations with the **+** button

### 7. Read the Blog

- Visit **Blog** for educational articles
- Featured posts on accessibility and study tips
- Subscribe to the newsletter

## 🎨 Key Features Overview

### Navigation Bar

- **SenseAid Logo** - Click to go home
- **Menu Items** - Home, Courses, Dashboard, Messages, Profile, Blog
- **Settings Icon** - Access accessibility panel
- **Mobile Menu** - Hamburger menu on smaller screens

### Accessibility Panel

Located in Settings (⚙️):

- **Font Size** - Small, Normal, Large, XLarge
- **High Contrast** - Toggle for better visibility
- **Screen Reader Optimization** - For accessible navigation
- **Reduce Motion** - Disable animations
- **Enable Captions** - For video content
- **Braille Mode** - Support for braille devices
- **Reset to Defaults** - Revert all changes

### Modern Design

- Gradient backgrounds (Blue → Purple → Pink)
- Smooth animations with Framer Motion
- Fully responsive on mobile, tablet, desktop
- Dark theme for eye comfort
- Hover effects and transitions on interactive elements

## 📚 Available Pages

| Route        | Description                              |
| ------------ | ---------------------------------------- |
| `/`          | Home/Landing page with features          |
| `/login`     | User login (demo: any email/password)    |
| `/dashboard` | Student dashboard with stats and courses |
| `/courses`   | Browse and enroll in courses             |
| `/messages`  | Chat with instructors and peers          |
| `/blog`      | Educational articles and resources       |
| `/profile`   | (Coming soon) Student profile            |

## 🛠️ Project Structure Quick Reference

```
src/
├── app/
│   ├── page.tsx              ← Home page
│   ├── layout.tsx            ← Root layout
│   ├── login/page.tsx        ← Login page
│   ├── dashboard/page.tsx    ← Dashboard
│   ├── courses/page.tsx      ← Courses catalog
│   ├── messages/page.tsx     ← Messaging
│   └── blog/page.tsx         ← Blog
├── components/
│   ├── Navigation.tsx        ← Nav bar
│   └── AccessibilityPanel.tsx ← Settings panel
├── store/
│   ├── authStore.ts          ← User auth state
│   └── accessibilityStore.ts ← Accessibility settings
└── types/
    └── index.ts              ← TypeScript definitions
```

## 🎯 Customization Tips

### Change Colors

Edit gradient colors in components:

```jsx
className = "bg-gradient-to-r from-blue-500 to-purple-500";
```

### Add New Pages

1. Create folder: `src/app/new-page/`
2. Create file: `page.tsx`
3. Import `Navigation` component
4. Add link in `Navigation.tsx`

### Update Content

- Home page content in `/src/app/page.tsx`
- Courses data in `/src/app/courses/page.tsx`
- Blog posts in `/src/app/blog/page.tsx`

## 🔧 Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Check code style
```

## 🐛 Troubleshooting

**Build fails?**

```bash
npm install
npm run build
```

**Port 3000 already in use?**

```bash
npm run dev -- -p 3001
```

**Need to reset styles?**
Click "Reset to Defaults" in the Accessibility Settings panel.

## 📱 Responsive Breakpoints

The app is fully responsive:

- **Mobile** - Works great on phones
- **Tablet** - Optimized for tablets
- **Desktop** - Full experience on larger screens

Try resizing your browser window to see responsive design in action!

## ♿ Accessibility Testing

Test the accessibility features:

1. **Enable Screen Reader Optimization** - Tab through pages
2. **Use High Contrast** - Check readability
3. **Adjust Font Size** - Try XLarge
4. **Reduce Motion** - Disable animations
5. **Test Keyboard** - Try navigating with Tab key

## 🎓 For Students

### Blind Students

- Enable **Screen Reader Optimization**
- Enable **High Contrast**
- Enable **Braille Mode**
- Use keyboard navigation

### Mute Students

- Use **Messaging** for communication
- Text-based chat with instructors
- Submit written assignments

### Deaf Students

- Enable **Captions** (for video features)
- Visual notifications in Messages
- Written communication

## 🚀 Next Steps

1. **Explore the code** - Check out components and pages
2. **Add your content** - Customize courses and blog posts
3. **Extend features** - Add more pages and functionality
4. **Deploy** - Host on Vercel, Netlify, or your server

## 📚 More Resources

- **README.md** - Full documentation
- **Tailwind CSS** - Styling utility classes
- **Framer Motion** - Animation library docs
- **Next.js** - React framework documentation

## 💡 Tips

- Use the **Dashboard** as a template for other pages
- Copy **Courses** page to create similar catalog pages
- Check **Navigation.tsx** for navigation patterns
- Review **AccessibilityPanel.tsx** for form components

## 🤝 Support

- Check the full README.md for detailed documentation
- Review component examples in the `src/` directory
- Test features in the browser developer tools
- Check console for any errors

---

**Happy exploring! 🎉** Start building amazing features for your students.
