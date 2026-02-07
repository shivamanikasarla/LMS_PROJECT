# Questions & Discussion - Permissions & Functionality

## ✅ Confirmed Permissions

### **Who Can Post Questions?**
**EVERYONE** - All users can create new questions in the Questions & Doubts board:
- ✅ Students
- ✅ Instructors  
- ✅ Admins

**Configuration:** `allowedPosters: ['all']` in `constants.js`

---

### **Who Can Reply to Questions?**
**EVERYONE** - All users can reply to any question:
- ✅ Students can reply
- ✅ Instructors can reply
- ✅ Admins can reply

**No restrictions on replies** - The reply form is available to all authenticated users.

---

## How It Works

### 1. **Posting a Question (Creating a Thread)**

**Steps:**
1. Navigate to **Community** → **Questions & Doubts**
2. Click the **"+ New Discussion"** button (top right)
3. Fill in the form:
   - **Title** (required)
   - **Content/Description** (required)
   - **Course** (required - select from dropdown)
4. Click **Submit**
5. Question appears in the list immediately

**Access Control:**
```javascript
const canPost = () => {
    const { allowedPosters } = currentBoard;
    if (allowedPosters.includes('all')) return true; // ✅ Returns true for doubts board
    if (allowedPosters.includes(currentUserRole.toLowerCase())) return true;
    return false;
};
```

---

### 2. **Replying to a Question**

**Steps:**
1. Click on any question from the list
2. Read the full question details
3. Scroll down to the **reply section**
4. Type your reply in the text area
5. Click **"Post Reply"** button
6. Reply is added to the thread immediately

**Features:**
- ✅ All users can reply (no restrictions)
- ✅ Replies show author name and role
- ✅ Replies show timestamp
- ✅ Instructors/Admins can mark replies as "Accepted Answer"
- ✅ Instructor replies are marked with verification badge

---

## Board Configuration

### Questions & Doubts Board Settings
```javascript
{
    id: 'doubts',
    name: 'Questions & Doubts',
    description: 'Get help from instructors and peers. Mark answers as resolved.',
    icon: '❓',
    color: '#ef4444', // Red
    accessLevel: 'public',      // ✅ Everyone can access
    allowedPosters: ['all']     // ✅ Everyone can post
}
```

### Comparison with Other Boards

| Board | Who Can Post | Who Can Reply |
|-------|-------------|---------------|
| **Announcements** | Admins & Instructors only | Everyone |
| **Questions & Doubts** | **Everyone** ✅ | **Everyone** ✅ |
| **Peer Discussions** | Everyone | Everyone |
| **Resources & Notes** | Everyone | Everyone |

---

## Special Features

### For Students:
- ✅ Can ask questions
- ✅ Can reply to others' questions
- ✅ Can view all questions and replies
- ✅ Questions grouped by course
- ❌ Cannot mark answers as resolved (instructors only)

### For Instructors & Admins:
- ✅ Can ask questions
- ✅ Can reply to questions
- ✅ Can mark replies as "Accepted Answer"
- ✅ Can mark threads as "Resolved"
- ✅ Replies are highlighted with verification badge
- ✅ Can pin important questions

---

## Reply Form Details

### Location
Bottom of each question detail page (below all existing replies)

### Form Fields
```
┌─────────────────────────────────────────┐
│  Type your reply here...                │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
              [📤 Post Reply]
```

### Validation
- Reply text cannot be empty
- Submit button disabled when:
  - Text area is empty
  - Reply is being submitted (prevents double-post)

---

## User Flow Examples

### Example 1: Student Posts Question
```
1. Student navigates to Questions & Doubts
2. Clicks "New Discussion"
3. Fills form:
   - Title: "How to use useState?"
   - Content: "I'm confused about when to use useState..."
   - Course: "React Course"
4. Submits
5. Question appears in the list under React Course
6. Other students and instructors can now see and reply
```

### Example 2: Instructor Replies
```
1. Instructor sees new question in list
2. Clicks on the question
3. Reads full details
4. Scrolls to reply section
5. Types explanation
6. Clicks "Post Reply"
7. Reply appears with instructor badge
8. Instructor can optionally mark it as "Accepted Answer"
```

### Example 3: Student Replies to Another Student
```
1. Student A posts question
2. Student B sees it, clicks to read
3. Student B types helpful response
4. Posts reply
5. Reply shows up with Student B's name
6. Both students can continue discussion
```

---

## Technical Implementation

### Create Question API
```javascript
communityService.createThread({
    title: "Question title",
    content: "Question description",
    boardId: "doubts",
    courseName: "React Course"
})
```

### Create Reply API
```javascript
communityService.createReply(threadId, {
    content: "Reply text here"
})
```

### No Permission Checks
The Questions & Doubts board has **no permission restrictions** for posting or replying - all authenticated users have full access.

---

## Summary

✅ **Questions & Doubts is a fully open forum** where:
- Any student can ask questions
- Any user (student, instructor, admin) can reply
- Discussions are organized by course
- Instructors can mark helpful answers
- Everyone participates equally in the discussion

This promotes **collaborative learning** and **peer-to-peer support**! 🎓💬

---

**Date:** February 7, 2026  
**Module:** Community - Questions & Discussion  
**Document Type:** Permissions & Functionality Guide
