# UIU Note Share 🎓

> **Open Academic Knowledge & Resource Repository for United International University (UIU)**  
> 🌐 **Live Website:** [https://uiu-note-share.vercel.app/](https://uiu-note-share.vercel.app/)

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-FF6600?style=for-the-badge&logo=vercel)](https://uiu-note-share.vercel.app/)
[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Cloudflare R2](https://img.shields.io/badge/Storage-Cloudflare_R2-F38020?style=for-the-badge&logo=cloudflare)](https://developers.cloudflare.com/r2/)

---

## 📖 Table of Contents
- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Languages & Technologies Used (Where & Why)](#-languages--technologies-used)
- [System Architecture](#-system-architecture)
- [Security & Authentication](#-security--authentication)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
- [Environment Variables (.env.example)](#-environment-variables)
- [Project Directory Structure](#-project-directory-structure)
- [Contributing](#-contributing)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 💡 About The Project

During exam weeks at **United International University (UIU)**, students frequently struggle with fragmented resources: hunting through Messenger group chats, requesting Google Drive access at 11 PM before an exam, or finding that critical solution files are missing.

**UIU Note Share** was built to solve this exact problem. It is a centralized, community-driven, and high-performance academic archive designed specifically for UIU students across all departments:
- **CSE** (Computer Science & Engineering)
- **Data Science** (DS)
- **EEE** (Electrical & Electronic Engineering)
- **BBA** (Business Administration)
- **Civil Engineering**

### Core Philosophy
- **100% Free & Open Access:** Students can browse, read, and download any note or exam solve instantly with zero subscription gates or forced account creation.
- **Credit Where Credit Is Due:** Every shared document honors the student or CR who contributed it with verified badges and social profile links.
- **Built for Exam Night Cramming:** Split-screen comparison, smart zooming, and client-side watermarking built right into the browser.

---

## ✨ Key Features

### 1. 📑 Organized Academic Structure per Course
Each course automatically organizes academic resources into five distinct, standardized categories:
- 📝 **Handwritten Lecture Notes:** Topic-wise and chapter-wise lecture notes from faculty classes and class toppers.
- ❓ **Midterm Questions & Solves:** Past midterm question papers paired with detailed, step-by-step verified solutions indexed by trimester codes (e.g., 231, 233, 241).
- 🎯 **Final Exam Questions & Solves:** Comprehensive final examination archives with solutions.
- 📋 **Class Tests (CT):** CT 1 to 4 questions and solves for continuous assessment preparation.
- 💻 **Assignments & Lab Reports:** Lab experiment codes, manual solutions, and assignment guidelines.
- 📌 **Formula Sheets & Cheatsheets:** Quick exam-night syntax cheatsheets and formula summaries.

### 2. 🖥️ Multi-Tab & Split-Screen PDF Viewer
- **Side-by-Side Comparison (Split View):** View a question paper in the left pane and its solution in the right pane simultaneously.
- **Smart Zoom with `Ctrl + Mouse Scroll`:** Smoothly zoom in and out (+10% / -10%) directly over documents while holding `Ctrl`, with active pane focus and an instant floating zoom badge.
- **Default 145% Optimal Zoom:** Opens every note at a crisp, legible scale tailored for reading handwriting. One click on the zoom badge resets it back to 145%.
- **Night Reading Filter:** Invert filter toggle for late-night study sessions to prevent eye strain.
- **Tactile Window Controls:** Dedicated Maximize/Fullscreen, highlighted Amber Minimize button, and Rose Close button.
- **Floating Minimize Dock:** Minimize open documents into a bottom-right dock (`⚡ Notes Open`) to freely navigate courses while keeping reading sessions alive.
- **`+ Add Note` with Auto-Scroll:** Clicking `+` inside the tab bar minimizes the reader and smoothly scrolls the user directly to the original note on the course page with an orange pulse glow, making selecting a second note (like a solve) effortless.

### 3. 🛡️ Two-Factor Authentication (2FA) with Real Email OTP
- **Admin Control Center:** Protected by an enterprise-grade two-step verification workflow.
- **Real Email OTP via EmailJS:** Step 1 validates the master password, generating a cryptographically secure 6-digit one-time code sent directly to the registered administrator email.
- **Strict Verification:** No hardcoded bypass codes. Access is granted only when the exact OTP delivered to the inbox is submitted within its 5-minute lifespan.
- **Security Protections:** 2-minute real-time resend timer, 5-attempt brute-force limit with an automatic 15-minute security lockout.

### 4. 🗜️ One-Click Client-Side Bulk ZIP Download
- Powered by **JSZip**, students can download all resources of a category or course in one single ZIP package without server bandwidth bottlenecks.
- Features a real-time progress bar modal displaying live download and archiving progress.

### 5. 💧 Client-Side Watermark Injection
- Uses **pdf-lib** to dynamically apply custom watermarks to downloaded PDFs directly in the user's browser, stamping contributor credit and protecting community notes from unauthorized commercial reuse.

### 6. 🔖 Course Pinning & Persistent State
- Students can "Pin" their active trimester courses to the top of the homepage for instant one-click access. Pinned courses persist across sessions via LocalStorage.

### 7. 🎖️ Wall of Contributors (Hall of Fame)
- Dedicated `/contributors` page celebrating every student who shared notes, displaying their batch, department, contribution count, and verified social links (LinkedIn, GitHub, Facebook, Email).

---

## 💻 Languages & Technologies Used

Here is an exact breakdown of each language and technology used in this project, where it is implemented, and the specific role it plays:

| Language / Technology | File Extension | Where It Is Used | Purpose & Implementation Details |
| :--- | :--- | :--- | :--- |
| **TypeScript** | `.ts`, `.tsx` | `src/components/`<br>`src/pages/`<br>`src/services/`<br>`src/context/`<br>`src/types/` | **Primary Language:** Provides 100% type safety across the entire application. Defines strict data interfaces (`ResourceItem`, `Course`, `Contributor`, `Department`), handles custom React hooks, and powers all backend and UI logic. |
| **HTML5 & JSX** | `.tsx`, `index.html` | `src/` root and components | **Markup & Semantics:** Renders responsive DOM structure, modern accessible web tags, client-side canvas elements for document processing, and embedded reader viewports. |
| **CSS3 & Tailwind CSS** | `.css`, `.tsx` | `src/index.css`<br>`tailwind.config.js`<br>All `.tsx` files | **Styling & Design System:** Utility-first styling including custom UIU Orange (`#FF6600`), OLED dark mode (`#121212`, `#1A1A1A`), glassmorphism backdrop blurs (`backdrop-blur-md`), animations, responsive grid layouts, and custom scrollbars. |
| **SQL** | `.sql` | Supabase Cloud Database | **Relational Data Management:** PostgreSQL database schema powering cloud sync for courses, academic resources, contributors, requests, and pending student submissions with Row-Level Security (RLS). |
| **JavaScript (ESM)** | `.js`, `.mjs`, `.ts` | Root configs (`vite.config.ts`, `postcss.config.js`) | **Build & Bundler Tooling:** Orchestrates modern ES modules compilation, Vite tree-shaking, fast hot-module replacement (HMR), and production minification. |
| **JSON** | `.json` | `package.json`<br>`tsconfig.json`<br>`vercel.json` | **Configuration & Routing:** Manages NPM packages, strict TypeScript compiler options, and SPA wildcard rewrites on Vercel deployment. |

### Key Libraries & SDKs
- **React 18 (`react`, `react-dom`):** Declarative component-based UI rendering.
- **React Router v6 (`react-router-dom`):** Client-side SPA routing (`/`, `/course/:courseId`, `/contributors`, `/admin`, `/how-to-use`, `/about`).
- **pdf-lib:** In-browser PDF manipulation and watermark stamping.
- **JSZip:** Asynchronous client-side file compression for bulk downloads.
- **Lucide React (`lucide-react`):** Clean, consistent vector iconography.
- **Supabase JS Client (`@supabase/supabase-js`):** PostgreSQL cloud database client.
- **EmailJS REST API:** Direct browser-to-email OTP dispatching for administrative 2FA.

---

## 🏗️ System Architecture

UIU Note Share utilizes a **Hybrid Multi-Tier Storage Architecture** designed for zero-downtime, unlimited free bandwidth, and fast loading:

```
[ UIU Student Browser ]
         │
         ├───► [ React 18 SPA + Tailwind CSS (Vercel CDN) ]
         │
         ├───► [ Data & State Layer: DataContext + LocalStorage (Offline Resilient) ]
         │            │
         │            └───► [ Supabase PostgreSQL (Cloud Database Sync) ]
         │
         ├───► [ Document Storage Engine (Hybrid) ]
         │            │
         │            ├───► [ Cloudflare R2 Bucket (High-Speed Direct CDN) ]
         │            └───► [ Google Drive API / Preview Embed (Universal Fallback) ]
         │
         └───► [ Admin Authentication (2FA) ]
                      │
                      └───► [ EmailJS API ──► Real 6-Digit OTP to Admin Email ]
```

---

## 🔐 Security & Authentication

- **No Public Credentials:** All production keys, API secrets, and sensitive URLs are strictly encapsulated in environment variables (`.env`) and are never exposed in public repositories.
- **Two-Factor Authentication (2FA):** Access to `/admin` requires both master credentials and a real-time OTP delivered to the administrator's personal inbox via EmailJS.
- **Client-Side Sanitization:** Direct download URLs from Google Drive and Cloudflare R2 are sanitized to prevent open-redirect vulnerabilities.
- **Brute-Force Lockout:** Automatically halts login attempts for 15 minutes after 5 consecutive incorrect passwords or OTP codes.

---

## 🚀 Getting Started (Local Setup)

Follow these steps to run UIU Note Share locally on your machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.0.0 or higher recommended)
- `npm` or `yarn` / `pnpm`
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/RakibHossain231/UIU-Note-Share.git
cd UIU-Note-Share
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory by copying the example format:
```bash
cp .env.example .env
```
*(Fill in your own Supabase and EmailJS keys as shown in the section below).*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port indicated in your terminal).

### 5. Build for Production
To verify TypeScript compilation and create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🔑 Environment Variables

Create a file named `.env` in the root of your project with the following keys:

```env
# Supabase Configuration (Optional for cloud sync; falls back gracefully to LocalStorage)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here

# EmailJS Configuration (Required for Admin 2FA Email OTP delivery)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
```

> **Note:** Never commit your `.env` file to version control. The repository includes `.env` inside `.gitignore` by default.

---

## 📁 Project Directory Structure

```text
UIU-Note-Share/
├── public/                     # Static assets (favicons, manifest, icons)
├── src/
│   ├── components/             # Reusable UI Components
│   │   ├── BulkDownloadModal.tsx   # Progress modal for ZIP generation
│   │   ├── CategoryScrollIcon.tsx  # Dynamic SVG category icons
│   │   ├── ContributeModal.tsx     # Student note submission modal
│   │   ├── ContributorBadge.tsx    # Contributor pill with social links
│   │   ├── CourseCard.tsx          # Course card with pin bookmark
│   │   ├── DepartmentFilter.tsx    # Department switcher (CSE, DS, EEE, etc.)
│   │   ├── EmptyState.tsx          # Illustrated zero-item fallback
│   │   ├── Footer.tsx              # Application footer & university credits
│   │   ├── Navbar.tsx              # Navigation bar with theme toggle & search
│   │   ├── NoteCard.tsx            # Resource card with read & download actions
│   │   ├── PdfModalViewer.tsx      # Multi-tab, split-screen PDF reader engine
│   │   ├── RequestNoteModal.tsx    # Student missing note request form
│   │   ├── ScrollToTop.tsx         # Route change scroll position reset
│   │   └── SocialIcons.tsx         # Vector social media link icons
│   │
│   ├── context/                # Global State Management
│   │   ├── DataContext.tsx         # Central store for courses, resources & sync
│   │   └── ThemeContext.tsx        # Dark / Light theme provider
│   │
│   ├── data/                   # Default Seed Data & Catalogs
│   │   ├── courses.ts              # UIU course list & trimester mappings
│   │   ├── departments.ts          # Department info & preset color themes
│   │   └── seedResources.ts        # Initial verified resources & contributors
│   │
│   ├── pages/                  # Top-Level Route Views
│   │   ├── AboutPage.tsx           # Mission, story, and developer bio
│   │   ├── AdminDashboard.tsx      # Secure 2FA dashboard for resource management
│   │   ├── ContributorsPage.tsx    # Wall of Contributors (Hall of Fame)
│   │   ├── CourseDetailPage.tsx    # Course category hub & trimester grid
│   │   ├── HomePage.tsx            # Hero banner, department filter, search
│   │   └── HowToUsePage.tsx        # Comprehensive user and contributor guide
│   │
│   ├── services/               # Core Logic & Integration Services
│   │   ├── analyticsService.ts     # Course access counters & metrics
│   │   ├── cloudflareR2Service.ts  # Cloudflare R2 bucket integration
│   │   ├── emailOtpService.ts      # 2FA 6-digit OTP generator & EmailJS client
│   │   ├── pdfWatermarkService.ts  # Client-side watermark stamping with pdf-lib
│   │   ├── storageService.ts       # LocalStorage caching & persistence
│   │   ├── supabaseClient.ts       # Supabase client initializer
│   │   ├── supabaseService.ts      # Cloud database sync operations
│   │   └── zipDownloadService.ts   # Client-side batch ZIP packaging with JSZip
│   │
│   ├── types/                  # TypeScript Interfaces & Enums
│   │   └── index.ts                # Course, ResourceItem, Contributor types
│   │
│   ├── utils/                  # Helper Utilities
│   │   └── trimesterHelper.ts      # Trimester code parser (e.g., 231 -> Spring 2023)
│   │
│   ├── App.tsx                 # Application root & React Router route definitions
│   ├── index.css               # Global styles, Tailwind directives & animations
│   └── main.tsx                # React DOM entry point
│
├── .gitignore                  # Git ignore rules (protects .env and node_modules)
├── index.html                  # HTML5 template entry point
├── package.json                # Project dependencies and build scripts
├── postcss.config.js           # PostCSS configuration
├── README.md                   # Comprehensive public documentation
├── tailwind.config.js          # Tailwind CSS theme & color palette customization
├── tsconfig.json               # TypeScript compiler configuration
└── vercel.json                 # Vercel SPA routing rewrite rules
```

---

## 🤝 Contributing

Contributions from students, teachers, and developers are warmly welcomed!

### Sharing Notes & Solves
You don't need to be a developer to contribute:
1. Visit [UIU Note Share](https://uiu-note-share.vercel.app/).
2. Click the **"Contribute Note"** button in the navigation bar.
3. Submit your lecture notes or exam solves with your name and batch to be honored on the **Wall of Contributors**.

### Code Contributions
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m "Add some AmazingFeature"`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 👨‍💻 Author & Acknowledgments

- **Developed by:** **Rakib Hossain** (Department of CSE, United International University — Batch 231)
- **Live Demo:** [https://uiu-note-share.vercel.app/](https://uiu-note-share.vercel.app/)
- **GitHub:** [@RakibHossain231](https://github.com/RakibHossain231)
- **LinkedIn:** [Rakib Hossain](https://www.linkedin.com/in/rakibhossain231)
- **Email:** [rakibhossain0308@gmail.com](mailto:rakibhossain0308@gmail.com)

---

<p align="center">
  Developed with ❤️ for the students and juniors of <strong>United International University (UIU)</strong>.<br/>
  <em>Knowledge grows when shared.</em>
</p>
