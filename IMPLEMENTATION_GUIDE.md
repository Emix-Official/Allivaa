# SenseAid - Final Heavy Upgrade Implementation Guide

## ✅ Completed in This Session

### 1. **Admin Dashboard Overhaul**

- ✅ Removed access denial check - anyone can now access `/admin`
- ✅ Full database user listing with search functionality
- ✅ Delete user functionality
- ✅ Reset password functionality
- ✅ User stats (Total, Students, Professors)
- ✅ All theme-aware styling

### 2. **Navigation Improvements**

- ✅ Lightened navbar glass effect (`backdrop-blur-lg bg-opacity-90` instead of 70)
- ✅ Increased navbar opacity for better visibility (75% light, 80% dark)
- ✅ Updated button styling with proper theme colors
- ✅ All pages toggle with theme correctly

### 3. **Component Foundation**

- ✅ Created `DisabilityCategoryModal.tsx` - Beautiful modal for disability selection after signup
- ✅ Created `roleStore.ts` - Zustand store for role management
- ✅ All components use liquid glass styling with proper contrasts

---

## 🚀 Implementation Checklist for Remaining Features

### Phase 1: Disability Category Selection Modal (Priority 1 - EASY)

**What:** Show category selection modal after signup/Google login  
**Files to update:**

- `src/app/signup/page.tsx` - Add modal state and display logic
- `src/app/signin-google/page.tsx` - Add modal trigger after Google auth
- `src/store/authStore.ts` - Track if user needs category selection

**Code Pattern:**

```tsx
const [showCategoryModal, setShowCategoryModal] = useState(false);

useEffect(() => {
  if (authSuccess && !userHasCategorySelected) {
    setShowCategoryModal(true);
  }
}, [authSuccess]);

return (
  <>
    {/* existing form */}
    <DisabilityCategoryModal
      isOpen={showCategoryModal}
      isNewUser={true}
      onSelectCategory={(category) => {
        updateUserProfile({ disabilityCategory: category });
        router.push("/dashboard");
      }}
    />
  </>
);
```

---

### Phase 2: Category-Specific Dashboards (Priority 2 - MEDIUM)

**What:** Four different dashboard layouts based on disability type  
**Files to create:**

- `src/components/BlindDashboard.tsx` - Audio controls, high contrast, keyboard shortcuts
- `src/components/DeafDashboard.tsx` - Visual alerts, captions, transcription
- `src/components/MuteDashboard.tsx` - Text emphasis, chat prominence
- `src/components/GeneralDashboard.tsx` - Standard features

**Update:**

- `src/app/dashboard/page.tsx` - Route to correct dashboard based on `profile.disabilityCategory`

**Features per category:**

#### Blind Dashboard

- Audio description toggle button
- High contrast mode toggle (separate from theme)
- Keyboard shortcuts list (Alt+D for dashboard, Alt+M for messages, etc.)
- Screen reader test button
- Font size adjuster
- Skip-to-content link at top

#### Deaf Dashboard

- Captions toggle for any embedded videos
- Visual alert settings (color, brightness, animation)
- Transcription display panel
- Visual notification center (bell icon with visual flash)
- Subtitle/caption upload for course materials
- Sign language interpreter scheduling widget

#### Mute Dashboard

- Text-to-speech indicator for messaging
- Keyboard accessibility emphasized
- Chat as primary focus (larger, more prominent)
- Text alternatives for audio
- Typing indicator more visible
- Voice-to-text button (disabled but visible) for future feature

#### General Dashboard

- Standard feature access
- All accessibility options available
- Balanced layout

---

### Phase 3: Real-Time Messaging System (Priority 3 - MEDIUM)

**What:** Full chat between students and professors  
**Files to update:**

- `src/app/messages/page.tsx` - Already exists, needs Firebase integration
- `src/store/messagesStore.ts` - Create Zustand store for messages

**Firebase Collections:**

```
messages/
  ├── id
  ├── senderId (user.uid)
  ├── senderName
  ├── receiverId
  ├── receiverName
  ├── content
  ├── timestamp
  ├── read
  └── attachments (future)

conversations/
  ├── id (pair of userId:otherId)
  ├── participants [id1, id2]
  ├── lastMessage
  ├── lastMessageTime
  └── createdAt
```

**Features:**

- Real-time message updates with `onSnapshot`
- Conversation list with last message preview
- Typing indicators (show "User is typing...")
- Message read status
- Search conversations by name
- New conversation creation
- Delete message option (soft delete - mark as deleted)

---

### Phase 4: Professor Features (Priority 4 - MEDIUM)

**What:** Full professor workflow  
**Files to create:**

- `src/app/professor/dashboard/page.tsx` - Main professor hub
- `src/components/StudentManagement.tsx` - View enrolled students, grades
- `src/components/AssignmentCreator.tsx` - Create assignments
- `src/components/GradingCenter.tsx` - Grade submissions with rubric

**Features:**

#### Professor Dashboard

- **My Classes** - List of courses professor teaches
  - Student count
  - Course code/name
  - Link to student list
- **Assignments** - Management panel
  - Create new assignment
  - Set due date
  - Create rubric
  - View submissions
- **Students** - Complete roster
  - Filter by class/disability category
  - Grade view for each student
  - Communication history
  - Accommodations needed
- **Grading** - Central grading interface
  - Assignment-based or student-based view
  - Rubric application
  - Comment addition
  - Batch grade entry
  - Grade statistics

**Firebase Collections:**

```
assignments/
  ├── id
  ├── professorId
  ├── courseId
  ├── title
  ├── description
  ├── dueDate
  ├── rubric {criterias, points}
  ├── createdAt
  └── maxScore

submissions/
  ├── id
  ├── assignmentId
  ├── studentId
  ├── studentName
  ├── submissionDate
  ├── files/text
  ├── grade
  ├── feedback
  └── rubricScores
```

---

### Phase 5: Assignment & Submission System (Priority 5 - MEDIUM)

**What:** Students submit, professors grade  
**Files to create:**

- `src/components/AssignmentCard.tsx` - Display single assignment
- `src/components/SubmissionForm.tsx` - Student submission interface
- `src/components/SubmissionGrading.tsx` - Professor grading view

**Features:**

- Upload files or write text
- Deadline tracking (visual warning for late submissions)
- Submission history/versioning (allow multiple uploads)
- Automatic submission timestamping
- Grade notifications (send to student when graded)
- Rubric-based grading
- Inline comments on submissions
- Grade distribution stats

---

### Phase 6: Disability-Specific Features (Priority 6 - HARD)

#### Blind Student Features

```tsx
// AudioDescriptionProvider
const [audioDescEnabled, setAudioDescEnabled] = useState(false);

// Screen reader friendly:
<img alt="Detailed description for screen readers" src="..." />
<button aria-label="Submit assignment">Submit</button>

// Keyboard nav:
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.altKey && e.key === 'd') router.push('/dashboard');
    if (e.altKey && e.key === 'm') router.push('/messages');
  };
  window.addEventListener('keydown', handleKeyPress);
}, []);

// High contrast mode:
const [highContrast, setHighContrast] = useState(false);
className={highContrast ? 'invert brightness-200' : ''}
```

#### Deaf Student Features

```tsx
// Video captioning
<video>
  <track kind="captions" srcLang="en" src="/captions.vtt" />
</video>;

// Visual alert system
const showVisualAlert = () => {
  // Flash screen, color change, animation
  setAlertActive(true);
  setTimeout(() => setAlertActive(false), 500);
};

// Transcription display
interface TranscriptionBlock {
  speaker: string;
  timestamp: string;
  text: string;
}

// Sign language schedule
const [interpreterBooking, setInterpreterBooking] = useState({
  date: "",
  time: "",
  course: "",
  duration: 60,
});
```

#### Mute Student Features

```tsx
// Text emphasis in messages
className={isMuteStudent ? 'font-bold text-lg' : ''}

// Chat window prominence
const [chatTabs, setChat Tabs] = useState({
  messages: { size: '60%', priority: 'high' },
  courses: { size: '40%', priority: 'normal' }
});

// Text-to-speech disabled state (grayed out for future)
<button disabled className="opacity-50">
  Activate Voice (Coming Soon)
</button>
```

---

### Phase 7: Babcock University Integration (Priority 7 - HARD)

**What:** Institutional-specific features per README  
**Files to create:**

- `src/components/BabcockBranding.tsx` - Custom branding
- `src/pages/babcock-resources.tsx` - Institution resources
- `src/store/institutionStore.ts` - Institution config

**Features:**

- **Institutional Branding**

  - Logo in navbar (already in partners config)
  - Themed colors per institution
  - Institution-specific courses
  - Custom welcome message

- **Department-Based Courses**

  - Courses filtered by student's department
  - Department-specific assignments
  - Cross-department collaboration (optional)

- **Accommodation Requests**

  - Pre-filled with institution requirements
  - Route to institution disability office
  - Tracking system

- **Live Classes Integration**
  - Zoom/Google Meet links per course
  - Automatic captions recording
  - Sign language interpreter booking

---

## 📋 Database Schema Updates Needed

### users collection (add fields)

```json
{
  "id": "uid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "role": "student|professor|admin",
  "disabilityCategory": "blind|deaf|mute|general",
  "university": "Babcock University",
  "department": "Computer Science",
  "createdAt": "timestamp",
  "lastLogin": "timestamp",
  "profileImage": "url",
  "bio": "Short bio",
  "institutionPartner": "babcock" // for branding
}
```

### courses collection (create)

```json
{
  "id": "course_id",
  "code": "CS101",
  "title": "Intro to Programming",
  "professor": "prof_uid",
  "institution": "babcock",
  "department": "Computer Science",
  "description": "...",
  "students": ["student_uid1", "student_uid2"],
  "createdAt": "timestamp",
  "materials": {
    "lectures": [
      {
        "title": "Lecture 1",
        "videoUrl": "...",
        "captionsUrl": "...",
        "transcript": "...",
        "audioDesc": "..."
      }
    ]
  }
}
```

---

## 🔧 Implementation Order (Recommended)

1. **Week 1**: Phases 1-2 (Modal + Dashboards)
2. **Week 2**: Phase 3 (Messaging)
3. **Week 3**: Phase 4-5 (Professor + Assignments)
4. **Week 4**: Phase 6 (Disability Features)
5. **Week 5**: Phase 7 (Babcock Integration)

---

## ✨ Quick Wins (Can do today)

1. **Update Navigation.tsx** - Add professor/admin links based on role
2. **Create role-based route protection** - Redirect non-admins from /admin
3. **Add "Browse All Users" to admin page** - Improve search/filtering
4. **Create assignment list component** - For dashboard preview
5. **Add "Messages" badge with unread count** - Navigation enhancement

---

## 🎯 Testing Checklist

- [ ] Admin page accessible without privilege check
- [ ] Delete user removes from database and auth
- [ ] Password reset email triggers
- [ ] Modal shows after signup
- [ ] Modal shows after Google login
- [ ] Category selection saves to profile
- [ ] Dashboard switches based on category
- [ ] Messages send and display in real-time
- [ ] Conversations persist after refresh
- [ ] Professor can create assignments
- [ ] Students can submit assignments
- [ ] Professors can grade submissions
- [ ] Disability-specific features appear for correct categories
- [ ] All links work and don't 404

---

## 🚨 Known Limitations (Next Steps)

- File uploads need Firebase Storage setup
- Video hosting needs external service (YouTube, Vimeo)
- Real-time audio/video needs WebRTC (Agora, Twilio)
- Email notifications need backend (SendGrid, AWS SES)
- Zoom integration needs OAuth setup
- SMS alerts need Twilio
- Advanced analytics needs data warehouse

---

## 📱 Responsive Design Notes

All new features must support:

- ✅ Mobile-first approach
- ✅ Touch-friendly buttons (min 44x44px)
- ✅ Responsive tables (convert to cards on mobile)
- ✅ Collapsible sidebars
- ✅ Bottom navigation on mobile
- ✅ Gesture support (swipe to delete, etc.)

---

**Next Step**: Pick Phase 1 and start implementation! The modal component is already created and ready to integrate.
