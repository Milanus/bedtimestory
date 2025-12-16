import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

// Maximum file size: 20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

export interface UploadProgress {
  progress: number;
  url?: string;
  error?: string;
}

/**
 * Upload an image file to Firebase Storage
 * @param file - The image file to upload
 * @param storyId - The ID of the story
 * @param onProgress - Callback for upload progress
 * @returns Promise with the download URL
 */
export async function uploadStoryImage(
  file: File,
  storyId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image file size must be less than 20MB');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  const storageRef = ref(storage, `stories/${storyId}/image_${Date.now()}_${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Error uploading image:', error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

/**
 * Upload a sound file to Firebase Storage
 * @param file - The sound file to upload
 * @param storyId - The ID of the story
 * @param onProgress - Callback for upload progress
 * @returns Promise with the download URL
 */
export async function uploadStorySound(
  file: File,
  storyId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Sound file size must be less than 20MB');
  }

  // Validate file type
  if (!file.type.startsWith('audio/')) {
    throw new Error('File must be an audio file');
  }

  const storageRef = ref(storage, `stories/${storyId}/sound_${Date.now()}_${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Error uploading sound:', error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

/**
 * Delete a file from Firebase Storage
 * @param fileUrl - The download URL of the file to delete
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}