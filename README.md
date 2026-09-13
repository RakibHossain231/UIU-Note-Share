# UIU Note Share 🎓

> **Open Academic Knowledge & Resource Repository for United International University (UIU)**

UIU Note Share is a modern, high-performance web platform built for UIU students across all departments (**CSE, Data Science, EEE, BBA, Civil**). It provides an organized archive of lecture handnotes, midterm & final question solves, class tests (CT), assignments, and cheat sheets with dedicated contributor attribution and a hybrid cloud storage engine (Cloudflare R2 + Google Drive + Supabase).

---

## 🌟 Key Features

1. **Department-Wise Architecture**:
   - Filter resources by **CSE**, **Data Science (DS)**, **EEE**, **BBA**, and **Civil**.
   - Admin can dynamically add new departments at any time.

2. **5 Core Resource Categories per Course**:
   - 📝 **Handwritten Lecture Notes** (Chapter & lecture-wise breakdown)
   - ❓ **Question Solves** (Mid Term & Final Exam with trimester year codes like 231, 241)
   - 🎯 **Class Tests (CT)** (CT-1 to CT-4 questions with step-by-step solves)
   - 📋 **Assignments** (Problem specifications and solution codes)
   - 📌 **Cheat Sheets** (Exam night formula sheets & syntax summaries)

3. **Wall of Contributors (Hall of Fame) 🎖️**:
   - Every single note displays a verified badge: `Contributed by: [Name] ([Dept], [Batch])`.
   - Clickable social profile links (Facebook, LinkedIn, GitHub, Email).
   - Dedicated `/contributors` page honoring everyone who shared resources.

4. **In-Built Fullscreen PDF Reader**:
   - Fast, in-browser PDF preview with Zoom (+ / -), 90-degree Rotation, and Fullscreen.
   - **Night Reading Filter (Dark Mode)** for late-night exam prep without eye fatigue.
   - Automatic Google Drive preview sanitizer and direct download fallback.

5. **One-Click "Download All in ZIP"**:
   - Client-side ZIP packaging powered by **JSZip**.
   - Students can download all handnotes or exam solves for a course in a single click with real-time percentage progress.

6. **Full-Featured Admin Dashboard (`/admin`)**:
   - **Course Wizard**: Create new courses; the system automatically scaffolds all 5 categories.
   - **Resource Publisher**: Upload or link notes via Cloudflare R2 or Google Drive, and assign contributor credit.
   - **Contributor Management**: Add student contributors with their social profile links.
   - **Student Requests Inbox**: Review requests submitted by students.
   - **Cloud Settings**: Configure Cloudflare R2 public domains and buckets.

7. **Corner Cases Handled**:
   - **Zero-item Empty States**: Displays an illustrated message with a "Request Note" modal.
   - **Offline / Weak Wi-Fi Resilience**: Automatic LocalStorage synchronization so the site loads instantly.
   - **Fuzzy Search**: Instant matching for course codes (`CSE 2118`, `cse2118`, `algo`, `spl`).
   - **Mobile-First Responsive Design**: Optimized for smartphones with bottom drawer navigation.

---

## ☁️ Setting Up Cloud Storage (Cloudflare R2 & Google Drive)

### Option A: Cloudflare R2 (10GB Free + Unlimited Downloads)
1. Sign up or log into [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage** and click **Create Bucket** (e.g. `uiu-notes-vault`).
3. Under **Bucket Settings**, enable **R2.dev subdomain** or connect your custom domain (e.g. `https://pub-xxx.r2.dev`).
4. Go to UIU Note Share's **Admin Dashboard > Cloud Storage Settings** and paste your R2 public domain!

### Option B: Google Drive (15GB+ Free per Gmail)
1. Upload your lecture PDFs to Google Drive.
2. Set file sharing permission to: `Anyone with the link can view`.
3. In the Admin Dashboard, select **Storage Type: Google Drive** and paste the link! UIU Note Share automatically formats the embed viewer.

---

## 🛠️ Built With

- **React 18 & TypeScript**
- **Vite 6**
- **Tailwind CSS**
- **React Router v6**
- **JSZip** (Client-side ZIP packaging)
- **Lucide Icons**
- **Cloudflare R2 & Google Drive Hybrid Storage**
- **Supabase / LocalStorage Data Sync**

---

© 2026 UIU Note Share. Developed with ❤️ for UIU students & juniors.
