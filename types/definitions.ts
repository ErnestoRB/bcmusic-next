import { IBanner } from "../utils/database/models/Banner";
import { IFontType } from "../utils/database/models/Fonts";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export type BannerRecordWithFonts = IBanner & {
  fonts: IFontType[];
};

export type BannerRecordWithAuthors = IBanner & {
  authors: string[];
};

export interface SpotifyErrorResponse {
  error?: {
    status: number;
    message: string;
  };
}

export interface SpotifyData extends SpotifyErrorResponse {
  error_description?: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface SpotifyTopArtistData extends SpotifyErrorResponse {
  items?: SpotifyArtist[];
  total?: number;
}

export interface SpotifyTopTracksData extends SpotifyErrorResponse {
  items?: SpotifyTracks[];
  total?: number;
}

export interface SpotifyRecommendationsData extends SpotifyErrorResponse {
  tracks?: SpotifyTracks[];
}

export interface SpotifyUserDataID extends SpotifyErrorResponse {
  id?: string;
}

export interface SpotifyCreatedPlaylistTracks extends SpotifyErrorResponse {
  href?: string;
  limit?: number;
  next?: string;
  offset?: number;
  previous?: string;
  total?: number;
  items?: Item[];
}

export interface SpotifyGeneratedPlaylist extends SpotifyErrorResponse {
  id?: string;
  external_urls?: ExternalURLs;
  uri?: string;
}

export interface SpotifyPlaylistSnapshotID extends SpotifyErrorResponse {
  snapshot_id?: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyUserData {
  country: string;
  display_name: string;
  email: string;
  href: string;
  id: string;
  images: SpotifyImage[];
  product: string;
  type: string;
  uri: string;
}

export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

interface ExternalURLs {
  spotify: string;
}

interface ExternalIDs {
  isrc: string;
}

export interface Feedback {
  id?: string;
  userId: string;
  playlistId: string;
  rating: number;
  date: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Artist {
  external_urls: ExternalURLs;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface Item {
  track: SpotifyTracks;
}

interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalURLs;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: Artist[];
}

interface SpotifyTracks {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDs;
  external_urls: ExternalURLs;
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

interface Followers {
  href: null;
  total: number;
}

interface Owner {
  external_urls: ExternalURLs;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalURLs;
  followers: Followers;
  href: string;
  id: string;
  images: any[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: SpotifyTracks;
  type: string;
  uri: string;
  primary_color: null;
}

export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface PaisFields {
  ID: string;
  Nombre: string;
  Nombre_Corto: string;
}

export interface SignUpInput {
  Email: string;
  Apellido: string;
  Nombre: string;
  Contraseña: string;
  Nacimiento: Date;
  Pais: number;
  token: string;
}

export interface Usuario {
  ID: string;
  Nombre: string;
  Apellido: string;
  Usuario: string;
  Contraseña?: string;
  Nacimiento: Date;
  Pais: string;
}
export interface Location {
  lat: number;
  lon: number;
  label: string;
}

export type ResponseData<T> = {
  message: string;
  data?: T;
};

export type EmptyResponse = ResponseData<undefined>;
