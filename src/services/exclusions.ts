import { api } from "./api";
import type {
  SearchEntityParams,
  SearchEntityResponse,
  Exclusions,
  ExclusionsPayload,
  CreateExclusionResponse,
} from "./types";

export const searchEntity = (params: SearchEntityParams) =>
  api
    .get<{ result: SearchEntityResponse }>("/api/history/search", { params })
    .then((r) => r.data.result);

export const fetchExclusions = () =>
  api
    .get<{ exclusions: Exclusions }>("/api/exclusions")
    .then((r) => r.data.exclusions);

export const createExclusion = (payload: ExclusionsPayload) =>
  api
    .post<CreateExclusionResponse>("/api/exclusions", payload)
    .then((r) => r.data);

export const deleteExclusion = (params: ExclusionsPayload) =>
  api
    .delete<{
      message: string;
    }>(`/api/exclusions/${params.type}/${params.targetId}`)
    .then((r) => r.data);
