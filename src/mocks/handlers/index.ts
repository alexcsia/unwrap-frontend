import { authHandlers } from "./auth";
import { profileHandlers } from "./profile";
import { platformHandlers } from "./platforms";
import { statisticsHandlers } from "./statistics";
import { searchHandlers } from "./search";
import { exclusionHandlers } from "./exclusions";
import { recentTracksHandlers } from "./recentTracks";
import { uploadHandlers } from "./upload";

export const handlers = [
  ...authHandlers,
  ...profileHandlers,
  ...platformHandlers,
  ...statisticsHandlers,
  ...searchHandlers,
  ...exclusionHandlers,
  ...recentTracksHandlers,
  ...uploadHandlers,
];
