# Like/Heart System Implementation

## Setup

### 1. Firebase Configuration

Update the `.env.local` file with your Firebase project credentials:

```bash
# Get these from: Firebase Console → Project Settings → General → Your apps
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Deploy Firestore Security Rules

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

### 3. Firestore Database Schema

**Story Document:**
```typescript
{
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  likeCount: number;  // ← New field (was averageRating)
  createdAt: timestamp;
  updatedAt?: timestamp;
}
```

**Likes Sub-collection:**
```
stories/{storyId}/likes/{userId}/
  └── createdAt: timestamp
```

## Usage

### Using the LikeButton Component

```tsx
import LikeButton from '@/components/LikeButton';
import { checkUserLiked } from '@/lib/actions/toggleLike';

// In your page component
async function StoryPage({ params, currentUser }) {
  const storyId = params.id;
  
  // Fetch story and check if user liked it
  const story = await getStory(storyId);
  const userHasLiked = currentUser 
    ? await checkUserLiked(storyId, currentUser.uid) 
    : false;
  
  return (
    <div>
      <h1>{story.title}</h1>
      
      <LikeButton
        storyId={storyId}
        userId={currentUser.uid}
        initialLikeCount={story.likeCount}
        initialUserHasLiked={userHasLiked}
      />
    </div>
  );
}
```

### Using toggleLike Function Directly

```tsx
import { toggleLike } from '@/lib/actions/toggleLike';

async function handleLike(storyId: string, userId: string) {
  const result = await toggleLike(storyId, userId);
  console.log('Liked:', result.liked);
  console.log('New count:', result.likeCount);
}
```

## Key Features

✅ **Optimistic UI** - Instant feedback on button click  
✅ **Error Recovery** - Reverts on failure  
✅ **Firestore Transaction** - Atomic like count updates  
✅ **Security Rules** - Users can only like/unlike their own  
✅ **TypeScript** - Full type safety  
✅ **Accessibility** - ARIA labels and keyboard support  

## Testing

The like count will never go below 0 (transaction prevents it).

### Example Story Data

```javascript
// stories/some-story-id
{
  title: "The Magic Forest",
  content: "Once upon a time...",
  authorId: "user123",
  authorName: "Jane Doe",
  likeCount: 42,
  createdAt: Timestamp.now()
}

// stories/some-story-id/likes/user456
{
  createdAt: Timestamp.now()
}
```

## Files Created

- `lib/firebase.ts` - Firebase initialization
- `lib/actions/toggleLike.ts` - Like/unlike transaction logic
- `components/LikeButton.tsx` - UI component
- `firestore.rules` - Security rules
- `types/story.ts` - TypeScript interfaces
- `app/stories/[id]/page.tsx` - Example usage
- `.env.local` - Environment variables template
