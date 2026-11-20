import { api } from "./api";
import type {
  UploadHistoryPayload,
  UploadHistoryResponse,
} from "./types/upload";

export const uploadSpotifyHistory = ({
  file,
  platform,
}: UploadHistoryPayload) => {
  const formData = new FormData();
  formData.append("history", file);

  return api
    .post<UploadHistoryResponse>(`/api/history/${platform}/upload`, formData)
    .then((r) => r.data);
};
