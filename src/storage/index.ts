// This barrel pulls in the storage providers (firebase-admin / 'server-only'),
// so it must never be imported from a Client Component. Client code uploads via
// `uploadFileFromBrowser` from '@/storage/upload-client' (re-exported below),
// which only talks to the API routes.
import 'server-only';

import { websiteConfig } from '@/config/website';
import { storageConfig } from './config/storage-config';
import { FirebaseStorageProvider } from './provider/firebase';
import { S3Provider } from './provider/s3';
import type { StorageConfig, StorageProvider, UploadFileResult } from './types';

// Re-exported for server-side convenience; client components must import it
// directly from '@/storage/upload-client'.
export { uploadFileFromBrowser } from './upload-client';

/**
 * Default storage configuration
 */
export const defaultStorageConfig: StorageConfig = storageConfig;

/**
 * Global storage provider instance
 */
let storageProvider: StorageProvider | null = null;

/**
 * Get the storage provider
 * @returns current storage provider instance
 * @throws Error if provider is not initialized
 */
export const getStorageProvider = (): StorageProvider => {
  if (!storageProvider) {
    return initializeStorageProvider();
  }
  return storageProvider;
};

/**
 * Initialize the storage provider
 * @returns initialized storage provider
 */
export const initializeStorageProvider = (): StorageProvider => {
  if (!storageProvider) {
    if (websiteConfig.storage.provider === 'firebase') {
      storageProvider = new FirebaseStorageProvider();
    } else if (websiteConfig.storage.provider === 's3') {
      storageProvider = new S3Provider();
    } else {
      throw new Error(
        `Unsupported storage provider: ${websiteConfig.storage.provider}`
      );
    }
  }
  return storageProvider;
};

/**
 * Uploads a file to the configured storage provider
 *
 * @param file - The file to upload (Buffer or Blob)
 * @param filename - Original filename with extension
 * @param contentType - MIME type of the file
 * @param folder - Optional folder path to store the file in
 * @returns Promise with the URL of the uploaded file and its storage key
 */
export const uploadFile = async (
  file: Buffer | Blob,
  filename: string,
  contentType: string,
  folder?: string
): Promise<UploadFileResult> => {
  const provider = getStorageProvider();
  return provider.uploadFile({ file, filename, contentType, folder });
};

/**
 * Deletes a file from the storage provider
 *
 * @param key - The storage key of the file to delete
 * @returns Promise that resolves when the file is deleted
 */
export const deleteFile = async (key: string): Promise<void> => {
  const provider = getStorageProvider();
  return provider.deleteFile(key);
};

/**
 * Generates a pre-signed URL for direct browser uploads
 *
 * @param filename - Filename with extension
 * @param contentType - MIME type of the file
 * @param folder - Optional folder path to store the file in
 * @param expiresIn - Expiration time in seconds (default: 3600)
 * @returns Promise with the pre-signed URL and the storage key
 */
export const getPresignedUploadUrl = async (
  filename: string,
  contentType: string,
  folder?: string,
  expiresIn = 3600
): Promise<UploadFileResult> => {
  const provider = getStorageProvider();
  return provider.getPresignedUploadUrl({
    filename,
    contentType,
    folder,
    expiresIn,
  });
};
