import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Creates a new user with admin privileges
 * @param email - User's email
 * @param password - User's password
 * @param displayName - User's display name
 * @param isAdmin - Admin flag (default: false)
 */
export async function createUser(
  email: string,
  password: string,
  displayName: string,
  isAdmin: boolean = false
) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  
  // Save user data to Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    uid: userCredential.user.uid,
    email,
    displayName,
    isAdmin,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return userCredential.user;
}

/**
 * Updates a user's admin status
 * @param uid - User's UID
 * @param isAdmin - New admin status
 */
export async function updateUserAdminStatus(uid: string, isAdmin: boolean) {
  const { updateDoc } = await import('firebase/firestore');
  const userRef = doc(db, 'users', uid);
  
  await updateDoc(userRef, {
    isAdmin,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Gets a user's data from Firestore
 * @param uid - User's UID
 */
export async function getUserData(uid: string) {
  const { getDoc } = await import('firebase/firestore');
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
}

/**
 * Checks if a user is an admin
 * @param uid - User's UID
 */
export async function checkIfUserIsAdmin(uid: string): Promise<boolean> {
  const userData = await getUserData(uid);
  return userData?.isAdmin || false;
}
