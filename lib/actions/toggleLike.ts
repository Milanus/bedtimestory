import {
  doc,
  runTransaction,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Toggle like status for a story.
 * Uses a Firestore transaction to ensure atomic updates.
 *
 * @param storyId - The ID of the story to like/unlike
 * @param userId - The ID of the user performing the action
 * @returns Object containing the new like status and updated like count
 */
export async function toggleLike(
  storyId: string,
  userId: string
): Promise<{ liked: boolean; likeCount: number }> {
  const storyRef = doc(db, 'stories', storyId);
  const likeRef = doc(db, 'stories', storyId, 'likes', userId);

  return runTransaction(db, async (transaction) => {
    // Check if the user has already liked this story
    const likeDoc = await transaction.get(likeRef);
    const storyDoc = await transaction.get(storyRef);

    if (!storyDoc.exists()) {
      throw new Error('Story does not exist');
    }

    const currentLikeCount = storyDoc.data()?.likeCount ?? 0;

    if (likeDoc.exists()) {
      // User wants to UNLIKE - remove the like document
      transaction.delete(likeRef);

      // Decrement likeCount (prevent going below 0)
      const newLikeCount = Math.max(0, currentLikeCount - 1);
      transaction.update(storyRef, { likeCount: newLikeCount });

      return { liked: false, likeCount: newLikeCount };
    } else {
      // User wants to LIKE - create the like document
      transaction.set(likeRef, {
        createdAt: serverTimestamp(),
      });

      // Increment likeCount
      transaction.update(storyRef, { likeCount: increment(1) });

      return { liked: true, likeCount: currentLikeCount + 1 };
    }
  });
}

/**
 * Check if a user has liked a specific story.
 *
 * @param storyId - The ID of the story
 * @param userId - The ID of the user
 * @returns Boolean indicating if the user has liked the story
 */
export async function checkUserLiked(
  storyId: string,
  userId: string
): Promise<boolean> {
  const { getDoc } = await import('firebase/firestore');
  const likeRef = doc(db, 'stories', storyId, 'likes', userId);
  const likeDoc = await getDoc(likeRef);
  return likeDoc.exists();
}
