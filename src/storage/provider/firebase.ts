import { randomUUID } from 'crypto';
import 'server-only';

import { getAdminApp, getStorageBucket } from '@/lib/firebase/admin';
import { getStorage } from 'firebase-admin/storage';
import {
  ConfigurationError,
  type PresignedUploadUrlParams,
  StorageError,
  type StorageProvider,
  UploadError,
  type UploadFileParams,
  type UploadFileResult,
} from '../types';

/**
 * Firebase Cloud Storage provider (Admin SDK).
 *
 * Uploaded objects get a download token in their metadata, so we can return a
 * stable, publicly-fetchable URL without flipping object ACLs — which works
 * even on buckets with uniform bucket-level access enabled.
 */
export class FirebaseStorageProvider implements StorageProvider {
  public getProviderName(): string {
    return 'Firebase';
  }

  private bucket() {
    const bucketName = getStorageBucket();
    if (!bucketName) {
      throw new ConfigurationError('Firebase storage bucket is not configured');
    }
    return getStorage(getAdminApp()).bucket(bucketName);
  }

  private generateUniqueFilename(originalFilename: string): string {
    const extension = originalFilename.split('.').pop() || '';
    const uuid = randomUUID();
    return `${uuid}${extension ? `.${extension}` : ''}`;
  }

  private downloadUrl(key: string, token: string): string {
    const bucketName = getStorageBucket();
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
      key
    )}?alt=media&token=${token}`;
  }

  public async uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
    try {
      const { file, filename, contentType, folder } = params;
      const bucket = this.bucket();

      const uniqueFilename = this.generateUniqueFilename(filename);
      const key = folder ? `${folder}/${uniqueFilename}` : uniqueFilename;

      const fileBuffer =
        file instanceof Blob ? Buffer.from(await file.arrayBuffer()) : file;

      const token = randomUUID();
      await bucket.file(key).save(fileBuffer, {
        contentType,
        resumable: false,
        metadata: {
          contentType,
          metadata: { firebaseStorageDownloadTokens: token },
        },
      });

      return { url: this.downloadUrl(key, token), key };
    } catch (error) {
      if (error instanceof ConfigurationError) {
        console.error('uploadFile, configuration error', error);
        throw error;
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred during file upload';
      console.error('uploadFile, error', message);
      throw new UploadError(message);
    }
  }

  public async deleteFile(key: string): Promise<void> {
    try {
      await this.bucket().file(key).delete({ ignoreNotFound: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred during file deletion';
      console.error('deleteFile, error', message);
      throw new StorageError(message);
    }
  }

  /**
   * Pre-signed URL for a direct browser PUT upload (v4). The returned `key` is
   * what the client should reference afterwards.
   */
  public async getPresignedUploadUrl(
    params: PresignedUploadUrlParams
  ): Promise<UploadFileResult> {
    try {
      const { filename, contentType, folder, expiresIn = 3600 } = params;
      const uniqueFilename = this.generateUniqueFilename(filename);
      const key = folder ? `${folder}/${uniqueFilename}` : uniqueFilename;

      const [url] = await this.bucket()
        .file(key)
        .getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: Date.now() + expiresIn * 1000,
          contentType,
        });

      return { url, key };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred while generating presigned URL';
      console.error('getPresignedUploadUrl, error', message);
      throw new StorageError(message);
    }
  }
}
