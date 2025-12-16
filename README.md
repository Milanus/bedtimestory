# 🌙 Bedtime Stories

A modern web application for sharing and discovering magical bedtime stories. Create, browse, and enjoy enchanting tales with a beautiful, immersive reading experience.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- **🖊️ Story Creation**: Write and publish your own bedtime stories with a beautiful editor
- **📚 Browse by Category**: Explore stories organized into 10 magical categories (Adventure, Fantasy, Animals, Fairy Tale, Nature, Space, Friendship, Mystery, Funny, Magical)
- **❤️ Like System**: Show appreciation for your favorite stories
- **🔐 Authentication**: Secure user authentication with Firebase (Email/Password & Google Sign-in)
- **👤 User Profiles**: Personalized author profiles and story management
- **🎨 Modern UI**: Beautiful gradient designs with glassmorphism effects and smooth animations
- **📱 Responsive Design**: Fully responsive layout that works on all devices
- **🌟 Real-time Updates**: Stories update in real-time across all users

## 🛠️ Technologies Used

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React](https://react.dev/)** - UI library

### Backend & Database
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** - User authentication
- **[Cloud Firestore](https://firebase.google.com/docs/firestore)** - NoSQL cloud database
- **[Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)** - Server-side Firebase operations

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project set up
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

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
bedtimestory/
├── app/                      # Next.js app directory
│   ├── browse/              # Browse stories by category
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── stories/             # Story pages (view, edit, new)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── BrowseStoriesContent.tsx
│   ├── DeleteStoryButton.tsx
│   ├── Header.tsx
│   ├── LikeButton.tsx
│   ├── StoryCard.tsx
│   ├── StoryForm.tsx
│   └── StoryList.tsx
├── contexts/                # React contexts
│   └── AuthContext.tsx      # Authentication context
├── lib/                     # Utility functions and actions
│   ├── actions/             # Server actions
│   ├── firebase-admin.ts    # Firebase admin setup
│   └── firebase.ts          # Firebase client setup
├── types/                   # TypeScript type definitions
│   └── story.ts             # Story types and categories
└── public/                  # Static assets
```

## 🎯 Key Features Explained

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

### Story Management
- Create new stories with title, content, and category
- Edit your own stories
- Delete your own stories
- Like/unlike stories (coming from Firebase)

## 🔒 Security

- Firestore security rules enforce data access control
- Server-side validation for all data operations
- Protected API routes with Firebase Admin SDK
- Client-side authentication state management

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
- Firebase for backend services
- Tailwind CSS for the styling system
- All contributors and story writers

---

Made with 💜 for sweet dreams everywhere
