# 🌙 Bedtime Stories

A modern web application for sharing and discovering magical bedtime stories. Create, browse, and enjoy enchanting tales with a beautiful, immersive reading experience.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- **🖊️ Story Creation**: Write and publish your own bedtime stories with a beautiful editor
- **🖼️ Image Upload**: Add a title image to your stories (max 20MB)
- **🎵 Background Sound**: Upload background audio to enhance the storytelling experience (max 20MB)
- **📚 Browse by Category**: Explore stories organized into 10 magical categories (Adventure, Fantasy, Animals, Fairy Tale, Nature, Space, Friendship, Mystery, Funny, Magical)
- **❤️ Like System**: Show appreciation for your favorite stories
- **🔐 Authentication**: Secure user authentication with Firebase (Email/Password & Google Sign-in)
- **👤 User Profiles**: Personalized author profiles and story management
- **👑 Admin Dashboard**: Admin users can manage all stories and users on the platform
- **🎨 Modern UI**: Beautiful gradient designs with glassmorphism effects and smooth animations
- **📱 Responsive Design**: Fully responsive layout that works on all devices
- **🌟 Real-time Updates**: Stories update in real-time across all users
- **🛡️ App Check**: reCAPTCHA v3 protection against abuse
- **☁️ Cloud Storage**: Images and sounds stored securely in Firebase Storage

## 🛠️ Technologies Used

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React](https://react.dev/)** - UI library

### Backend & Database
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** - User authentication
- **[Cloud Firestore](https://firebase.google.com/docs/firestore)** - NoSQL cloud database
- **[Firebase Storage](https://firebase.google.com/docs/storage)** - File storage for images and audio
- **[Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)** - Server-side Firebase operations
- **[Firebase App Check](https://firebase.google.com/docs/app-check)** - Abuse protection with reCAPTCHA v3

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project set up
- reCAPTCHA v3 site key (get from Firebase Console → App Check)
- Firebase Storage enabled
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bedtimestory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Authentication** (Email/Password and Google)
   - Enable **Firestore Database**
   - Enable **Storage**
   - Enable **App Check** with reCAPTCHA v3

4. **Configure Firebase Storage Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /stories/{storyId}/{allPaths=**} {
         // Allow authenticated users to upload files up to 20MB
         allow write: if request.auth != null 
                      && request.resource.size < 20 * 1024 * 1024;
         // Allow anyone to read
         allow read: if true;
       }
     }
   }
   ```

5. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   
   # reCAPTCHA v3 Site Key (from Firebase App Check)
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

8. **Set up your first admin user** (See [ADMIN_SETUP.md](ADMIN_SETUP.md))

## 📁 Project Structure

```
bedtimestory/
├── app/                      # Next.js app directory
│   ├── browse/              # Browse stories by category
│   ├── dashboard/           # User/Admin dashboard
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── stories/             # Story pages (view, edit, new)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── BrowseStoriesContent.tsx
│   ├── DashboardContent.tsx
│   ├── DeleteStoryButton.tsx
│   ├── Header.tsx
│   ├── LikeButton.tsx
│   ├── StoryCard.tsx
│   ├── StoryForm.tsx
│   ├── StoryList.tsx
│   └── UserList.tsx
├── contexts/                # React contexts
│   └── AuthContext.tsx      # Authentication context
├── hooks/                   # Custom React hooks
│   └── useAdmin.tsx         # Admin status hook
├── lib/                     # Utility functions and actions
│   ├── actions/             # Server actions
│   │   ├── storyActions.ts  # Story CRUD operations
│   │   └── userActions.ts   # User management
│   ├── firebase-admin.ts    # Firebase admin setup
│   ├── firebase-storage.ts  # Storage upload utilities
│   └── firebase.ts          # Firebase client + App Check setup
├── types/                   # TypeScript type definitions
│   ├── story.ts             # Story types and categories
│   └── user.ts              # User types
└── public/                  # Static assets
```

## 🎯 Key Features Explained

### Media Upload System
- **Title Images**: Add visual appeal with cover images (JPEG, PNG, GIF, WebP)
- **Background Sounds**: Enhance storytelling with audio (MP3, WAV, OGG)
- **File Size Limit**: 20MB maximum for both images and sounds
- **Progress Indicators**: Real-time upload progress bars
- **Cloud Storage**: All media stored securely in Firebase Storage
- **Automatic Cleanup**: Old files can be managed through Firebase Console

### Story Categories
Stories are organized into 10 categories:
- 🗺️ Adventure
- 🧚 Fantasy
- 🐻 Animals
- 👸 Fairy Tale
- 🌲 Nature
- 🚀 Space
- 💕 Friendship
- 🔮 Mystery
- 😄 Funny
- ✨ Magical

### Authentication System
- Email/Password registration and login
- Google Sign-in integration
- Protected routes for authenticated users
- User profile management
- Automatic user document creation in Firestore

### Story Management
- Create new stories with title, content, category, image, and sound
- Edit your own stories
- Delete your own stories
- Like/unlike stories with real-time counter
- Browse and filter by category
- Responsive image displays
- Audio player with loop capability

### Admin Dashboard
- **For Regular Users**:
  - View and manage their own stories
  - See statistics (story count, total likes)
  
- **For Admin Users**:
  - View all platform stories
  - Manage all users (promote/demote admins)
  - See platform-wide statistics
  - Tab interface to switch between Stories and Users

## 🔒 Security

- **Firebase App Check** with reCAPTCHA v3 protects against abuse
- **Storage Rules** limit file sizes and require authentication for uploads
- Firestore security rules enforce data access control
- Server-side validation for all data operations
- Protected API routes with Firebase Admin SDK
- Client-side authentication state management
- Admin-only operations protected server-side

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services, storage, and App Check
- Google reCAPTCHA for abuse protection
- Tailwind CSS for the styling system
- All contributors and story writers

---

Made with 💜 for sweet dreams everywhere
