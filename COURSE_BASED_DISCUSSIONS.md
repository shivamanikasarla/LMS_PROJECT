# Questions & Doubts - Course-Based Discussion System

## 🎯 New Structure

The Questions & Doubts board now uses a **course-based navigation system** where discussions are organized by course.

---

## User Flow

### Step 1: View Available Courses
When you open Questions & Doubts, you see a grid of **course cards**:

```
┌─────────────────────────────────────────────────┐
│  Questions & Doubts                             │
│  Get help from instructors and peers...         │
└─────────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┐
│  📖      │  📖      │  📖      │
│  React   │  Python  │  Node.js │
│  Course  │  Basics  │  Advanced│
│  12 q's  │  8 q's   │  15 q's  │
└──────────┴──────────┴──────────┘
```

### Step 2: Click on a Course
Select the course you want to explore/discuss:

```
← Back to Courses

┌────────────────────────────────────────────────┐
│  📖 React Course                               │
│  Ask questions and discuss topics related to  │
│  this course                                   │
└────────────────────────────────────────────────┘

[+ New Question]

┌────────────────────────────────────────────────┐
│  How to use useState hook properly?            │
│  I'm having trouble understanding when to...   │
├────────────────────────────────────────────────┤
│  Error in component rendering                  │
│  My component shows an error "Cannot read...   │
├────────────────────────────────────────────────┤
│  📌 Best practices for performance              │
│  What are the recommended approaches for...    │
└────────────────────────────────────────────────┘
```

### Step 3:Post Questions or Reply
- Click **"+ New Question"** to ask a new question (auto-fills the course)
- Click on any question to view full details and reply

---

## Features

### ✅ Course Cards (Selection View)
- **Grid layout** - Clean, card-based design
- **Course icon** - Book emoji with colored background
- **Course name** - Clear heading
- **Question count** - Shows how many questions exist
- **Hover effect** - Cards lift up on hover

### ✅ Inside Course (Discussion View)
- **Back button** - Return to course selection
- **Course header** - Shows course name and description
- **Questions list** - All questions for THIS course only
- **New Question button** - Post a question in this course
- **Title + Description** - Each question shows title and preview

### ✅ Question Display
- ✅ Title (bold, prominent)
- ✅ Description preview (first 150 characters)
- ❌ NO course tag (already inside the course)
- ❌ NO status badges
- ❌ NO reply counts
- ❌ NO author/date in list

---

## How It Works

### 1. **Viewing Courses**
```javascript
// Available courses extracted from questions
const availableCourses = [...new Set(threads.map(t => t.courseName).filter(Boolean))];

// Each course shows:
- Course name
- Number of questions (threads) in that course
```

### 2. **Selecting a Course**
```javascript
// When user clicks a course card:
setSelectedCourse(courseName);

// This filters questions to show only that course's questions:
threads.filter(t => t.courseName === selectedCourse)
```

### 3. **Creating Questions**
- "New Question" button appears ONLY when inside a course
- Modal automatically pre-fills the selected course
- Question is posted to that specific course

### 4. **Replying to Questions**
- Click any question → Opens detail page
- Anyone can reply (students, instructors, admins)
- Replies work the same as before

---

## User Experience

### For Students:
1. Open Questions & Doubts
2. See all available courses as cards
3. Click on the course they're enrolled in
4. See questions specific to that course
5. Ask new questions or reply to existing ones
6. Click "Back to Courses" to switch to another course

### For Instructors:
1. Open Questions & Doubts
2. See all courses they teach
3. Click on a course to see student questions
4. Answer questions or mark as resolved
5. Switch between courses easily

---

## Technical Implementation

### State Management
```javascript
const [selectedCourse, setSelectedCourse] = useState(null);

 // null = show course cards
// "React Course" = show questions for React Course
```

### Conditional Rendering
```javascript
{boardId === 'doubts' ? (
    selectedCourse ? (
        // Show questions for selected course
        <CourseDiscussionView />
    ) : (
        // Show course selection cards
        <CoursesGrid />
    )
) : (
    // Other boards...
)}
```

### Files Modified

**1. `ChannelFeed.jsx`**
- Added `selectedCourse` state
- Added course cards grid view
- Added course discussion view
- Modified "New Question" button logic
- Passed `defaultCourse` to modal

**2. `Community.css`**
- Added `.courses-grid` styles
- Added `.course-card` styles
- Added `.course-header-box` styles
- Added `.back-to-courses-btn` styles
- Added `.course-discussion-view` styles

---

## Visual Design

### Course Cards
```css
- Grid layout (responsive)
- White background with border
- 64px icon circle (indigo background)
- Hover: lift up + shadow + border color change
- Stats showing question count
```

### Course Header (Inside Course)
```css
- Gradient background (indigo to white)
- Large book icon
- Course name (bold, large)
- Description text
- Full width banner
```

### Back Button
```css
- Arrow left icon + "Back to Courses" text
- White background, bordered
- Hover: border turns indigo, text turns indigo
- Subtle left slide animation
```

---

## Benefits

1. **Better Organization** - Questions grouped by course context
2. **Focused Discussions** - Students see only relevant questions
3. **Easy Navigation** - Clear course selection → discussion flow
4. **Auto-Context** - New questions automatically tagged to course
5. **Scalability** - Works well with many courses
6. **Visual Clarity** - Course cards make it easy to find discussions

---

## Example Scenarios

### Scenario 1: Student Asks Question
```
1. Student opens Questions & Doubts
2. Sees "React Course", "Python Basics", "Node.js" cards
3. Clicks "React Course"
4. Views existing React questions
5. Clicks "+ New Question"
6. Modal opens with "Course: React Course" pre-filled
7. Enters title: "How to use useEffect?"
8. Enters description
9. Submits
10. Question appears in React Course discussion
```

### Scenario 2: Instructor Answers
```
1. Instructor opens Questions & Doubts
2. Sees all course cards
3. Clicks "React Course" (course they teach)
4. Sees student questions
5. Clicks on "How to use useEffect?"
6. Reads full question
7. Types detailed answer
8. Posts reply (shows with instructor badge)
```

### Scenario 3: Cross-Course Learning
```
1. Student enrolled in multiple courses
2. Opens Questions & Doubts
3. Checks "React Course" discussions
4. Clicks "Back to Courses"
5. Checks "Python Basics" discussions
6. Switches between courses easily
```

---

## Permissions

### Who Can:
- ✅ **View Courses**: Everyone
- ✅ **Enter Course**: Everyone  
- ✅ **Post Questions**: Everyone (students, instructors, admins)
- ✅ **Reply**: Everyone
- ✅ **Mark Resolved**: Instructors & Admins only

---

## Summary

The Questions & Doubts board is now a **course-based discussion platform** where:

1. **First**: Choose a course (from cards)
2. **Then**: See questions for that course
3. **Then**: Ask questions or reply  

This creates **organized, context-specific discussions** that are easy to navigate and maintain! 📚💬

---

**Date:** February 7, 2026  
**Module:** Community - Questions & Doubts  
**Feature:** Course-Based Navigation System  
**Impact:** High - Complete restructure of discussion organization
