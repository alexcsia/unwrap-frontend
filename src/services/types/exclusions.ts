export type Entity = {
  entityType: "track" | "artist";
  name: string;
  id: string;
};

export type Exclusions = {
  artists: {
    type: "artist";
    artistId: string;
    artistName: string;
    excludedAt: Date;
  }[];
  tracks: {
    type: "track";
    trackId: string;
    trackName: string;
    artistName: string;
    albumName: string;
    excludedAt: Date;
  }[];
};

export type CreateExclusionResponse = {
  id: string;
  name: string;
  excludedAt: Date;
};

export type ExclusionsPayload = {
  type: "track" | "artist";
  targetId: string;
};

export type SearchEntityResponse = Entity[];

export type SearchEntityParams = {
  type: "track" | "artist";
  name: string;
  limit: number;
  cursor: string | undefined | null;
};
