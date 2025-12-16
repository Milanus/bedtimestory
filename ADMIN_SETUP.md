# Admin User Setup Guide

This document explains how to set up and manage admin users in the Bedtime Stories application.

## Overview

Users can be flagged as admins in Firestore, allowing them special privileges. Admin status is stored in the `users` collection with the `isAdmin` field.

## User Data Structure

When a user registers or signs up with Google, their data is saved to the `users` collection:

```typescript
{
  uid: string,           // Firebase Auth UID
  email: string,         // User's email
  displayName: string,   // User's display name
  isAdmin: boolean,      // Admin flag (default: false)
  createdAt: timestamp,  // Account creation time
  updatedAt: timestamp   // Last update time
}
```

## Setting Up the First Admin User

### Method 1: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Firestore Database**
3. Create a new document in the `users` collection:
   - **Document ID**: Use the user's Firebase Auth UID (you can find this in Authentication > Users)
   - **Collection**: `users`
   - **Document fields**:
     ```
     uid: "<user's uid>"
     email: "admin@example.com"
     displayName: "Admin User"
     isAdmin: true
     createdAt: <timestamp>
     updatedAt: <timestamp>
     ```

### Method 2: Using the Admin Utility (Recommended)

Use the `createUser` function from `lib/firebase-admin.ts`:

```typescript
import { createUser } from '@/lib/firebase-admin';

// Create a new admin user
await createUser(
  'admin@example.com',
  'password123',
  'Admin User',
  true // Set as admin
);
```

### Method 3: Using Firebase Admin SDK (Backend Only)

For server-side admin user creation, use Firebase Admin SDK:

```javascript
const admin = require('firebase-admin');

// Initialize Admin SDK with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create user in Auth
const userRecord = await admin.auth().createUser({
  email: 'admin@example.com',
  password: 'password123',
  displayName: 'Admin User',
});

// Set admin status in Firestore
await admin.firestore().collection('users').doc(userRecord.uid).set({
  uid: userRecord.uid,
  email: userRecord.email,
  displayName: userRecord.displayName,
  isAdmin: true,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
});
```

## Managing Admin Users

### Check if a User is Admin

```typescript
import { checkIfUserIsAdmin } from '@/lib/firebase-admin';

const isAdmin = await checkIfUserIsAdmin(userId);
```

### Update User Admin Status

```typescript
import { updateUserAdminStatus } from '@/lib/firebase-admin';

// Make user an admin
await updateUserAdminStatus(userId, true);

// Remove admin privileges
await updateUserAdminStatus(userId, false);
```

### Get User Data

```typescript
import { getUserData } from '@/lib/firebase-admin';

const userData = await getUserData(userId);
console.log(userData?.isAdmin); // true or false
```

## Security Rules

The Firestore security rules (`firestore.rules`) enforce the following:

1. **Read Access**: All authenticated users can read user profiles
2. **Create**: Users can only create their own profile
3. **Update**: 
   - Users can update their own data
   - Users cannot modify the `isAdmin` field directly
   - Admin status can only be changed via backend/server-side operations
4. **Delete**: Users can delete their own account

## Firestore Security Rules for Admin-Only Operations

To enforce admin-only operations on other collections (e.g., delete any story):

```javascript
// In firestore.rules
match /stories/{storyId} {
  allow delete: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
}
```

## Frontend Usage Example

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { checkIfUserIsAdmin } from '@/lib/firebase-admin';

function AdminPanel() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfUserIsAdmin(user.uid).then(setIsAdmin);
    }
  }, [user]);

  if (!user || !isAdmin) {
    return <div>Access denied</div>;
  }

  return <div>Admin Panel Content</div>;
}
```

## Important Notes

1. **Default Admin**: The first admin user must be created manually via Firebase Console or server-side code
2. **Client-Side Restrictions**: Admin status changes should be done server-side to prevent security issues
3. **Authentication Required**: All admin operations require the user to be authenticated
4. **Audit Trail**: All user documents include `createdAt` and `updatedAt` timestamps for audit purposes

## Environment Variables

Ensure your `.env.local` includes all required Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```
