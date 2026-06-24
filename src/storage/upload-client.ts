import type { UploadFileResult } from './types';

/**
 * Client-safe storage helpers.
 *
 * This module talks to the storage API routes over fetch ONLY — it imports no
 * storage provider (and therefore no firebase-admin / 'server-only' code), so it
 * is safe to import from Client Components. Server code uses the provider-backed
 * helpers in `@/storage` instead.
 */
const API_STORAGE_UPLOAD = '/api/storage/upload';
const API_STORAGE_PRESIGNED_URL = '/api/storage/presigned-url';
const API_STORAGE_FILE_URL = '/api/storage/file-url';

/**
 * Uploads a file from the browser to the storage provider.
 * Meant to be used in client components.
 *
 * @param file - The file object from an input element
 * @param folder - Optional folder path to store the file in
 * @returns Promise with the URL of the uploaded file
 */
export const uploadFileFromBrowser = async (
  file: File,
  folder?: string
): Promise<UploadFileResult> => {
  try {
    // For small files (< 10MB), use direct upload
    if (file.size < 10 * 1024 * 1024) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder || '');

      const response = await fetch(API_STORAGE_UPLOAD, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message || 'Failed to upload file');
      }

      return await response.json();
    }
    // For larger files, use pre-signed URL

    // First, get a pre-signed URL
    const presignedUrlResponse = await fetch(API_STORAGE_PRESIGNED_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        folder: folder || '',
      }),
    });

    if (!presignedUrlResponse.ok) {
      const error = (await presignedUrlResponse.json()) as { message: string };
      throw new Error(error.message || 'Failed to get pre-signed URL');
    }

    const { url, key } = (await presignedUrlResponse.json()) as {
      url: string;
      key: string;
    };

    // Then upload directly to the storage provider
    const uploadResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file using pre-signed URL');
    }

    // Get the public URL
    const fileUrlResponse = await fetch(API_STORAGE_FILE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });

    if (!fileUrlResponse.ok) {
      const error = (await fileUrlResponse.json()) as { message: string };
      throw new Error(error.message || 'Failed to get file URL');
    }

    return await fileUrlResponse.json();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error occurred during file upload';
    throw new Error(message);
  }
};
