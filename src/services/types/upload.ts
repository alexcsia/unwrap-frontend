import type { Platform } from "@/components/fileUpload/FileUploader.vue";

export interface UploadHistoryPayload {
  file: File;
  platform: Platform;
}

export interface UploadHistoryResponse {
  success: boolean;
  message: string;
}
